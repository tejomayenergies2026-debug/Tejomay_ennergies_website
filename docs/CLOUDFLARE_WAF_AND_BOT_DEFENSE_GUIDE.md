# 🛡️ Cloudflare Web Application Firewall (WAF) & Bot Protection Guide

This guide details how to add an enterprise-grade DDoS, scraping, and bot protection shield in front of `tejomayenergies.com` using Cloudflare's free tier.

---

## Architecture Flow

```
[ Visitor / Bot ]
       │
       ▼
[ Cloudflare Edge Network ]  <─── (DDoS Mitigation, Bot Fight Mode, TLS 1.3, Geo-blocking)
       │
       ▼ (Clean legitimate traffic only)
[ Vercel Edge Server ]       <─── (Frontend React Bundle, HSTS, CSP)
       │
       ▼
[ Supabase Backend ]         <─── (Authenticated RLS Policies, MFA)
```

---

## Step 1: Point Domain Nameservers to Cloudflare
1. Create a free account at [Cloudflare.com](https://dash.cloudflare.com).
2. Click **"Add a Domain"** and enter `tejomayenergies.com`.
3. Select the **Free Plan** and click **Continue**.
4. Cloudflare will automatically scan your existing DNS records (your A record pointing to `76.76.21.21` and CNAME pointing to `cname.vercel-dns.com`).
5. Ensure the **Proxy Status** toggle is set to **Proxied (Orange Cloud ☁️)**.
6. Replace the nameservers in your domain registrar (GoDaddy, Namecheap, etc.) with the two custom Cloudflare nameservers provided (e.g. `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`).

---

## Step 2: Enable Automated Bot Protection (Bot Fight Mode)
1. In Cloudflare Dashboard, navigate to **Security → Bots**.
2. Toggle on **Bot Fight Mode**:
   * **What it does:** Automatically detects and challenges automated scrapers, headless Puppeteer crawlers, and vulnerability scanner bots trying to discover secret admin URLs.
   * **Effect on real users:** Legitimate mobile and desktop visitors pass through silently without seeing any CAPTCHA challenge.

---

## Step 3: Configure Cloudflare SSL/TLS to "Full (Strict)"
1. In Cloudflare Dashboard, go to **SSL/TLS → Overview**.
2. Select encryption mode: **Full (Strict)**.
   * **Why it is required:** Ensures the connection between Cloudflare and Vercel is 100% encrypted and validates Vercel's DigiCert/Let's Encrypt origin certificate, preventing Man-in-the-Middle (MitM) interception.
3. Under **SSL/TLS → Edge Certificates**:
   * Toggle on **Always Use HTTPS**.
   * Toggle on **Automatic HTTPS Rewrites**.
   * Set **Minimum TLS Version** to **TLS 1.2** (or TLS 1.3).

---

## Step 4: Custom WAF Rate Limiting Rule (Admin Protection)
To protect your secret admin routes (`#/x9k2-admin`, `/admin`) from brute-force attempts at the edge:
1. Go to **Security → WAF → Custom Rules**.
2. Click **Create Rule**:
   * **Rule Name:** Block Admin Brute Force Floods
   * **Field:** URI Path / Query String
   * **Operator:** contains
   * **Value:** `admin`
   * **Action:** Managed Challenge (or Rate Limit: 10 requests / 1 minute)
3. Click **Deploy**.

---

## Step 5: Verification & Testing
* Open terminal and run:
  ```powershell
  curl -I https://www.tejomayenergies.com
  ```
* Look for:
  * `Server: cloudflare`
  * `cf-ray: ...`
  * `strict-transport-security: max-age=...`
This confirms all traffic is flowing through Cloudflare's secure DDoS scrubbing centers before reaching Vercel.

