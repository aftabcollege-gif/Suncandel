import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  try {
    await db.execute(sql`select 1`);

    return Response.json({
      status: "ok",
      service: "sun",
      timestamp: new Date().toISOString(),
      checks: {
        app: "ok",
        db: "ok",
      },
      latencyMs: Date.now() - started,
    });
  } catch {
    return Response.json(
      {
        status: "degraded",
        service: "sun",
        timestamp: new Date().toISOString(),
        checks: {
          app: "ok",
          db: "fail",
        },
        latencyMs: Date.now() - started,
      },
      { status: 503 }
    );
  }
}
