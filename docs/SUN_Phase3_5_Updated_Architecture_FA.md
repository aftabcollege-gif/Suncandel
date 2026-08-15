# SUN Phase 3.5 — Updated Frontend Architecture

## New Layers
- `components/experience/*` برای 3D Hero, Storytelling, 3D Viewer
- `store/storefront-store.tsx` برای Multi-Store runtime context
- `themes/storefronts.ts` + `utils/storefront.ts` برای host/domain mapping
- `features/customer/ProductDiscovery.tsx` برای smart discovery UX
- `features/portal/PortalSection.tsx` برای ماژول‌های Enterprise Portal

## Runtime Context
1. `layout.tsx` host header را می‌خواند
2. storefront config resolve می‌شود
3. `Providers` مقدار storefront + defaultTheme را inject می‌کند
4. `ThemeProvider` با اولویت `query > localStorage > store default` theme را اعمال می‌کند

## 3D Engine Strategy
- Three.js + React Three Fiber + Drei
- GSAP ScrollTrigger برای timelineهای scroll
- Framer Motion برای component/page transitions
- Fallback موبایل/دستگاه ضعیف
