# 🌐 Cloudflare & Vercel Edge Domain Routing Runbook

This guide outlines the step-by-step procedure for registering, configuring, and verifying the zero-cost custom domain `akshay.is-a.dev` using Cloudflare DNS and Vercel hosting.

---

## 📅 Step-by-Step Implementation Checklist

### 1. `is-a.dev` Domain Registration
- [ ] Go to [github.com/is-a-dev/register](https://github.com/is-a-dev/register).
- [ ] Fork the repository to your personal GitHub account.
- [ ] In your fork, create a new file under the `domains/` folder named `akshay.json` using the configuration template created in [`config/domain/akshay.json`](file:///home/akshay/Desktop/project/portfolio/config/domain/akshay.json):
  ```json
  {
    "owner": {
      "username": "akshayev",
      "email": "akshay@example.com"
    },
    "record": {
      "NS": [
        "amy.ns.cloudflare.com",
        "bob.ns.cloudflare.com"
      ]
    }
  }
  ```
- [ ] Submit a Pull Request to the upstream repository. Once merged, DNS delegation of `akshay.is-a.dev` will point to your Cloudflare account.

---

### 2. Cloudflare DNS Setup
- [ ] Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
- [ ] Click **"Add a Site"** and enter `akshay.is-a.dev`.
- [ ] Choose the **Free Plan** ($0/month).
- [ ] Cloudflare will instruct you to verify nameservers (which match `amy.ns.cloudflare.com` and `bob.ns.cloudflare.com` configured in the registration file).
- [ ] Navigate to the **DNS > Records** page and add the following records:
  
  | Type  | Name | Value                  | TTL  | Proxy Status (Cloud Icon) |
  | :---- | :--- | :--------------------- | :--- | :------------------------ |
  | **A** | `@`   | `76.76.21.21`          | Auto | **DNS Only (Grey Cloud)** |
  | **CNAME** | `www` | `cname.vercel-dns.com` | Auto | **DNS Only (Grey Cloud)** |

> [!CRITICAL]
> **Proxy Status must be "DNS Only" (Grey Cloud) during Vercel domain verification.**
> If the proxy is enabled (Orange Cloud), Cloudflare's edge certificate will intercept the SSL handshake challenge from Vercel's automated Let's Encrypt bot, preventing Vercel from provisioning your custom SSL certificate.

---

### 3. Vercel Domain Connection
- [ ] Open your project dashboard in [Vercel](https://vercel.com).
- [ ] Navigate to **Settings > Domains**.
- [ ] Add `akshay.is-a.dev` (recommend adding both `akshay.is-a.dev` and the `www` redirect).
- [ ] Vercel will run a verification check against the DNS records. Once the Grey Cloud propagation completes, the domain status will turn green with active SSL.
- [ ] *(Optional)* Once Vercel successfully provisions the SSL certificate, you may toggle the Cloudflare proxy to **Orange Cloud** (Proxied) to leverage Cloudflare's Edge Caching and DDoS mitigation.

---

### 4. Cloudflare Email Routing Integration
- [ ] In the Cloudflare Dashboard, select the `akshay.is-a.dev` site.
- [ ] Navigate to **Email > Email Routing**.
- [ ] Click **"Enable Email Routing"** (Cloudflare will automatically prompt you to add required MX and TXT validation records to your DNS zone. Approve this step).
- [ ] Go to the **Routing Rules** tab:
  - Click **"Create Address"**.
  - Custom Address: `hello@akshay.is-a.dev`
  - Destination Address: Your personal email (e.g., `akshay@gmail.com`).
- [ ] Check your personal destination inbox and click the verification link sent by Cloudflare.
