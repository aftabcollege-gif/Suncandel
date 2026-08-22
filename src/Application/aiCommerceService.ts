import { and, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  aiEvaluationRuns,
  aiInferences,
  aiModelRegistry,
  aiPipelineJobs,
  aiRecommendationSnapshots,
  aiSearchLogs,
  categories,
  customerActivities,
  customerIntelligenceProfiles,
  customers,
  instagramConnections,
  instagramMessages,
  marketingAutomationRules,
  marketingAutomationRuns,
  orderItems,
  orders,
  productVariants,
  products,
  stores,
  vendors,
} from "@/db/schema";
import { AppError } from "@/Shared/errors";
import { writeAuditLog } from "@/Shared/audit";
import { hashToken } from "@/Shared/security";
import { classifyIntent, extractQuantity, jaccardSimilarity, normalizeFa, tokenizeFa } from "@/Domain/ai/nlp";

type ProductProjection = {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  discountPercent: string;
  categoryId: string | null;
  storeId: string;
};

type AIProviderResponse = {
  content: string;
  reasoning: string[];
};

interface AIProvider {
  key: string;
  generateCustomerAnswer(input: {
    query: string;
    recommendations: Array<{ id: string; title: string; score: number; reason: string }>;
  }): Promise<AIProviderResponse>;
  generateVendorCopy(input: {
    productName: string;
    attributes?: Record<string, unknown>;
    categoryHint?: string;
    priceHint?: number;
  }): Promise<AIProviderResponse>;
}

class RuleBasedProvider implements AIProvider {
  key = "rule-based-local";

  async generateCustomerAnswer(input: {
    query: string;
    recommendations: Array<{ id: string; title: string; score: number; reason: string }>;
  }): Promise<AIProviderResponse> {
    const intent = classifyIntent(input.query);
    const top = input.recommendations.slice(0, 3);

    const reasons = top.map((item) => `«${item.title}» به‌دلیل ${item.reason}`);
    const content =
      top.length === 0
        ? "بر اساس اطلاعات فعلی محصول دقیقی پیدا نشد؛ پیشنهاد می‌کنم بازه قیمت یا مناسبت را دقیق‌تر بفرمایید."
        : `بر اساس درخواست شما (${intent}) این گزینه‌ها مناسب هستند: ${top
            .map((t) => t.title)
            .join("، ")}.

دلایل انتخاب:
- ${reasons.join("\n- ")}`;

    return {
      content,
      reasoning: [
        `intent=${intent}`,
        `candidate_count=${input.recommendations.length}`,
        "logic=text-similarity+category-signal",
      ],
    };
  }

  async generateVendorCopy(input: {
    productName: string;
    attributes?: Record<string, unknown>;
    categoryHint?: string;
    priceHint?: number;
  }): Promise<AIProviderResponse> {
    const attrs = Object.entries(input.attributes ?? {})
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join("، ");

    const title = `${input.productName} | ${input.categoryHint ?? "محصول دست‌ساز"} ویژه SUN`;
    const description = `این ${input.productName} با کیفیت بالا و طراحی خاص ارائه می‌شود. ${
      attrs ? `مشخصات کلیدی: ${attrs}.` : ""
    } مناسب هدیه، دکور و استفاده روزمره.`;
    const seo = `خرید ${input.productName} با بهترین قیمت${
      input.priceHint ? ` حدود ${input.priceHint.toLocaleString("fa-IR")} تومان` : ""
    } از SUN`;

    return {
      content: `${title}\n\n${description}\n\nSEO: ${seo}`,
      reasoning: ["logic=template+attribute-enrichment", "model=rule-based-local"],
    };
  }
}

const provider: AIProvider = new RuleBasedProvider();

function toNum(v: string | number | null | undefined) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  return Number(v);
}

function dedupeRanked(items: Array<{ productId: string; score: number; reason: string }>) {
  const map = new Map<string, { productId: string; score: number; reason: string }>();
  for (const item of items) {
    const existing = map.get(item.productId);
    if (!existing || existing.score < item.score) {
      map.set(item.productId, item);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.score - a.score);
}

export class AICommerceService {
  private async ensureModelRegistry(tenantId: string, modelKey: string) {
    await db
      .insert(aiModelRegistry)
      .values({
        tenantId,
        modelKey,
        provider: provider.key,
        version: "1.0.0",
        status: "active",
        config: { inferenceMode: "deterministic", explainable: true },
      })
      .onConflictDoNothing();

    const rows = await db
      .select()
      .from(aiModelRegistry)
      .where(and(eq(aiModelRegistry.tenantId, tenantId), eq(aiModelRegistry.modelKey, modelKey)))
      .orderBy(desc(aiModelRegistry.createdAt))
      .limit(1);

    return rows[0] ?? null;
  }

  private async logInference(input: {
    tenantId: string;
    actorUserId?: string;
    modelRegistryId?: string | null;
    inferenceType:
      | "customer_assistant"
      | "vendor_copilot"
      | "recommendation"
      | "search"
      | "social_message"
      | "automation"
      | "analytics";
    inputPayload: Record<string, unknown>;
    outputPayload: Record<string, unknown>;
    explainability: Record<string, unknown>;
    latencyMs: number;
  }) {
    await db.insert(aiInferences).values({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId ?? null,
      modelRegistryId: input.modelRegistryId ?? null,
      inferenceType: input.inferenceType,
      inputPayload: input.inputPayload,
      outputPayload: input.outputPayload,
      explainability: input.explainability,
      latencyMs: input.latencyMs,
    });
  }

  private async resolveCustomerByUser(tenantId: string, userId: string) {
    const rows = await db
      .select()
      .from(customers)
      .where(and(eq(customers.tenantId, tenantId), eq(customers.userId, userId)))
      .limit(1);
    return rows[0] ?? null;
  }

  private async getTenantProducts(tenantId: string, storeId?: string) {
    const clauses = [eq(products.tenantId, tenantId), isNull(products.deletedAt), eq(products.status, "published")];
    if (storeId) clauses.push(eq(products.storeId, storeId));

    const rows = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        basePrice: products.basePrice,
        discountPercent: products.discountPercent,
        categoryId: products.categoryId,
        storeId: products.storeId,
      })
      .from(products)
      .where(and(...clauses));

    return rows as ProductProjection[];
  }

  async computeCustomerIntelligence(input: { tenantId: string; userId: string }) {
    const customer = await this.resolveCustomerByUser(input.tenantId, input.userId);
    if (!customer) {
      throw new AppError("پروفایل مشتری برای تحلیل یافت نشد", 404, "CUSTOMER_NOT_FOUND");
    }

    const activities = await db
      .select()
      .from(customerActivities)
      .where(eq(customerActivities.customerId, customer.id));

    const customerOrders = await db
      .select({ id: orders.id, totalAmount: orders.totalAmount, createdAt: orders.createdAt })
      .from(orders)
      .where(and(eq(orders.customerId, customer.id), eq(orders.tenantId, input.tenantId)));

    const orderIds = customerOrders.map((o) => o.id);
    const items =
      orderIds.length === 0
        ? []
        : await db
            .select({ productId: orderItems.productId, quantity: orderItems.quantity, unitPrice: orderItems.unitPrice })
            .from(orderItems)
            .where(inArray(orderItems.orderId, orderIds));

    const viewedTokens = activities
      .filter((a) => a.type === "product_view" || a.type === "search")
      .flatMap((a) => tokenizeFa(JSON.stringify(a.meta)));

    const tokenCounts = new Map<string, number>();
    viewedTokens.forEach((token) => tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1));

    const purchases = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, o) => sum + toNum(o.totalAmount), 0);
    const avgOrderValue = purchases > 0 ? totalSpent / purchases : 0;

    const segment =
      purchases >= 8 ? "vip" : purchases >= 3 ? "active" : purchases >= 1 ? "new_buyer" : "new";

    const buyingPattern = {
      purchases,
      totalSpent,
      avgOrderValue,
      favoriteHours: this.estimateFavoriteHours(customerOrders.map((o) => o.createdAt)),
      topProducts: this.topCounts(items.map((i) => i.productId)).slice(0, 5),
    };

    const preferenceProfile = {
      topKeywords: Array.from(tokenCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([k, c]) => ({ keyword: k, score: c })),
    };

    const existing = await db
      .select()
      .from(customerIntelligenceProfiles)
      .where(eq(customerIntelligenceProfiles.customerId, customer.id))
      .limit(1);

    if (existing[0]) {
      const updated = await db
        .update(customerIntelligenceProfiles)
        .set({
          preferenceProfile,
          interestProfile: { productAffinity: this.topCounts(items.map((i) => i.productId)).slice(0, 10) },
          buyingPattern,
          segment,
          lastComputedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(customerIntelligenceProfiles.customerId, customer.id))
        .returning();
      return updated[0];
    }

    const created = await db
      .insert(customerIntelligenceProfiles)
      .values({
        tenantId: input.tenantId,
        customerId: customer.id,
        preferenceProfile,
        interestProfile: { productAffinity: this.topCounts(items.map((i) => i.productId)).slice(0, 10) },
        buyingPattern,
        segment,
        aiConsent: Boolean((customer.preferences as Record<string, unknown> | null)?.aiConsent),
        lastComputedAt: new Date(),
      })
      .returning();

    return created[0];
  }

  private topCounts(values: string[]) {
    const map = new Map<string, number>();
    values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  }

  private estimateFavoriteHours(dates: Array<Date | string>) {
    const hourMap = new Map<number, number>();
    for (const dateRaw of dates) {
      const d = new Date(dateRaw);
      const h = d.getHours();
      hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
    }

    return Array.from(hourMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour, count }));
  }

  async recommendHomepage(input: { tenantId: string; userId?: string; storeId?: string }) {
    const started = Date.now();
    const model = await this.ensureModelRegistry(input.tenantId, "recommendation-hybrid");
    const catalog = await this.getTenantProducts(input.tenantId, input.storeId);

    const newest = [...catalog]
      .sort((a, b) => String(b.id).localeCompare(String(a.id)))
      .slice(0, 8)
      .map((p) => ({ productId: p.id, score: 0.35, reason: "newest" }));

    const popularityRows = await db.execute(sql`
      select oi.product_id, count(*)::int as cnt
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.tenant_id = ${input.tenantId}
      group by oi.product_id
      order by cnt desc
      limit 30
    `);

    const popular = Array.from(popularityRows.rows).map((row) => ({
      productId: String(row.product_id),
      score: Math.min(1, Number(row.cnt) / 10),
      reason: "popular",
    }));

    let personalized: Array<{ productId: string; score: number; reason: string }> = [];

    if (input.userId) {
      const customer = await this.resolveCustomerByUser(input.tenantId, input.userId);
      if (customer) {
        const profileRows = await db
          .select()
          .from(customerIntelligenceProfiles)
          .where(eq(customerIntelligenceProfiles.customerId, customer.id))
          .limit(1);

        const profile = profileRows[0] ?? (await this.computeCustomerIntelligence({ tenantId: input.tenantId, userId: input.userId }));

        if (profile.aiConsent) {
          personalized = await this.personalizedHybrid(input.tenantId, customer.id, catalog);
        }
      }
    }

    const combined = dedupeRanked([...personalized, ...popular, ...newest]).slice(0, 18);

    await db.insert(aiRecommendationSnapshots).values({
      tenantId: input.tenantId,
      customerId: input.userId ? (await this.resolveCustomerByUser(input.tenantId, input.userId))?.id ?? null : null,
      contextType: "homepage",
      recommendations: combined,
    });

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.userId,
      modelRegistryId: model?.id,
      inferenceType: "recommendation",
      inputPayload: { context: "homepage", storeId: input.storeId ?? null },
      outputPayload: { count: combined.length },
      explainability: { methods: ["content-based", "collaborative", "popularity", "newest"] },
      latencyMs: Date.now() - started,
    });

    return this.mapRecommendationProducts(combined, catalog);
  }

  private async personalizedHybrid(tenantId: string, customerId: string, catalog: ProductProjection[]) {
    const customerOrderRows = await db
      .select({ orderId: orders.id })
      .from(orders)
      .where(and(eq(orders.tenantId, tenantId), eq(orders.customerId, customerId)));

    const customerOrderIds = customerOrderRows.map((o) => o.orderId);

    const purchasedItems =
      customerOrderIds.length === 0
        ? []
        : await db
            .select({ productId: orderItems.productId })
            .from(orderItems)
            .where(inArray(orderItems.orderId, customerOrderIds));

    const purchasedProductIds = purchasedItems.map((i) => i.productId);

    const contentBased = catalog
      .filter((p) => !purchasedProductIds.includes(p.id))
      .map((p) => {
        const maxSimilarity = Math.max(
          0,
          ...catalog
            .filter((x) => purchasedProductIds.includes(x.id))
            .map((x) => jaccardSimilarity(`${x.title} ${x.description}`, `${p.title} ${p.description}`))
        );

        const categoryBoost = catalog.some(
          (x) => purchasedProductIds.includes(x.id) && x.categoryId && x.categoryId === p.categoryId
        )
          ? 0.22
          : 0;

        return {
          productId: p.id,
          score: maxSimilarity * 0.65 + categoryBoost,
          reason: "content_based",
        };
      })
      .filter((item) => item.score > 0.1)
      .slice(0, 30);

    const collaborative = await this.collaborativeCandidates(tenantId, customerId, purchasedProductIds);

    return dedupeRanked([
      ...contentBased.map((x) => ({ ...x, score: x.score * 0.6 + 0.05 })),
      ...collaborative.map((x) => ({ ...x, score: x.score * 0.4 + 0.1 })),
    ]);
  }

  private async collaborativeCandidates(tenantId: string, customerId: string, purchasedProductIds: string[]) {
    if (purchasedProductIds.length === 0) return [] as Array<{ productId: string; score: number; reason: string }>;

    const others = await db.execute(sql`
      select oi2.product_id, count(*)::int as cnt
      from order_items oi1
      join orders o1 on o1.id = oi1.order_id
      join orders o2 on o2.customer_id = o1.customer_id and o2.id <> o1.id
      join order_items oi2 on oi2.order_id = o2.id
      where o1.tenant_id = ${tenantId}
      and o1.customer_id <> ${customerId}
      and oi1.product_id = any(${sql.raw(`ARRAY[${purchasedProductIds.map((id) => `'${id}'`).join(",")}]::uuid[]`)})
      group by oi2.product_id
      order by cnt desc
      limit 40
    `);

    return Array.from(others.rows).map((row) => ({
      productId: String(row.product_id),
      score: Math.min(1, Number(row.cnt) / 8),
      reason: "collaborative",
    }));
  }

  private mapRecommendationProducts(
    ranked: Array<{ productId: string; score: number; reason: string }>,
    catalog: ProductProjection[]
  ) {
    return ranked
      .map((r) => {
        const p = catalog.find((item) => item.id === r.productId);
        if (!p) return null;
        return {
          productId: p.id,
          title: p.title,
          description: p.description,
          basePrice: toNum(p.basePrice),
          discountPercent: toNum(p.discountPercent),
          score: Number(r.score.toFixed(3)),
          reason: r.reason,
          buyLink: `/products/${p.id}`,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }

  async recommendForProduct(input: { tenantId: string; productId: string }) {
    const started = Date.now();
    const model = await this.ensureModelRegistry(input.tenantId, "recommendation-product-context");

    const catalog = await this.getTenantProducts(input.tenantId);
    const target = catalog.find((p) => p.id === input.productId);
    if (!target) {
      throw new AppError("محصول برای پیشنهاد یافت نشد", 404, "PRODUCT_NOT_FOUND");
    }

    const similar = catalog
      .filter((p) => p.id !== target.id)
      .map((p) => {
        const sim = jaccardSimilarity(`${target.title} ${target.description}`, `${p.title} ${p.description}`);
        const categoryBoost = target.categoryId && p.categoryId === target.categoryId ? 0.25 : 0;
        return { productId: p.id, score: sim + categoryBoost, reason: "similar_product" };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    const togetherRows = await db.execute(sql`
      select oi2.product_id, count(*)::int as cnt
      from order_items oi1
      join order_items oi2 on oi1.order_id = oi2.order_id and oi2.product_id <> oi1.product_id
      join orders o on o.id = oi1.order_id
      where o.tenant_id = ${input.tenantId} and oi1.product_id = ${input.productId}
      group by oi2.product_id
      order by cnt desc
      limit 12
    `);

    const together = Array.from(togetherRows.rows).map((row) => ({
      productId: String(row.product_id),
      score: Math.min(1, Number(row.cnt) / 7),
      reason: "bought_together",
    }));

    const hybrid = dedupeRanked([...similar, ...together]).slice(0, 14);

    await this.logInference({
      tenantId: input.tenantId,
      modelRegistryId: model?.id,
      inferenceType: "recommendation",
      inputPayload: { context: "product", productId: input.productId },
      outputPayload: { count: hybrid.length },
      explainability: { methods: ["similarity", "co-purchase"] },
      latencyMs: Date.now() - started,
    });

    return this.mapRecommendationProducts(hybrid, catalog);
  }

  async recommendForCart(input: { tenantId: string; variantIds: string[] }) {
    const catalog = await this.getTenantProducts(input.tenantId);

    const selectedProductsRows = await db
      .select({ productId: productVariants.productId })
      .from(productVariants)
      .where(inArray(productVariants.id, input.variantIds));

    const selectedProductIds = [...new Set(selectedProductsRows.map((r) => r.productId))];

    const coPurchaseRows = await db.execute(sql`
      select oi2.product_id, count(*)::int as cnt
      from order_items oi1
      join order_items oi2 on oi1.order_id = oi2.order_id and oi2.product_id <> oi1.product_id
      join orders o on o.id = oi1.order_id
      where o.tenant_id = ${input.tenantId}
      and oi1.product_id = any(${sql.raw(`ARRAY[${selectedProductIds.map((id) => `'${id}'`).join(",") || "'00000000-0000-0000-0000-000000000000'"}]::uuid[]`)})
      group by oi2.product_id
      order by cnt desc
      limit 20
    `);

    const candidates = Array.from(coPurchaseRows.rows)
      .map((row) => ({
        productId: String(row.product_id),
        score: Math.min(1, Number(row.cnt) / 6),
        reason: "cross_sell",
      }))
      .filter((x) => !selectedProductIds.includes(x.productId));

    const result = dedupeRanked(candidates).slice(0, 12);
    return this.mapRecommendationProducts(result, catalog);
  }

  async recommendAfterPurchase(input: { tenantId: string; orderId: string }) {
    const catalog = await this.getTenantProducts(input.tenantId);

    const purchasedRows = await db
      .select({ productId: orderItems.productId })
      .from(orderItems)
      .where(eq(orderItems.orderId, input.orderId));

    const purchasedIds = [...new Set(purchasedRows.map((p) => p.productId))];

    if (purchasedIds.length === 0) {
      return [];
    }

    const followUpRows = await db.execute(sql`
      select oi2.product_id, count(*)::int as cnt
      from orders o1
      join order_items oi1 on oi1.order_id = o1.id
      join orders o2 on o2.customer_id = o1.customer_id and o2.created_at > o1.created_at
      join order_items oi2 on oi2.order_id = o2.id
      where o1.tenant_id = ${input.tenantId}
      and oi1.product_id = any(${sql.raw(`ARRAY[${purchasedIds.map((id) => `'${id}'`).join(",")}]::uuid[]`)})
      group by oi2.product_id
      order by cnt desc
      limit 20
    `);

    const candidates = Array.from(followUpRows.rows)
      .map((row) => ({
        productId: String(row.product_id),
        score: Math.min(1, Number(row.cnt) / 5),
        reason: "next_buy",
      }))
      .filter((x) => !purchasedIds.includes(x.productId));

    return this.mapRecommendationProducts(dedupeRanked(candidates).slice(0, 12), catalog);
  }

  async customerAssistant(input: { tenantId: string; userId?: string; query: string; storeId?: string }) {
    const started = Date.now();
    const model = await this.ensureModelRegistry(input.tenantId, "customer-assistant");
    const catalog = await this.getTenantProducts(input.tenantId, input.storeId);

    const ranked = catalog
      .map((product) => {
        const sim = jaccardSimilarity(input.query, `${product.title} ${product.description}`);
        const tokens = tokenizeFa(input.query);
        const reasonTokens = tokens.filter((t) => normalizeFa(product.title + " " + product.description).includes(t));
        return {
          id: product.id,
          title: product.title,
          score: sim,
          reason: reasonTokens.length > 0 ? `تطابق کلمات: ${reasonTokens.join("، ")}` : "شباهت معنایی",
        };
      })
      .filter((item) => item.score > 0.02)
      .sort((a, b) => b.score - a.score);

    const generated = await provider.generateCustomerAnswer({ query: input.query, recommendations: ranked });

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.userId,
      modelRegistryId: model?.id,
      inferenceType: "customer_assistant",
      inputPayload: { query: input.query, storeId: input.storeId ?? null },
      outputPayload: { responseLength: generated.content.length, recommendationCount: ranked.slice(0, 3).length },
      explainability: { reasoning: generated.reasoning },
      latencyMs: Date.now() - started,
    });

    return {
      answer: generated.content,
      suggestions: ranked.slice(0, 3).map((r) => ({
        productId: r.id,
        title: r.title,
        score: Number(r.score.toFixed(3)),
        reason: r.reason,
        link: `/products/${r.id}`,
      })),
    };
  }

  async vendorProductCopilot(input: {
    tenantId: string;
    actorUserId: string;
    storeId: string;
    productName: string;
    categoryHint?: string;
    attributes?: Record<string, unknown>;
  }) {
    const started = Date.now();
    const model = await this.ensureModelRegistry(input.tenantId, "vendor-product-copilot");

    const priceRows = await db
      .select({ basePrice: products.basePrice })
      .from(products)
      .where(and(eq(products.tenantId, input.tenantId), eq(products.storeId, input.storeId), isNull(products.deletedAt)))
      .limit(200);

    const avgPrice =
      priceRows.length === 0
        ? 0
        : priceRows.reduce((sum, row) => sum + toNum(row.basePrice), 0) / priceRows.length;

    const generated = await provider.generateVendorCopy({
      productName: input.productName,
      attributes: input.attributes,
      categoryHint: input.categoryHint,
      priceHint: avgPrice,
    });

    const seoDescription = `خرید ${input.productName} با بهترین قیمت و ارسال سریع از سان‌کندل`;

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      modelRegistryId: model?.id,
      inferenceType: "vendor_copilot",
      inputPayload: input,
      outputPayload: { generated: true },
      explainability: { reasoning: generated.reasoning, avgPrice },
      latencyMs: Date.now() - started,
    });

    return {
      generatedText: generated.content,
      seoDescription,
      suggestedPriceRange: {
        min: Math.round(avgPrice * 0.9),
        max: Math.round(avgPrice * 1.2),
      },
    };
  }

  async vendorSalesAssistant(input: { tenantId: string; actorUserId: string; storeId: string }) {
    const started = Date.now();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const recentOrders = await db
      .select({ id: orders.id, totalAmount: orders.totalAmount, createdAt: orders.createdAt })
      .from(orders)
      .where(and(eq(orders.tenantId, input.tenantId), eq(orders.storeId, input.storeId), gte(orders.createdAt, since)));

    const orderIds = recentOrders.map((o) => o.id);
    const items =
      orderIds.length === 0
        ? []
        : await db
            .select({ productId: orderItems.productId, quantity: orderItems.quantity })
            .from(orderItems)
            .where(inArray(orderItems.orderId, orderIds));

    const topProducts = this.topCounts(
      items.flatMap((item) => Array.from({ length: Math.max(1, item.quantity) }, () => item.productId))
    ).slice(0, 5);

    const revenue = recentOrders.reduce((sum, row) => sum + toNum(row.totalAmount), 0);

    const lowSelling = await db
      .select({ id: products.id, title: products.title })
      .from(products)
      .where(and(eq(products.tenantId, input.tenantId), eq(products.storeId, input.storeId), isNull(products.deletedAt)))
      .limit(30);

    const topSet = new Set(topProducts.map((x) => x.key));
    const lowSellingProducts = lowSelling.filter((p) => !topSet.has(p.id)).slice(0, 6);

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "vendor_copilot",
      inputPayload: { type: "sales" },
      outputPayload: { revenue, orders: recentOrders.length },
      explainability: { periodDays: 30 },
      latencyMs: Date.now() - started,
    });

    return {
      periodDays: 30,
      revenue,
      orderCount: recentOrders.length,
      topProducts,
      lowSellingProducts,
      opportunities: [
        "برای محصولات کم‌فروش، باندل مکمل با شمع‌های پرفروش تعریف کنید",
        "ارسال کمپین تخفیف هدفمند برای مشتریان سبد رهاشده",
      ],
    };
  }

  async vendorInventoryAssistant(input: { tenantId: string; actorUserId: string; storeId: string }) {
    const started = Date.now();
    const variantRows = await db
      .select({
        variantId: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        stockQty: productVariants.stockQty,
        title: productVariants.title,
      })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(and(eq(products.tenantId, input.tenantId), eq(products.storeId, input.storeId), isNull(products.deletedAt)));

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const soldRows = await db.execute(sql`
      select oi.variant_id, sum(oi.quantity)::int as sold_qty
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.tenant_id = ${input.tenantId} and o.store_id = ${input.storeId} and o.created_at >= ${since}
      group by oi.variant_id
    `);

    const soldMap = new Map<string, number>();
    Array.from(soldRows.rows).forEach((r) => soldMap.set(String(r.variant_id), Number(r.sold_qty)));

    const recommendations = variantRows
      .map((variant) => {
        const sold30 = soldMap.get(variant.variantId) ?? 0;
        const daily = sold30 / 30;
        const daysToStockout = daily > 0 ? variant.stockQty / daily : 999;
        const reorderQty = daily > 0 ? Math.max(0, Math.ceil(daily * 21 - variant.stockQty)) : 0;

        return {
          variantId: variant.variantId,
          sku: variant.sku,
          title: variant.title,
          stockQty: variant.stockQty,
          soldLast30Days: sold30,
          daysToStockout: Number(daysToStockout.toFixed(1)),
          reorderRecommendation: reorderQty,
          priority:
            variant.stockQty <= 0 || daysToStockout < 7
              ? "high"
              : daysToStockout < 15
                ? "medium"
                : "low",
        };
      })
      .sort((a, b) => a.daysToStockout - b.daysToStockout);

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "vendor_copilot",
      inputPayload: { type: "inventory" },
      outputPayload: { count: recommendations.length },
      explainability: { formula: "reorder = daily_sales*21 - stock" },
      latencyMs: Date.now() - started,
    });

    return recommendations;
  }

  async semanticSearch(input: {
    tenantId: string;
    actorUserId?: string;
    query: string;
    filters?: { minPrice?: number; maxPrice?: number; categoryId?: string; storeId?: string };
  }) {
    const started = Date.now();
    const model = await this.ensureModelRegistry(input.tenantId, "semantic-search");

    const catalog = await this.getTenantProducts(input.tenantId, input.filters?.storeId);

    const ranked = catalog
      .filter((product) => {
        const price = toNum(product.basePrice);
        if (input.filters?.minPrice !== undefined && price < input.filters.minPrice) return false;
        if (input.filters?.maxPrice !== undefined && price > input.filters.maxPrice) return false;
        if (input.filters?.categoryId && product.categoryId !== input.filters.categoryId) return false;
        return true;
      })
      .map((product) => {
        const textScore = jaccardSimilarity(input.query, `${product.title} ${product.description}`);
        const typoTolerance = this.typoSimilarity(input.query, product.title);
        const score = textScore * 0.7 + typoTolerance * 0.3;
        return {
          productId: product.id,
          title: product.title,
          score,
          price: toNum(product.basePrice),
          discountPercent: toNum(product.discountPercent),
          link: `/products/${product.id}`,
        };
      })
      .filter((item) => item.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24);

    await db.insert(aiSearchLogs).values({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId ?? null,
      query: input.query,
      normalizedQuery: normalizeFa(input.query),
      filters: input.filters ?? {},
      resultsCount: ranked.length,
    });

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      modelRegistryId: model?.id,
      inferenceType: "search",
      inputPayload: { query: input.query, filters: input.filters ?? {} },
      outputPayload: { resultsCount: ranked.length },
      explainability: { scoring: "0.7 semantic + 0.3 typo" },
      latencyMs: Date.now() - started,
    });

    return ranked;
  }

  private typoSimilarity(query: string, title: string) {
    const q = normalizeFa(query);
    const t = normalizeFa(title);
    if (!q || !t) return 0;

    if (t.includes(q) || q.includes(t)) return 1;

    const qBigrams = this.bigrams(q);
    const tBigrams = this.bigrams(t);
    const inter = qBigrams.filter((bg) => tBigrams.includes(bg)).length;
    const union = new Set([...qBigrams, ...tBigrams]).size;
    return union === 0 ? 0 : inter / union;
  }

  private bigrams(value: string) {
    const chars = value.replace(/\s+/g, "");
    const result: string[] = [];
    for (let i = 0; i < chars.length - 1; i += 1) {
      result.push(chars.slice(i, i + 2));
    }
    return result;
  }

  async connectInstagram(input: {
    tenantId: string;
    actorUserId: string;
    vendorId: string;
    storeId?: string;
    instagramBusinessId: string;
    accessToken: string;
  }) {
    const vendor = await db
      .select()
      .from(vendors)
      .where(and(eq(vendors.id, input.vendorId), eq(vendors.tenantId, input.tenantId)))
      .limit(1);
    if (!vendor[0]) {
      throw new AppError("فروشنده معتبر نیست", 404, "VENDOR_NOT_FOUND");
    }

    if (input.storeId) {
      const store = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.tenantId, input.tenantId)))
        .limit(1);
      if (!store[0]) {
        throw new AppError("فروشگاه معتبر نیست", 404, "STORE_NOT_FOUND");
      }
    }

    const accessTokenHash = await hashToken(input.accessToken);

    const rows = await db
      .insert(instagramConnections)
      .values({
        tenantId: input.tenantId,
        vendorId: input.vendorId,
        storeId: input.storeId ?? null,
        instagramBusinessId: input.instagramBusinessId,
        accessTokenHash,
        status: "connected",
      })
      .onConflictDoUpdate({
        target: [instagramConnections.vendorId, instagramConnections.instagramBusinessId],
        set: { accessTokenHash, status: "connected", lastSyncedAt: new Date() },
      })
      .returning();

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "instagram.connect",
      resource: "instagram_connection",
      resourceId: rows[0].id,
      messageFa: "اتصال حساب Instagram Business با موفقیت ثبت شد",
      metadata: { vendorId: input.vendorId, instagramBusinessId: input.instagramBusinessId },
    });

    return rows[0];
  }

  async processInstagramMessage(input: {
    tenantId: string;
    actorUserId: string;
    connectionId: string;
    senderHandle: string;
    messageText: string;
  }) {
    const connection = await db
      .select()
      .from(instagramConnections)
      .where(and(eq(instagramConnections.id, input.connectionId), eq(instagramConnections.tenantId, input.tenantId)))
      .limit(1);

    if (!connection[0]) {
      throw new AppError("اتصال Instagram یافت نشد", 404, "CONNECTION_NOT_FOUND");
    }

    const intent = classifyIntent(input.messageText);
    const suggestions = await this.semanticSearch({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      query: input.messageText,
      filters: { storeId: connection[0].storeId ?? undefined },
    });

    const quantity = extractQuantity(input.messageText);
    const orderIntent = {
      isOrderIntent: intent === "purchase_intent",
      quantity,
      suggestedProductId: suggestions[0]?.productId ?? null,
    };

    const row = await db
      .insert(instagramMessages)
      .values({
        tenantId: input.tenantId,
        connectionId: input.connectionId,
        senderHandle: input.senderHandle,
        messageText: input.messageText,
        intent,
        extractedEntities: { tokens: tokenizeFa(input.messageText) },
        suggestedProducts: suggestions.slice(0, 3),
        orderIntent,
      })
      .returning();

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "social_message",
      inputPayload: { messageText: input.messageText, sender: input.senderHandle },
      outputPayload: { intent, suggestions: suggestions.length },
      explainability: { intentLogic: "keyword+nlp", storeScope: connection[0].storeId ?? "tenant" },
      latencyMs: 0,
    });

    return {
      messageId: row[0].id,
      intent,
      suggestions: suggestions.slice(0, 3),
      orderIntent,
    };
  }

  async suggestCampaigns(input: { tenantId: string; actorUserId: string }) {
    const addToCart = await db
      .select({ customerId: customerActivities.customerId, createdAt: customerActivities.createdAt })
      .from(customerActivities)
      .innerJoin(customers, eq(customers.id, customerActivities.customerId))
      .where(and(eq(customers.tenantId, input.tenantId), eq(customerActivities.type, "add_to_cart")));

    const purchase = await db
      .select({ customerId: customerActivities.customerId, createdAt: customerActivities.createdAt })
      .from(customerActivities)
      .innerJoin(customers, eq(customers.id, customerActivities.customerId))
      .where(and(eq(customers.tenantId, input.tenantId), eq(customerActivities.type, "purchase")));

    const purchaseSet = new Set(purchase.map((p) => String(p.customerId)));
    const abandonedCustomers = addToCart
      .map((a) => String(a.customerId))
      .filter((id) => id && id !== "null" && !purchaseSet.has(id));

    const campaignSuggestions = [
      {
        type: "cart_abandonment",
        targetCustomers: [...new Set(abandonedCustomers)].length,
        recommendedSendWindow: "18:00-22:00",
        message: "یادآوری سبد خرید + پیشنهاد تخفیف محدود",
      },
      {
        type: "new_product_boost",
        targetCustomers: Math.max(10, Math.floor(abandonedCustomers.length * 0.6)),
        recommendedSendWindow: "11:00-13:00",
        message: "معرفی محصولات جدید مرتبط با رفتار خرید اخیر",
      },
    ];

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "automation",
      inputPayload: { type: "campaign_suggest" },
      outputPayload: { suggestions: campaignSuggestions.length },
      explainability: { basedOn: ["cart_activity", "purchase_activity"], tenantScoped: true },
      latencyMs: 0,
    });

    return campaignSuggestions;
  }

  async runCartAbandonmentAutomation(input: { tenantId: string; actorUserId: string }) {
    const rule = await this.ensureAbandonmentRule(input.tenantId);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const addToCart = await db
      .select({ customerId: customerActivities.customerId, createdAt: customerActivities.createdAt })
      .from(customerActivities)
      .innerJoin(customers, eq(customers.id, customerActivities.customerId))
      .where(
        and(
          eq(customers.tenantId, input.tenantId),
          eq(customerActivities.type, "add_to_cart"),
          gte(customerActivities.createdAt, twoDaysAgo)
        )
      );

    const purchased = await db
      .select({ customerId: customerActivities.customerId })
      .from(customerActivities)
      .innerJoin(customers, eq(customers.id, customerActivities.customerId))
      .where(
        and(
          eq(customers.tenantId, input.tenantId),
          eq(customerActivities.type, "purchase"),
          gte(customerActivities.createdAt, twoDaysAgo)
        )
      );

    const purchasedSet = new Set(purchased.map((p) => String(p.customerId)));

    const targetCustomerIds = [...new Set(addToCart.map((a) => String(a.customerId)).filter((id) => id && id !== "null"))].filter(
      (id) => !purchasedSet.has(id)
    );

    const runs = [];
    for (const customerId of targetCustomerIds) {
      const row = await db
        .insert(marketingAutomationRuns)
        .values({
          tenantId: input.tenantId,
          ruleId: rule.id,
          customerId,
          status: "completed",
          output: {
            channel: "sms",
            template: "cart_reminder_v1",
            recommendedAt: new Date().toISOString(),
          },
          runAt: new Date(),
        })
        .returning();
      runs.push(row[0]);
    }

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "automation",
      inputPayload: { type: "cart_abandonment" },
      outputPayload: { runs: runs.length },
      explainability: { window: "48h", exclusion: "purchase_detected", tenantScoped: true },
      latencyMs: 0,
    });

    return { executed: runs.length, runs };
  }

  private async ensureAbandonmentRule(tenantId: string) {
    await db
      .insert(marketingAutomationRules)
      .values({
        tenantId,
        name: "Cart Abandonment Reminder",
        triggerType: "cart_abandonment",
        targetChannel: "sms",
        conditionPayload: { inactivityHours: 24 },
        actionPayload: { template: "cart_reminder_v1" },
        isActive: true,
      })
      .onConflictDoNothing();

    const rows = await db
      .select()
      .from(marketingAutomationRules)
      .where(and(eq(marketingAutomationRules.tenantId, tenantId), eq(marketingAutomationRules.triggerType, "cart_abandonment")))
      .limit(1);

    if (!rows[0]) {
      throw new AppError("قانون اتوماسیون یافت نشد", 500, "RULE_NOT_FOUND");
    }
    return rows[0];
  }

  async aiAnalytics(input: { tenantId: string; actorUserId: string }) {
    const started = Date.now();

    const salesRows = await db.execute(sql`
      select date_trunc('day', o.created_at) as day, sum(o.total_amount::numeric)::numeric as amount
      from orders o
      where o.tenant_id = ${input.tenantId}
      group by day
      order by day desc
      limit 30
    `);

    const daily = Array.from(salesRows.rows).map((r) => ({ day: String(r.day), amount: Number(r.amount) }));
    const movingAvg =
      daily.length === 0 ? 0 : Number((daily.reduce((sum, x) => sum + x.amount, 0) / daily.length).toFixed(2));
    const forecastNext7Days = Number((movingAvg * 7).toFixed(2));

    const churnRows = await db.execute(sql`
      select c.id as customer_id, max(o.created_at) as last_order_at
      from customers c
      left join orders o on o.customer_id = c.id and o.tenant_id = ${input.tenantId}
      where c.tenant_id = ${input.tenantId}
      group by c.id
    `);

    const now = Date.now();
    let highRisk = 0;
    for (const row of Array.from(churnRows.rows)) {
      const last = row.last_order_at ? new Date(String(row.last_order_at)).getTime() : 0;
      const days = last === 0 ? 999 : (now - last) / (1000 * 60 * 60 * 24);
      if (days > 60) highRisk += 1;
    }

    const productPerformanceRows = await db.execute(sql`
      select p.id as product_id, p.title, count(oi.id)::int as lines, coalesce(sum(oi.quantity),0)::int as qty
      from products p
      left join order_items oi on oi.product_id = p.id
      left join orders o on o.id = oi.order_id and o.tenant_id = ${input.tenantId}
      where p.tenant_id = ${input.tenantId}
      group by p.id, p.title
      order by qty desc
      limit 10
    `);

    const productPerformance = Array.from(productPerformanceRows.rows).map((row) => ({
      productId: String(row.product_id),
      title: String(row.title),
      lineCount: Number(row.lines),
      soldQty: Number(row.qty),
    }));

    const metrics = {
      revenueForecastNext7Days: forecastNext7Days,
      avgDailyRevenue: movingAvg,
      churnHighRiskCustomers: highRisk,
      productPerformance,
    };

    await db.insert(aiEvaluationRuns).values({
      tenantId: input.tenantId,
      evaluationType: "ai_analytics_snapshot",
      metrics,
      notes: "Generated from transactional history with explainable heuristics",
    });

    await this.logInference({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      inferenceType: "analytics",
      inputPayload: { scope: "tenant" },
      outputPayload: metrics,
      explainability: { salesMethod: "moving_average", churnRule: "no_purchase_60d" },
      latencyMs: Date.now() - started,
    });

    return metrics;
  }

  async runPipeline(input: { tenantId: string; actorUserId: string; jobType: "customer_intelligence_refresh" | "recommendation_refresh" }) {
    const created = await db
      .insert(aiPipelineJobs)
      .values({
        tenantId: input.tenantId,
        jobType: input.jobType,
        payload: { requestedBy: input.actorUserId },
        status: "running",
        startedAt: new Date(),
      })
      .returning();

    const job = created[0];

    try {
      let result: Record<string, unknown> = {};

      if (input.jobType === "customer_intelligence_refresh") {
        const tenantCustomers = await db
          .select({ userId: customers.userId })
          .from(customers)
          .where(eq(customers.tenantId, input.tenantId));

        let processed = 0;
        for (const customer of tenantCustomers) {
          await this.computeCustomerIntelligence({ tenantId: input.tenantId, userId: customer.userId });
          processed += 1;
        }

        result = { processedCustomers: processed };
      }

      if (input.jobType === "recommendation_refresh") {
        const tenantCustomers = await db
          .select({ userId: customers.userId })
          .from(customers)
          .where(eq(customers.tenantId, input.tenantId))
          .limit(50);

        for (const customer of tenantCustomers) {
          await this.recommendHomepage({ tenantId: input.tenantId, userId: customer.userId });
        }

        result = { refreshedCustomers: tenantCustomers.length };
      }

      const updated = await db
        .update(aiPipelineJobs)
        .set({ status: "completed", result, finishedAt: new Date() })
        .where(eq(aiPipelineJobs.id, job.id))
        .returning();

      await this.logInference({
        tenantId: input.tenantId,
        actorUserId: input.actorUserId,
        inferenceType: "automation",
        inputPayload: { pipelineJob: input.jobType },
        outputPayload: result,
        explainability: { mode: "batch-pipeline" },
        latencyMs: 0,
      });

      return updated[0];
    } catch (error) {
      await db
        .update(aiPipelineJobs)
        .set({ status: "failed", result: { error: error instanceof Error ? error.message : "unknown" }, finishedAt: new Date() })
        .where(eq(aiPipelineJobs.id, job.id));
      throw error;
    }
  }
}

export const aiCommerceService = new AICommerceService();
