# 🌐 Tejomay Energies — Domain, DNS, SSL & Email Authentication Guide

This document specifies the exact DNS zone records required to connect `tejomayenergies.com` to **Vercel**, establish an automated **SSL/TLS Certificate**, and authenticate **Business Email (SPF, DKIM, DMARC)** to ensure 100% email deliverability.

---

## 1. Domain & Hosting DNS Records (Vercel Integration)

Add these records in your Domain Registrar (GoDaddy, Namecheap, Cloudflare, Hostinger, Google Domains, etc.):

| Type | Name / Host | Value / Target | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (or leave blank) | `76.76.21.21` | Automatic / 300s | Points root apex domain (`tejomayenergies.com`) to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 300s | Points `www.tejomayenergies.com` to Vercel edge network |

### Canonical 301 Redirection Rule
* **Master Domain:** `https://www.tejomayenergies.com`
* **Apex Domain:** `https://tejomayenergies.com` automatically 301-redirects to `https://www.tejomayenergies.com`.
* **Code-Level Guarantee:** Already configured in `vercel.json` under `"redirects"`:
  ```json
  {
    "source": "/(.*)",
    "has": [{ "type": "host", "value": "tejomayenergies.com" }],
    "destination": "https://www.tejomayenergies.com/$1",
    "permanent": true
  }
  ```

---

## 2. SSL / TLS Certificate Automation & Preload

* **Issuing Authority:** Automated via Vercel (Let's Encrypt / DigiCert with auto-renewal).
* **HTTPS Enforcement:** Automatic HTTP-to-HTTPS 308 upgrade.
* **HSTS Preload:** Configured in `vercel.json`:
  ```json
  {
    "key": "Strict-Transport-Security",
    "value": "max-age=63072000; includeSubDomains; preload"
  }
  ```
* **Status Verification:** Once DNS propagates, Vercel issues wildcard/dual certificates covering both `tejomayenergies.com` and `www.tejomayenergies.com`.

---

## 3. Business Email Authentication (SPF, DKIM, DMARC)

Prevent customer inquiry emails and proposals from being marked as spam by major email providers (Gmail, Outlook, Yahoo).

### A. SPF Record (Sender Policy Framework)
* **Record Type:** `TXT`
* **Host / Name:** `@`
* **TTL:** `3600`
* **Value (choose based on your email provider):**
  * **Google Workspace:**
    ```text
    v=spf1 include:_spf.google.com ~all
    ```
  * **Microsoft 365:**
    ```text
    v=spf1 include:spf.protection.outlook.com ~all
    ```
  * **Zoho Mail:**
    ```text
    v=spf1 include:zoho.in ~all
    ```

### B. DKIM Record (DomainKeys Identified Mail)
* **Record Type:** `TXT` (or `CNAME` depending on provider)
* **Host / Name:** Provided by your email provider (e.g. `google._domainkey` or `default._domainkey`)
* **Value:** The cryptographic 2048-bit public key string generated in your email admin console:
  ```text
  v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
  ```

### C. DMARC Record (Domain-based Message Authentication)
* **Record Type:** `TXT`
* **Host / Name:** `_dmarc` (or `_dmarc.tejomayenergies.com`)
* **TTL:** `3600`
* **Value:**
  ```text
  v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@tejomayenergies.com; pct=100
  ```
  *(Note: Replace `dmarc-reports@tejomayenergies.com` with your administrative email address).*

---

## 4. Complete DNS Table Reference Cheat Sheet

| Record Type | Host | Target / Content | Priority | Description |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | — | Web Hosting (Vercel) |
| **CNAME** | `www` | `cname.vercel-dns.com.` | — | Web Hosting (Vercel) |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | — | Email Sender Policy (SPF) |
| **TXT** | `google._domainkey` | `v=DKIM1; k=rsa; p=<YOUR_DKIM_KEY>` | — | Cryptographic Email Signature (DKIM) |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; pct=100` | — | Phishing & Spoofing Shield (DMARC) |

