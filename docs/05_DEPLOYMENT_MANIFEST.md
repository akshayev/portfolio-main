# Vercel Deployment Manifest

This document outlines the final production deployment procedure for the **Titanium & Emerald Spatial UI Portfolio**. Follow these configuration parameters to deploy to Vercel and map the custom domain using Cloudflare DNS.

---

## 📋 Pre-Deployment Checklist

1. [ ] Repository pushed to GitHub (`main` branch is clean and passing CI).
2. [ ] Sanity.io project created, schema deployed, and API token ready.
3. [ ] Upstash Redis instance provisioned for Rate Limiting.
4. [ ] Cloudflare Turnstile widget created and keys retrieved.
5. [ ] Resend API Key created and sending email domain verified (or ready to use fallback).
6. [ ] PostHog project created and project key retrieved.

---

## 🚀 Step 1: Import GitHub Repository
1. Navigate to the **[Vercel Dashboard](https://vercel.com/)**.
2. Click **New Project** -> **Import** on the `akshayev/portfolio-main` repository.
3. Leave **Framework Preset** as **Next.js**.
4. Leave **Root Directory** as `./` (default).

---

## 🔑 Step 2: Configure Environment Variables

In the **Environment Variables** accordion, add the following variables:

| Variable Name | Scope | Description / Target Value |
| :--- | :--- | :--- |
| **Sanity CMS Configuration** | | |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client & Server | Your Sanity Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Client & Server | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Client & Server | `2024-01-01` |
| `SANITY_REVALIDATE_SECRET` | Server Only | Secret token configured in the Sanity webhook |
| **Contact Engine (Resend)** | | |
| `RESEND_API_KEY` | Server Only | `re_...` Resend API credential |
| `CONTACT_EMAIL` | Server Only | `hello@akshay.is-a.dev` (recipient of portfolio contact forms) |
| **Security & Defense** | | |
| `UPSTASH_REDIS_REST_URL` | Server Only | Upstash Redis REST URL (e.g. `https://...upstash.io`) |
| `UPSTASH_REDIS_REST_TOKEN` | Server Only | Upstash Redis REST Token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client & Server | Cloudflare Turnstile Site Key (for the widget) |
| `TURNSTILE_SECRET_KEY` | Server Only | Cloudflare Turnstile Secret Key (server-side verification) |
| **PostHog Analytics** | | |
| `NEXT_PUBLIC_POSTHOG_KEY` | Client & Server | PostHog Client API Key (`phc_...`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Client & Server | `https://us.i.posthog.com` or `https://eu.i.posthog.com` |

---

## 🛠️ Step 3: Trigger Deployment
1. Under **Build & Development Settings**, verify the defaults:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm ci --legacy-peer-deps`
2. Click **Deploy** and wait for the build steps to complete.

---

## 🌐 Step 4: DNS Configuration (Cloudflare to Vercel)

Once the deployment completes:
1. Navigate to **Project Settings** -> **Domains** in Vercel.
2. Enter the custom domain: `akshay.is-a.dev` and click **Add**.
3. Select **Redirect standard domain to www** (recommended) or map `akshay.is-a.dev` directly.
4. Vercel will prompt you with the required DNS records.
5. Log into **Cloudflare** -> Go to the DNS tab for `is-a.dev` or your registrar:
   - For **A Record** (apex domain `akshay.is-a.dev`):
     - Name: `akshay`
     - IPv4: `76.76.21.21` (Vercel Anycast IP)
     - Proxy Status: **DNS Only** (disable Cloudflare proxy initially to pass Vercel SSL verification, proxy can be re-enabled later).
   - For **CNAME Record** (subdomain `www.akshay.is-a.dev` if applicable):
     - Name: `www.akshay`
     - Target: `cname.vercel-dns.com`
     - Proxy Status: **DNS Only**
6. Wait for Vercel to verify the records and issue the Let's Encrypt SSL certificate.

---

## 🔗 Step 5: Configure Sanity.io Revalidation Webhook
To ensure sitemap and Bento Grid caches clear automatically when portfolio data changes:
1. Go to **[Sanity Management Console](https://www.sanity.io/manage)**.
2. Select your project -> **API** -> **Webhooks**.
3. Click **Create Webhook**:
   - Name: `On-Demand Cache Purge`
   - URL: `https://akshay.is-a.dev/api/revalidate`
   - Dataset: `production`
   - Trigger on: `Create`, `Update`, `Delete`
   - Filter: `_type == "project"`
   - Projection: `{_type, _id}`
   - HTTP Headers: `x-sanity-secret: <YOUR_SANITY_REVALIDATE_SECRET_HERE>`
4. Save and verify status.
