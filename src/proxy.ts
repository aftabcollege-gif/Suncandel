import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/Shared/rate-limit";

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN ?? "";

const API_LIMIT_RULES: Array<{ pattern: RegExp; limit: number; windowMs: number }> = [
  { pattern: /^\/api\/v1\/auth\/(login|register|refresh)/, limit: 20, windowMs: 10 * 60 * 1000 },
  { pattern: /^\/api\/v1\/commerce\/payments\/callback/, limit: 120, windowMs: 60 * 1000 },
  { pattern: /^\/api\/v1\/ai\//, limit: 240, windowMs: 60 * 1000 },
];

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "worker-src 'self' blob:",
      "media-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Callback-Signature");
    response.headers.set("Vary", "Origin");
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/") && req.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    applySecurityHeaders(preflight);
    return preflight;
  }

  if (pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const matchedRule = API_LIMIT_RULES.find((rule) => rule.pattern.test(pathname));

    if (matchedRule) {
      const key = `${ip}:${pathname}:${matchedRule.windowMs}`;
      const rate = checkRateLimit({ key, limit: matchedRule.limit, windowMs: matchedRule.windowMs });

      if (!rate.allowed) {
        const response = NextResponse.json(
          {
            success: false,
            error: {
              code: "RATE_LIMITED",
              message: "تعداد درخواست بیش از حد مجاز است. لطفاً بعداً تلاش کنید.",
            },
          },
          { status: 429 }
        );
        applySecurityHeaders(response);
        response.headers.set("Retry-After", String(Math.ceil((rate.resetAt - Date.now()) / 1000)));
        return response;
      }
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
