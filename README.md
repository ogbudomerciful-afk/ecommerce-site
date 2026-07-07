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
 
Deployment and SSL

- Preferred hosting: Vercel for seamless Next.js deployments and automatic SSL/TLS certificate management.
- If deploying to other providers (DigitalOcean, AWS, Render), enable HTTPS via managed certificates or use a reverse proxy (e.g., Cloudflare, Nginx) with LetsEncrypt certificates.
- Store all secrets in the platform environment settings (do not commit `.env` to source control).

Environment

- Copy `.env.example` to `.env` for local development and fill in the required values.
- In production set `NODE_ENV=production` and ensure `APP_URL` matches the public app domain.

Monitoring & Reliability

- Add Sentry or a similar error-tracking tool for runtime errors.
- Add a health-check endpoint and external uptime monitoring.
