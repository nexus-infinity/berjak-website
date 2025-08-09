# DNS Records Documentation
## berjak.co and berjak.com.au Domains

**Documentation Date:** August 8, 2025  
**DNS Providers:**
- berjak.co: GoDaddy (NS: ns55.domaincontrol.com, ns56.domaincontrol.com)
- berjak.com.au: Vercel DNS (NS: ns1.vercel-dns.com, ns2.vercel-dns.com)

---

## berjak.co Domain Records

### Name Servers (NS Records)
- `berjak.co` → `ns55.domaincontrol.com` (TTL: 3600)
- `berjak.co` → `ns56.domaincontrol.com` (TTL: 3600)

### A Records
- `berjak.co` → `76.76.21.21` (TTL: 600)

### CNAME Records
- `www.berjak.co` → `cname.vercel-dns.com` (TTL: 3600)
  - **Vercel Configuration Detected:** This CNAME points to Vercel's DNS system
  - Resolves to:
    - `76.76.21.164` (TTL: 1800)
    - `66.33.60.129` (TTL: 1800)

### MX Records (Mail Exchange)
- `berjak.co` → `mx01.mail.icloud.com` (Priority: 10, TTL: 3600)
- `berjak.co` → `mx02.mail.icloud.com` (Priority: 10, TTL: 3600)

### TXT Records
- **Apple Domain Verification:** `apple-domain=hiOziu3RQR3x3edt` (TTL: 3600)
- **SPF Record:** `v=spf1 include:icloud.com ~all` (TTL: 3600)
- **MongoDB Verification:** `mongodb-site-verification=KwZZaJ87TCK9DSDec04usQv5CyTUSoPb` (TTL: 3600)
- **Google Site Verification:** `google-site-verification=mXnJhNiDvaTCA28BOEy3sgxQa5xSEDttwWPcXsUCt8E` (TTL: 3600)

---

## berjak.com.au Domain Records

### Name Servers (NS Records)
- `berjak.com.au` → `ns1.vercel-dns.com` (TTL: 86400)
- `berjak.com.au` → `ns2.vercel-dns.com` (TTL: 86400)
- **Vercel DNS Management:** This domain is fully managed by Vercel DNS

### A Records
- `berjak.com.au` → `216.198.79.1` (TTL: 1800)
- `berjak.com.au` → `64.29.17.65` (TTL: 1800)
- `www.berjak.com.au` → `64.29.17.1` (TTL: 1800)
- `www.berjak.com.au` → `216.198.79.1` (TTL: 1800)

### MX Records (Mail Exchange)
- `berjak.com.au` → `aspmx.l.google.com` (Priority: 1, TTL: 3600)
- `berjak.com.au` → `alt1.aspmx.l.google.com` (Priority: 5, TTL: 3600)
- `berjak.com.au` → `alt2.aspmx.l.google.com` (Priority: 5, TTL: 3600)
- `berjak.com.au` → `alt3.aspmx.l.google.com` (Priority: 10, TTL: 3600)
- `berjak.com.au` → `alt4.aspmx.l.google.com` (Priority: 10, TTL: 3600)

### TXT Records
- **Mail Configuration:** `ASPMX.L.GOOGLE.COM` (TTL: 60)
- **OpenAI Domain Verification:** `openai-domain-verification=dv-1bUFH9QtaCevS1rghnm3AmBQ` (TTL: 60)
- **SPF Record:** `v=spf1 include:_spf.google.com ~all` (TTL: 60)

---

## Vercel Configuration Analysis

### berjak.co Vercel Setup
- **Status:** ✅ Properly configured for Vercel
- **Configuration:** www subdomain points to `cname.vercel-dns.com`
- **Root domain:** Points directly to IP address (not using Vercel CNAME)
- **Note:** Only www.berjak.co is configured for Vercel hosting

### berjak.com.au Vercel Setup
- **Status:** ✅ Fully configured for Vercel
- **Configuration:** Complete Vercel DNS management
- **Name Servers:** Using Vercel DNS servers exclusively
- **Root and www:** Both configured with direct A records to Vercel infrastructure

---

## Key Findings

1. **berjak.co** is managed through GoDaddy DNS but has www subdomain configured for Vercel
2. **berjak.com.au** is fully managed by Vercel DNS with complete integration
3. Both domains have proper Vercel configurations for web hosting
4. Email services are configured differently:
   - berjak.co uses iCloud Mail
   - berjak.com.au uses Google Workspace (Gmail for Business)
5. Various verification records are in place for different services

---

## Recommendations

1. **Domain Consistency:** Consider standardizing DNS management approach
2. **Root Domain Redirect:** Ensure berjak.co root domain redirects properly to www or is also configured for Vercel
3. **SSL/TLS:** Verify SSL certificates are properly configured for both domains
4. **Monitoring:** Set up DNS monitoring to track any configuration changes
