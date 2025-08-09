# 🏢 COMPREHENSIVE ASSET REGISTRY
**Last Updated**: August 7, 2025  
**Maintained by**: jbear  
**Purpose**: Central registry of all digital assets, credentials, and infrastructure

---

## 🌐 DOMAIN PORTFOLIO

### 1. berjak.co
- **Registrar**: GoDaddy (DNS) → **Transfer to**: Crazy Domains (In Progress)
- **Status**: Active, Transfer Step 3 Pending
- **DNS Configuration**:
  - **A Record**: `76.76.21.21`
  - **NS Records**: 
    - `ns55.domaincontrol.com`
    - `ns56.domaincontrol.com`
  - **MX Records** (iCloud Mail):
    - `10 mx01.mail.icloud.com`
    - `10 mx02.mail.icloud.com`
  - **CNAME Records**:
    - `www.berjak.co` → `cname.vercel-dns.com`
  - **TXT Records**:
    - Apple Domain: `apple-domain=hiOziu3RQR3x3edt`
    - SPF: `v=spf1 include:icloud.com ~all`
    - MongoDB: `mongodb-site-verification=KwZZaJ87TCK9DSDec04usQv5CyTUSoPb`
    - Google: `google-site-verification=mXnJhNiDvaTCA28BOEy3sgxQa5xSEDttwWPcXsUCt8E`

**Services**:
- **Email**: iCloud Mail (mx01/mx02.mail.icloud.com)
- **Web Hosting**: Vercel
- **Database**: MongoDB (verified)
- **Analytics**: Google (verified)

**Notes**: 
- iCloud integration for authentication and connectivity ✅
- Email sovereignty through iCloud infrastructure
- Transfer requires manual completion at Crazy Domains

### 2. berjak.com.au
- **Registrar**: Crazy Domains ✅
- **Status**: Active with Web Hosting
- **Domain Expiration**: September 2025 ⚠️ (REQUIRES RENEWAL)
- **Hosting Plan**: Linux Hosting - Ultimate Classic
- **Hosting Billing**: 
  - **Purchase Date**: January 8, 2019
  - **Expiry Date**: January 8, 2029 (10-year term)
  - **Status**: Paid in full until 2029 ✅
- **DNS Configuration**:
  - **A Records**: `216.198.79.65`, `64.29.17.1`
  - **NS Records**: 
    - `ns1.vercel-dns.com`
    - `ns2.vercel-dns.com`
  - **MX Records** (Google Workspace):
    - `1 aspmx.l.google.com`
    - `5 alt1.aspmx.l.google.com`, `5 alt2.aspmx.l.google.com`
    - `10 alt3.aspmx.l.google.com`, `10 alt4.aspmx.l.google.com`

**Hosting Features**:
- **Control Panel**: cPanel
- **Storage**: SSD (0.589GB used)
- **Databases**: MySQL (2 available, 0 used)
- **Email**: 6 accounts available
- **SSL**: Available
- **PHP**: Version 8.1
- **Uptime**: 99.9% guarantee

**Services**:
- **Email**: Google Workspace
- **Web Hosting**: Crazy Domains + Vercel DNS
- **Website**: Active (berjak.com.au)

**Notes**: 
- Fully operational hosting account
- Google Workspace email integration
- Vercel DNS management
- Website displays "Berjak Trading Platform | Next-Generation Global Commerce"

### 3. walkerville.com.au
- **Registrar**: GoDaddy
- **Status**: Active
- **Renewal Date**: February 22, 2026
- **Renewal Cost**: $21.77/yr AUD
- **Auto-renew**: Enabled ✅
- **Estimated Value**: $2,237 USD
- **Protection Level**: High (Ownership Protection)
- **DNS Status**: SERVFAIL (Domain may be parked or inactive)

**Notes**: 
- High-value domain with comprehensive protection
- May need DNS configuration review
- Well-protected against high-risk threats

---

## 🔐 SSH KEY INVENTORY

### Primary Keys
1. **id_ed25519** - Main GitHub key
2. **id_ed25519_nexus** - Nexus infrastructure
3. **id_ed25519_nexus_infinity** - GitHub nexus-infinity account
4. **id_ed25519_homefield** - Home network devices
5. **id_ed25519_crazydomains_berjak** - Crazy Domains berjak access
6. **berjak_key** - Berjak server access
7. **berjak_walkerv4** - Berjak server (walkerv4 user)
8. **id_rsa** - Legacy RSA key
9. **id_rsa_berjak_server** - Berjak server RSA

### Key Locations
- **Location**: `/Users/jbear/.ssh/`
- **Config File**: `/Users/jbear/.ssh/config`
- **Backup**: `config.backup.20250707_120834`

---

## 🏠 NETWORK INFRASTRUCTURE

### Home Network (Homefield)
- **Internet Provider**: Starlink
- **Router**: Google Nest Wi-Fi system
- **Network**: 192.168.86.x

### Connected Devices
1. **Mac Studio** (192.168.86.30)
   - User: jbear
   - SSH: id_ed25519_homefield
   - Host aliases: macstudio, mac_studio

2. **Kitchen iMac** (192.168.86.29)
   - User: jeremyrich
   - SSH: id_ed25519_homefield
   - Host aliases: bears-imac, kitchen_imac

3. **Den iMac** (192.168.86.20)
   - User: jacquesrich
   - SSH: id_ed25519_homefield
   - Host aliases: denimac, den_imac

4. **MacBook Air** (192.168.86.22)
   - User: jeremyrich
   - SSH: id_ed25519_homefield
   - Host aliases: macbookair, macbook_air

---

## 🖥️ SERVER INFRASTRUCTURE

### Berjak Production Server
- **Host**: cp-wc35.per01.ds.network
- **User**: walkerv4
- **SSH Key**: berjak_walkerv4
- **Security**: Enhanced ciphers and algorithms
- **Purpose**: Production hosting

---

## 🔑 AUTHENTICATION & CREDENTIALS

### GitHub Accounts
- **Primary**: nexus-infinity (id_ed25519_nexus_infinity)
- **Secondary**: Main account (id_ed25519)

### Cloud Services
- **Google Cloud**: 
  - Project: berjak-development-project
  - Billing: 0173F4-82369F-5D95C5
  - Credentials: `/Users/jbear/FIELD-DEV/auth/service_accounts/service_account.json`
- **OpenAI**: API key configured ✅
- **Gemini**: API key configured ✅

### Email Services
- **Primary**: iCloud integration
- **Domain Email**: berjak.co via iCloud Mail

---

## 📊 DATABASE ASSETS

### Local Databases (Akron Volume)
- **Deduplication DB**: `/Volumes/Akron/bear_data/deduplication.db`
- **Email Sovereignty DB**: `/Volumes/Akron/bear_data/berjack_communications/email_sovereignty.db`
- **Email Ingestion DB**: `/Volumes/Akron/bear_data/email_ingestion.db`
- **Sovereignty Registry DB**: `/Volumes/Akron/bear_data/sovereignty_registry.db`

---

## 🔧 DEVELOPMENT TOOLS

### Model Context Protocol (MCP) Servers
**Environment Variables Per Server**:
- FIELD_SYMBOL
- CHAKRA_RESONANCE  
- DOJO_GATE
- PORT
- KLEIN_INDEX
- FREQUENCY
- FIELD_NAME

**Configured Servers**:
- filesystem, git, github, memory
- google-drive, puppeteer, pieces-os-monitor
- brave-search

### Development Environment
- **Terminal**: WarpTerminal
- **Monitoring**: Pieces OS integration
- **Backup**: LaunchAgent automation (macOS)
- **Virtual Environments**: Standard Python setup

---

## 🚨 CRITICAL ACTION ITEMS

### Immediate (Priority 1)
- [ ] **Renew berjak.com.au domain registration**
  - Domain expires September 2025 (URGENT)
  - Hosting paid until January 2029
  - Renew domain to avoid service interruption
- [ ] **Complete berjak.co transfer to Crazy Domains**
  - Login to Crazy Domains
  - Provide EPP/Auth code
  - Complete payment and transfer

### Short-term (Priority 2)  
- [ ] **Configure DNS for walkerville.com.au**
  - Investigate SERVFAIL issue
  - Set up proper DNS records
- [ ] **Organize SSH key usage**
  - Consolidate duplicate/unused keys
  - Update key descriptions
- [ ] **Set renewal reminders**
  - Calendar alert for walkerville.com.au (Feb 22, 2026)

### Long-term (Priority 3)
- [ ] **Infrastructure audit**
  - Review all SSH configurations
  - Update security protocols
  - Document all service integrations

---

## 📋 MAINTENANCE SCHEDULE

### Monthly
- Review domain expiration dates
- Check SSH key usage and security
- Verify backup automation status

### Quarterly  
- Update DNS configurations
- Review asset valuations
- Security audit of all keys and credentials

### Annually
- Complete infrastructure review
- Update all service credentials
- Renew certificates and licenses

---

## 📞 EMERGENCY CONTACTS & RECOVERY

### Domain Issues
- **GoDaddy Support**: Domain management
- **Crazy Domains**: Transfer issues
- **iCloud Mail**: Email service issues

### Server Issues  
- **Berjak Server**: cp-wc35.per01.ds.network administrator
- **Home Network**: Starlink + Google Nest support

### Backup Recovery
- **SSH Configs**: `/Users/jbear/.ssh/config.backup.20250707_120834`
- **Database Backups**: Akron volume (`/Volumes/Akron/bear_data/`)
- **Service Account**: `/Users/jbear/FIELD-DEV/auth/service_accounts/`

---

*This registry should be updated whenever infrastructure changes occur. All sensitive information is referenced by location rather than stored directly.*
