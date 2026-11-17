# Production Deployment Guide — NextGen IT Hub

This guide covers the end-to-end production deployment procedures for **NextGen IT Hub**, supporting both **Vercel Serverless** and self-hosted **Ubuntu VPS (Docker + Nginx)** environments with high availability, security hardening, and database persistence.

---

## Architecture Overview

```
                      [ Client Web / Mobile ]
                                 │
                                 ▼
                     [ Cloudflare Edge / WAF ]
                  (DDoS Mitigation, SSL, Bot Mgmt)
                                 │
                        Full Strict SSL
                                 │
                                 ▼
                    [ Ubuntu VPS / Nginx Proxy ]
                     (Port 443 -> Reverse Proxy)
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
        [ Next.js Node Runner ]        [ Static Asset Cache ]
            (Docker / Port 3000)          (/_next/static)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [ PostgreSQL 16 ]    [ Redis 7 ]
  (Port 5432 / SSL)  (BullMQ / Rate Limits)
```

---

## 1. Environment Variables Configuration

Copy `.env.example` to `.env.production` on your deployment target. Ensure all secrets are populated with strong random values:

```bash
# Generate 64-character hex key for AES-256-GCM encryption
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate 32-character secret for NextAuth
openssl rand -base64 32
```

### Essential Production Variables:
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://nextgenithub.in

# Database
DATABASE_URL="postgresql://nextgen_prod_user:StrongPasswordHere@localhost:5432/nextgen_prod?schema=public&sslmode=prefer"
DIRECT_URL="postgresql://nextgen_prod_user:StrongPasswordHere@localhost:5432/nextgen_prod?schema=public&sslmode=prefer"

# Auth
NEXTAUTH_SECRET="your-generated-nextauth-secret-min-32-chars"
NEXTAUTH_URL="https://nextgenithub.in"

# Cryptography & Blind Indexing
ENCRYPTION_KEY="64-character-hex-string-for-aes-256-gcm"
HASH_SECRET="strong-secret-key-for-phone-blind-index"

# Redis
REDIS_URL="redis://:RedisPasswordHere@localhost:6379"

# Razorpay
RAZORPAY_KEY_ID="rzp_live_yourLiveKeyId"
RAZORPAY_KEY_SECRET="yourLiveKeySecret"
RAZORPAY_WEBHOOK_SECRET="yourConfiguredWebhookSecret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_yourLiveKeyId"

# LiveKit (Video Demoroom)
LIVEKIT_API_KEY="your-livekit-api-key"
LIVEKIT_API_SECRET="your-livekit-api-secret"
LIVEKIT_WS_URL="wss://nextgen-demo.livekit.cloud"

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAA..."
TURNSTILE_SECRET_KEY="0x4AAAAAA..."

# Sentry Telemetry
SENTRY_DSN="https://key@sentry.io/project"
NEXT_PUBLIC_SENTRY_DSN="https://key@sentry.io/project"
```

---

## 2. Option A: VPS Deployment (Ubuntu 22.04 / 24.04 LTS)

### Step 1: Server Provisioning & Docker Installation
Follow `docs/SERVER_SETUP.md` to harden the Ubuntu host. Then install Docker Engine:

```bash
sudo apt update && sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 2: Clone Repository & Build Container
```bash
git clone https://github.com/your-org/nextgen-it-hub.git /opt/nextgen-it-hub
cd /opt/nextgen-it-hub
cp .env.production .env

# Run database migrations
npx prisma migrate deploy

# Build and start services using Docker Compose
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 3: Nginx Reverse Proxy Setup
```bash
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo nginx -t && sudo systemctl reload nginx
```

### Step 4: Let's Encrypt SSL/TLS Certificate
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d nextgenithub.in -d www.nextgenithub.in --agree-tos -m security@nextgenithub.in --redirect
```

---

## 3. Option B: Vercel Deployment

1. **Import Git Repository**: In your Vercel Dashboard, import the NextGen IT Hub repository.
2. **Environment Variables**: Add all variables from `.env.production` into **Project Settings → Environment Variables**.
3. **Build Command**: `prisma generate && next build`
4. **Install Command**: `npm ci`
5. **Database Configuration**: Ensure `DATABASE_URL` uses a pooled serverless connection (e.g. Supabase connection pooler on port 6543 or Neon Serverless Postgres), and set `DIRECT_URL` to direct database port 5432 for migrations.

---

## 4. Cloudflare Configuration & WAF Protection

1. **DNS Setup**:
   - Create `A` record for `@` pointing to your VPS public IPv4 address (Proxy status: Proxied / Orange Cloud).
   - Create `CNAME` for `www` pointing to `nextgenithub.in` (Proxied).
2. **SSL/TLS Mode**:
   - Set encryption mode to **Full (Strict)**.
   - Enable **Always Use HTTPS** and **Minimum TLS Version 1.2**.
   - Enable **HTTP/3 (with QUIC)** and **0-RTT Connection Resumption**.
3. **Cloudflare WAF Rules**:
   - **Rule 1: Restrict Admin Access**:
     ```
     (http.request.uri.path eq "/admin" or starts_with(http.request.uri.path, "/api/admin")) and not ip.src in {your_vpn_ip your_office_ip}
     Action: Block
     ```
   - **Rule 2: Mitigate Automated Bot Crawlers**:
     ```
     (cf.bot_management.score lt 30 and not cf.bot_management.verified_bot)
     Action: Managed Challenge
     ```
   - **Rule 3: Rate Limit Auth & Checkout**:
     ```
     Path: /api/auth/*, Requests: >10 per minute per IP, Action: Block for 1 hour.
     ```

---

## 5. PostgreSQL & Redis Configuration

### PostgreSQL Connection Tuning:
Add the following to `/etc/postgresql/16/main/postgresql.conf`:
```ini
max_connections = 100
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Redis Configuration:
In `/etc/redis/redis.conf`:
```ini
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
appendonly yes
appendfsync everysec
```

---

## 6. Monitoring & Alerting Setup

1. **Sentry Error Tracking**:
   - Verify `@sentry/nextjs` triggers error events on uncaught exceptions.
   - Configure alert rules for any unhandled 500 error on payment endpoints to send immediate Slack / PagerDuty alerts.
2. **UptimeRobot / BetterUptime Monitoring**:
   - Monitor `https://nextgenithub.in/api/health` every 60 seconds with SSL expiry notification (alert at 14 days remaining).
3. **Automated Database Backup Verification**:
   - Ensure `deployment/backup.sh` is configured in `/etc/cron.daily/nextgen-backup` with healthchecks.io heartbeats.
