# Deployment Walkthrough — Vercel Frontend + Render/Railway Backend

Project: **Little Bloom Creations**  
Architecture: **NPM Workspaces + Turborepo monorepo**

```txt
repo/
  apps/
    web/   # Next.js App Router frontend
    api/   # NestJS backend
  packages/
    shared-types/ # shared TypeScript contracts/schemas/DTOs
```

---

## 0. Current project facts

Your monorepo currently has:

```txt
Root package name: little-bloom-creations-monorepo
Package manager: npm@10.0.0
Workspaces:
  - apps/*
  - packages/*

Frontend package name: web
Backend package name: api
Shared package name: @repo/shared-types
```

Your `turbo.json` has `dependsOn: ["^build"]`, so:

```bash
npx turbo run build --filter=web
```

should build `@repo/shared-types` first, then `apps/web`.

And:

```bash
npx turbo run build --filter=api
```

should build `@repo/shared-types` first, then `apps/api`.

---

# 1. Critical security cleanup before production

## 1.1 Immediate issue: `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

You currently have something like:

```env
NEXT_PUBLIC_SUPABA…_SERVICE_ROLE_KEY
```

This is critical. Anything prefixed with `NEXT_PUBLIC_` is browser-accessible in Next.js. A Supabase service role key must never be available in the browser.

### Required action

1. Delete this variable from Vercel.
2. Search the frontend code for any usage of it.
3. Move any service-role logic to the NestJS backend.
4. Rotate/regenerate the Supabase service role key if this variable was ever deployed.
5. Put the new service role key only in Render/Railway if the backend actually needs it.

Recommended backend-only name:

```env
SUPABASE_SERVICE_ROLE_KEY=...
```

Never:

```env
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 1.2 Do not expose backend secrets in Vercel after migration

After the NestJS migration, these should normally move to Render/Railway:

```env
DATABASE_URL
SUPABASE_JWT_SECRET
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EKONT_USERNAME
EKONT_PASSWORD
EKONT_API_KEY
SPEEDY_USER
SPEEDY_PASS
SANITY_API_TOKEN
SANITY_API_READ_TOKEN
SANITY_WEBHOOK_SECRET
GOOGLE_CLIENT_SECRET

```

Exception: if `apps/web` still has Next.js Server Actions or Route Handlers that use one of these secrets, keep that specific secret in Vercel temporarily until the logic is moved to NestJS.

---

# 2. Recommended production target

Use this setup:

```txt
Frontend:
  Vercel existing project
  Root Directory: apps/web

Backend:
  Render Web Service
  Root Directory: repository root
  Build API via Turborepo

Database:
  Supabase Postgres

Payments:
  Stripe webhook -> backend URL, not Vercel

Shipping:
  Econt/Speedy credentials -> backend only
```

My recommendation for the beginning:

```txt
Vercel + Render + Supabase
```

Railway is also valid, but for your e-commerce backend I would start with Render because it gives you more predictable monthly cost and a conservative production setup.

---

# 3. Code preparation before deploy

## 3.1 Add explicit Node.js version

Currently there is no `engines.node` field. Add this to the root `package.json`:

```json
{
  "engines": {
    "node": "20.x",
    "npm": "10.x"
  }
}
```

Node 20 is a safe production baseline for Next.js 15 and NestJS 11. If you choose Node 22 instead, use it consistently locally, on Vercel, on Render/Railway and in CI/CD.

---

## 3.2 Patch NestJS CORS and host binding

Current backend has:

```ts
app.enableCors();
await app.listen(process.env.PORT ?? 3001);
```

Before production, restrict CORS.

Recommended `apps/api/src/main.ts`:

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 3001;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return parsed;
};

const getAllowedOrigins = (): string[] => {
  const rawOrigins = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL ?? '';

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ): void => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = parsePort(process.env.PORT);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
```

Required backend env after this patch:

```env
FRONTEND_URL=https://your-production-frontend-domain.com
CORS_ORIGINS=https://your-production-frontend-domain.com,https://your-vercel-project.vercel.app
```

---

## 3.3 Add a health check endpoint

Create:

```txt
apps/api/src/health/health.controller.ts
```

```ts
import { Controller, Get } from '@nestjs/common';

interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

Register it in `AppModule` without deleting existing controllers/providers/imports.

Expected endpoint:

```txt
GET https://your-api-domain.com/health
```

---

## 3.4 Add a production migration script

Current API scripts include `db:generate` and `db:push`. Add:

```json
{
  "db:migrate": "drizzle-kit migrate"
}
```

Recommended `apps/api/package.json` scripts:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:prod": "node dist/main",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

Production rule:

```txt
Use db:generate locally.
Commit generated migration files.
Use db:migrate in production.
Avoid db:push in production unless it is a controlled one-off.
```

---

# 4. Vercel frontend deployment walkthrough

## 4.1 Use the existing Vercel project

Do not create a new production Vercel project unless the old one is broken.

Use the existing project because it already has:

```txt
GitHub integration
Production domain
Preview deployments
Deployment history
Environment variables
```

---

## 4.2 Vercel project settings

Open:

```txt
Vercel Dashboard
  -> Project
  -> Settings
  -> General / Build and Deployment
```

Set:

```txt
Framework Preset:
  Next.js

Root Directory:
  apps/web
```

Very important:

```txt
Include source files outside of the Root Directory in the Build Step:
  Enabled
```

Reason: `apps/web` depends on `packages/shared-types`, which is outside `apps/web`.

---

## 4.3 Vercel build settings

In **Framework Settings**, use:

```txt
Build Command:
  Override: ON
  Value: cd ../.. && npx turbo run build --filter=web

Output Directory:
  Override: OFF
  Value: Next.js default

Install Command:
  Override: ON
  Value: cd ../.. && npm ci

Development Command:
  Override: OFF
```

The safer explicit setup for your repo is:

```bash
cd ../.. && npm ci
cd ../.. && npx turbo run build --filter=web
```

because your root `package-lock.json` and workspaces live at repository root.

---

## 4.4 Vercel environment variables — final target

### Keep in Vercel

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
```

If your code expects a different Stripe variable name, align the code and env. Common names are:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

Use only the one your code reads.

### Keep in Vercel only if Sanity Studio is hosted inside `apps/web`

```env
SANITY_STUDIO_PROJECT_ID=...
SANITY_STUDIO_DATASET=...
```

### Remove from Vercel after logic moves to NestJS

Move these to Render/Railway:

```env
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
EKONT_API_URL
EKONT_USERNAME
EKONT_PASSWORD
EKONT_API_KEY
SPEEDY_BASE_URL
SPEEDY_USER
SPEEDY_PASS
SANITY_API_TOKEN
SANITY_API_READ_TOKEN
SANITY_WEBHOOK_SECRET
GOOGLE_CLIENT_SECRET
```

### Immediately delete and rotate if it was deployed

```env
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

or any variant of:

```env
NEXT_PUBLIC_*SERVICE_ROLE*
```

---

## 4.5 Current Vercel env audit

| Current Vercel env | Action | Reason |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Keep | Public anon key for browser Supabase client |
| `NEXT_PUBLIC_SUPABASE_URL` | Keep | Public Supabase project URL |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Keep | Public Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | Keep | Public Sanity dataset |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Keep | Stripe publishable key for frontend |
| `NEXT_PUBLIC_API_URL` | Add if missing | Must point to deployed Nest API |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` or similar | Delete + rotate | Critical secret exposure risk |
| `GOOGLE_CLIENT_ID` | Depends | Keep only if Next.js auth needs it; otherwise configure in Supabase |
| `GOOGLE_CLIENT_SECRET` | Move/remove | Server-only; usually belongs in Supabase Auth or backend |
| `SANITY_API_TOKEN` | Move/remove | Server-only; keep only if Next server actions still need it |
| `SANITY_API_READ_TOKEN` | Move/remove | Server-only; keep only if private Sanity reads happen in Next |
| `SANITY_WEBHOOK_SECRET` | Depends | Keep only if Sanity webhook hits Vercel; otherwise move to backend |
| `SANITY_STUDIO_PROJECT_ID` | Depends | Keep if Studio is deployed in `apps/web` |
| `SANITY_STUDIO_DATASET` | Depends | Keep if Studio is deployed in `apps/web` |
| `STRIPE_SECRET_KEY` | Move to backend | Server-only payment secret |
| `STRIPE_WEBHOOK_SECRET` | Move to backend | Webhook verification secret |
| `EKONT_API_URL` | Move to backend | Shipping API should not be called directly from browser |
| `EKONT_USERNAME` | Move to backend | Credential |
| `EKONT_PASSWORD` | Move to backend | Credential |
| `EKONT_API_KEY` | Move to backend | Credential |
| `SPEEDY_BASE_URL` | Move to backend | Shipping API should be backend-owned |
| `SPEEDY_USER` | Move to backend | Credential |
| `SPEEDY_PASS` | Move to backend | Credential |

---

## 4.6 Vercel deployment steps

1. Commit all production patches:
   ```bash
   git status
   git add .
   git commit -m "prepare production deployment"
   git push
   ```

2. In Vercel, set:
   ```txt
   Root Directory: apps/web
   Include source files outside Root Directory: Enabled
   Build Command: cd ../.. && npx turbo run build --filter=web
   Install Command: cd ../.. && npm ci
   Output Directory: default
   ```

3. Add/update frontend env vars:
   ```env
   NEXT_PUBLIC_API_URL=https://your-render-api-url.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SANITY_PROJECT_ID=...
   NEXT_PUBLIC_SANITY_DATASET=...
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
   ```

4. Redeploy from Vercel:
   ```txt
   Deployments -> latest deployment -> Redeploy
   ```

5. Verify:
   ```txt
   Homepage loads
   Product pages load
   Cart works
   Checkout opens
   Browser network requests go to NEXT_PUBLIC_API_URL
   No requests go to localhost:3001
   No service role key appears in client JS/network
   ```

---

# 5. Render backend deployment walkthrough

## 5.1 Create Render Web Service

Open:

```txt
Render Dashboard
  -> New
  -> Web Service
  -> Connect GitHub repository
```

Choose the same monorepo repository.

Recommended:

```txt
Branch:
  main or production branch

Runtime:
  Node

Region:
  Choose closest to your Supabase region and users
```

---

## 5.2 Render service settings

Use:

```txt
Name:
  little-bloom-api

Root Directory:
  leave empty / repository root

Build Command:
  npm ci && npx turbo run build --filter=api

Start Command:
  cd apps/api && npm run start:prod

Health Check Path:
  /health
```

Do not set:

```txt
Root Directory: apps/api
```

Reason: `apps/api` depends on `packages/shared-types`. If Render builds only from `apps/api`, shared workspace files can be unavailable.

---

## 5.3 Render environment variables

Add these to Render:

```env
NODE_ENV=production

FRONTEND_URL=https://your-production-frontend-domain.com
CORS_ORIGINS=https://your-production-frontend-domain.com,https://your-vercel-project.vercel.app

DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_JWT_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...

STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

EKONT_API_URL=...
EKONT_USERNAME=...
EKONT_PASSWORD=...
EKONT_API_KEY=...

SPEEDY_BASE_URL=...
SPEEDY_USER=...
SPEEDY_PASS=...

SANITY_API_TOKEN=...
SANITY_API_READ_TOKEN=...
SANITY_WEBHOOK_SECRET=...
```

Only add `SUPABASE_SERVICE_ROLE_KEY`, Sanity tokens, Google secrets, Econt and Speedy secrets if the backend actually uses them.

Render usually injects `PORT`. Do not hardcode `PORT`.

---

## 5.4 Supabase `DATABASE_URL`

For Render, use a server-side Postgres connection string only.

Recommended:

```txt
Supabase direct connection
```

If Render cannot connect because of IPv6/IPv4 limitations, use:

```txt
Supabase session pooler connection string
```

Avoid exposing `DATABASE_URL` to Vercel frontend.

---

## 5.5 Database migrations on Render

### Preferred production flow

1. Locally generate migrations:
   ```bash
   npm run db:generate --workspace=api
   ```

2. Review the generated SQL files:
   ```txt
   apps/api/drizzle/migrations
   ```

3. Commit migrations:
   ```bash
   git add apps/api/drizzle
   git commit -m "add database migration"
   git push
   ```

4. Run production migration:
   ```bash
   npm run db:migrate --workspace=api
   ```

For Render, after adding `db:migrate`, you can use a Pre-deploy Command:

```bash
cd apps/api && npm run db:migrate
```

### Temporary first deployment option

If the project is still early and you intentionally want schema sync:

```bash
cd apps/api && npx drizzle-kit push
```

Use this only after:

```txt
Supabase backup is taken
DATABASE_URL points to the correct production DB
You reviewed the expected schema changes
You are not running it automatically on every deploy
```

---

## 5.6 Render deploy steps

1. Create service.
2. Configure build/start commands.
3. Add env vars.
4. Deploy.
5. Watch logs.
6. Test:
   ```bash
   curl https://your-api-domain.com/health
   ```
7. Test CORS from the Vercel frontend.
8. Only after backend is healthy, update Vercel:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
9. Redeploy Vercel frontend.

---

# 6. Railway backend alternative

Railway is valid, but for this project I would use Render first.

If you use Railway:

```txt
Root Directory:
  /

Build Command:
  npm ci && npx turbo run build --filter=api

Start Command:
  cd apps/api && npm run start:prod
```

Do not set Railway Root Directory to `apps/api` because Railway may only pull files from that directory, and your API needs `packages/shared-types`.

Add the same environment variables as Render.

---

# 7. Stripe production setup

## 7.1 Backend endpoint

Stripe webhooks should point to the backend, not Vercel, after the migration.

Example:

```txt
https://api.yourdomain.com/stripe/webhook
```

or:

```txt
https://your-render-api.onrender.com/stripe/webhook
```

Use your actual NestJS webhook route.

---

## 7.2 Stripe Dashboard setup

In Stripe Dashboard:

```txt
Developers / Workbench
  -> Webhooks
  -> Add endpoint
```

Endpoint URL:

```txt
https://api.yourdomain.com/<your-stripe-webhook-route>
```

Recommended events for your current order flow:

```txt
payment_intent.succeeded
payment_intent.payment_failed
payment_intent.canceled
charge.refunded
charge.dispute.created
```

Minimum required:

```txt
payment_intent.succeeded
payment_intent.payment_failed
```

After creating the endpoint, copy the signing secret:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Put it only in Render/Railway.

---

## 7.3 Stripe live vs test

For production:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

For staging/test:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Do not mix live publishable key with test secret key.

---

## 7.4 Stripe validation checklist

Test:

```txt
Successful card payment
Failed card payment
Webhook signature verification
Duplicate webhook delivery/idempotency
Order status update
Stock update
Webhook_events row written
Frontend polling redirects correctly
```

Your database has `pending_orders` and `webhook_events`, so the webhook is business-critical.

---

# 8. Supabase production setup

## 8.1 Required frontend Supabase envs

Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

These are allowed in the browser if RLS is correctly configured.

---

## 8.2 Required backend Supabase envs

Render/Railway:

```env
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_JWT_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Use `SUPABASE_SERVICE_ROLE_KEY` only for backend administrative operations.

---

## 8.3 Auth settings

In Supabase Dashboard:

```txt
Authentication
  -> URL Configuration
```

Set:

```txt
Site URL:
  https://your-production-frontend-domain.com

Redirect URLs:
  https://your-production-frontend-domain.com/**
  https://your-vercel-preview-domain.vercel.app/**
```

If using local dev:

```txt
http://localhost:3000/**
```

---

## 8.4 Google OAuth through Supabase

If Supabase handles Google login:

1. Configure Google provider in Supabase.
2. Put Google client ID/secret in Supabase, not Vercel.
3. In Google Cloud Console, set authorized redirect URI to Supabase callback URL.

Usually:

```txt
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

Then remove from Vercel if unused:

```env
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

If your Next.js app has its own auth handler that uses Google directly, keep these in Vercel temporarily as server-only variables until migrated.

---

# 9. Sanity production setup

## 9.1 Public Sanity envs in Vercel

Keep:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
```

If Studio is embedded in the web app, also keep:

```env
SANITY_STUDIO_PROJECT_ID=...
SANITY_STUDIO_DATASET=...
```

---

## 9.2 Sanity tokens

Move these to the backend unless Next.js server code still uses them:

```env
SANITY_API_TOKEN
SANITY_API_READ_TOKEN
SANITY_WEBHOOK_SECRET
```

Use read-only token where possible. Use write token only for write operations.

---

## 9.3 Sanity webhooks

You need a Sanity webhook only if you want automatic cache revalidation or backend sync when content changes.

Choose one target:

### Option A — Sanity webhook to Vercel

Use this if Next.js handles revalidation:

```txt
https://your-frontend-domain.com/api/revalidate
```

Then keep in Vercel:

```env
SANITY_WEBHOOK_SECRET=...
SANITY_API_READ_TOKEN=...
```

### Option B — Sanity webhook to NestJS backend

Use this if backend syncs Sanity products into Supabase:

```txt
https://api.yourdomain.com/sanity/webhook
```

Then put in Render/Railway:

```env
SANITY_WEBHOOK_SECRET=...
SANITY_API_READ_TOKEN=...
SANITY_API_TOKEN=...
```

Sanity webhook events should usually target product/category/media create/update/delete events used by the storefront.

---

# 10. Econt production setup

Your current integration uses:

```env
EKONT_API_URL
EKONT_USERNAME
EKONT_PASSWORD
EKONT_API_KEY
```

Move all Econt calls to the backend.

## 10.1 Backend envs

Render/Railway:

```env
EKONT_API_URL=...
EKONT_USERNAME=...
EKONT_PASSWORD=...
EKONT_API_KEY=...
```

Only keep `EKONT_API_URL` in Vercel if it is harmless and actually needed by client code, but the better architecture is: no direct browser calls to Econt.

---

## 10.2 Required Econt production checks

Before production:

```txt
Confirm production vs demo API URL
Confirm production credentials
Confirm sender company name
Confirm sender phone
Confirm sender address
Confirm sender office code, if shipping from office
Confirm bank IBAN/BIC for cash-on-delivery payouts
Confirm currency: BGN or EUR
Confirm pack weight calculation
Confirm product description text
Confirm receiver office vs receiver address handling
```

---

## 10.3 Econt flow

Use this sequence:

```txt
1. Customer selects delivery method
2. Backend validates address/office
3. Backend calculates shipping price
4. Customer places order
5. Payment succeeds or cash order is accepted
6. Backend creates/validates label
7. Store shipment number in orders.shipment_number
```

For label creation, use `mode: validate` before `mode: create`.

---

## 10.4 Econt webhooks

You probably do not need an Econt webhook unless you want automatic shipment tracking status updates.

If you later enable tracking callbacks:

```txt
Webhook URL:
  https://api.yourdomain.com/shipping/econt/webhook

Env:
  EKONT_WEBHOOK_SECRET=...
```

Only add this if Econt provides/configures such callback for your account.

---

# 11. Speedy production setup

Your Speedy integration uses:

```env
SPEEDY_BASE_URL
SPEEDY_USER
SPEEDY_PASS
```

Move all Speedy calls to the backend.

## 11.1 Backend envs

Render/Railway:

```env
SPEEDY_BASE_URL=...
SPEEDY_USER=...
SPEEDY_PASS=...
```

If your Speedy account requires a sender client ID, add:

```env
SPEEDY_CLIENT_ID=...
```

---

## 11.2 Required Speedy production checks

Before production:

```txt
Confirm production vs test API URL
Confirm username/password
Confirm sender client ID
Confirm sender contact name
Confirm sender email
Confirm sender phone
Confirm default service ID
Confirm package type
Confirm weight/dimensions calculation
Confirm COD setup
Confirm fiscal receipt item requirements
Confirm office delivery flow
Confirm address delivery flow
```

---

## 11.3 Speedy flow

Use this sequence:

```txt
1. Resolve city/site ID
2. Resolve street ID if address delivery
3. Validate shipment
4. Calculate price
5. Create shipment only after order/payment condition is satisfied
6. Store shipment number in orders.shipment_number
```

Do not create a Speedy shipment directly from the browser.

---

# 12. Production domains and DNS

Recommended final domains:

```txt
Frontend:
  https://littlebloom.bg

Backend:
  https://api.littlebloom.bg
```

## 12.1 Vercel

In Vercel:

```txt
Project
  -> Settings
  -> Domains
  -> Add littlebloom.bg
  -> Add www.littlebloom.bg
```

Set DNS according to Vercel instructions.

## 12.2 Render

In Render:

```txt
Web Service
  -> Settings
  -> Custom Domains
  -> Add api.littlebloom.bg
```

Set DNS according to Render instructions.

## 12.3 Update envs after custom domains

Vercel:

```env
NEXT_PUBLIC_API_URL=https://api.littlebloom.bg
```

Render/Railway:

```env
FRONTEND_URL=https://littlebloom.bg
CORS_ORIGINS=https://littlebloom.bg,https://www.littlebloom.bg
```

Stripe webhook:

```txt
https://api.littlebloom.bg/<your-stripe-webhook-route>
```

Sanity webhook:

```txt
https://littlebloom.bg/api/revalidate
```

or:

```txt
https://api.littlebloom.bg/sanity/webhook
```

---

# 13. Correct rollout order

Use this order:

```txt
1. Patch backend CORS, host binding, health endpoint
2. Add db:migrate script
3. Remove NEXT_PUBLIC service role variable from frontend
4. Rotate Supabase service role key if exposed
5. Deploy backend to Render
6. Test backend /health
7. Add Stripe test webhook to backend URL
8. Test payment flow in test mode
9. Set NEXT_PUBLIC_API_URL in Vercel
10. Redeploy frontend
11. Test frontend checkout with backend
12. Configure production custom domains
13. Update env vars to custom domains
14. Configure Stripe live webhook
15. Switch Stripe keys to live
16. Test one real low-value transaction if possible
17. Validate Econt/Speedy in validate/calculate mode
18. Enable create shipment flow
```

---

# 14. Final production checklist

## Frontend

```txt
Vercel uses existing project
Root Directory is apps/web
Include files outside Root Directory is enabled
Install Command uses root npm ci
Build Command uses turbo filter=web
NEXT_PUBLIC_API_URL points to backend
No localhost URLs in production
No service role key in Vercel
No courier credentials in Vercel
No Stripe secret key in Vercel unless old Next server route still needs it
```

## Backend

```txt
Render service root is repository root
Build command builds api via turbo
Start command starts apps/api
CORS is restricted
Health endpoint exists
Database URL is backend-only
Stripe webhook secret is backend-only
Courier credentials are backend-only
Logs show successful startup
```

## Database

```txt
Supabase backup taken
Migrations reviewed
db:migrate exists
No automatic db:push in production deploy
orders/order_items/order_shipping/webhook_events tables verified
```

## Stripe

```txt
Live publishable key in Vercel
Live secret key in Render
Live webhook secret in Render
Webhook endpoint points to backend
payment_intent.succeeded handled
payment_intent.payment_failed handled
Duplicate webhook delivery is idempotent
```

## Sanity

```txt
Public project/dataset envs in Vercel
Tokens are server-only
Webhook target chosen: Vercel or backend
Webhook secret verified
Content updates invalidate/revalidate correctly
```

## Econt/Speedy

```txt
Credentials are backend-only
Production endpoints confirmed
Sender data confirmed
COD data confirmed
Calculate flow works
Validate flow works
Create flow enabled only after order condition
Shipment number saved in orders.shipment_number
```

---

# 15. Final recommendation

Use:

```txt
Frontend:
  Existing Vercel project

Backend:
  Render Web Service

Database:
  Supabase Postgres

Payments:
  Stripe webhooks to Render

Shipping:
  Econt/Speedy through Render backend only
```

Do not deploy the NestJS API inside Vercel Functions for this project. Your backend owns payments, order state, stock updates, courier labels, database writes and webhooks, so it is better as a persistent Node.js service.
