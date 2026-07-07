# Poppy Store — Ecommerce MVP

This workspace contains a Next.js + TypeScript ecommerce MVP scaffold with:

- Authentication (email/password)
- Cart, checkout, and order tracking
- Admin inventory and order management UI
- Payment link flow (Flutterwave demo-friendly)
- Cloudinary direct upload signature endpoint
- Resend transactional email endpoint

Quick start

1. Copy `.env.example` to `.env` and fill secrets.
2. From the `app` folder install dependencies and run dev server:

```bash
cd app
pnpm install
pnpm dev
```

3. Open http://localhost:3000

Notes

- If Cloudinary / Resend / Flutterwave keys are not configured the app will run in demo mode and use local fallbacks.
- For production, configure SSL (platforms like Vercel manage TLS automatically) and set `NODE_ENV=production`.
