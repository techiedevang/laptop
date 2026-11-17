# Security Checklist — NextGen IT Hub

This document maps every implemented security and DevSecOps control across **NextGen IT Hub** directly to source code implementations, following **OWASP ASVS Level 2**, **PCI-DSS Level 4 Merchant**, and **DPDP Act 2023** statutory guidelines.

---

## 1. PCI-DSS Aware Payments
- [x] **Razorpay hosted checkout only — no card data touches our servers**  
  *LOCATION:* `src/app/(public)/checkout/page.tsx` (Razorpay Standard Checkout integration with client-side script execution, zero payment credentials transit our server)
- [x] **Server-side price calculation**  
  *LOCATION:* `src/app/api/payments/create-order/route.ts` & `src/lib/gst.ts` (Prices fetched from database, GST computed strictly server-side, client price inputs disregarded)
- [x] **HMAC SHA256 signature verification**  
  *LOCATION:* `src/app/api/payments/verify/route.ts` & `src/lib/razorpay.ts` (`verifyPaymentSignature` validates `razorpay_order_id|razorpay_payment_id` with `crypto.timingSafeEqual`)
- [x] **Webhook signature verification + idempotency**  
  *LOCATION:* `src/app/api/payments/webhook/route.ts` & `src/lib/razorpay.ts` (`verifyWebhookSignature` using `X-Razorpay-Signature` with duplicate event suppression)
- [x] **Stock locked with DB transaction + row locking**  
  *LOCATION:* `src/app/api/payments/create-order/route.ts` & `prisma/schema.prisma` (`prisma.$transaction` and unit reservation status updates prevent race conditions and overselling)
- [x] **Refunds from admin only with audit log**  
  *LOCATION:* `src/app/api/admin/orders/[id]/refund/route.ts` (Requires `SUPER_ADMIN` or `ADMIN` RBAC permission; logs actor ID, amount, and timestamp into `AuditLog`)

---

## 2. Authentication & Authorization
- [x] **Argon2id password hashing**  
  *LOCATION:* `src/app/api/auth/signup/route.ts` & `src/lib/auth.ts` (Cryptographic salting and high memory/iteration cost for stored passwords)
- [x] **Short-lived JWT + rotating refresh tokens in httpOnly cookies**  
  *LOCATION:* `src/lib/auth.ts` & `src/lib/server-auth.ts` (HttpOnly, Secure, SameSite=Strict cookies; zero tokens stored in accessible `localStorage`)
- [x] **Account lockout after 5 failed logins**  
  *LOCATION:* `src/app/api/auth/[...nextauth]/route.ts` & `src/lib/rate-limit.ts` (RateLimiterFlexible increments failed attempts and enforces 15-minute lockout)
- [x] **Admin 2FA (TOTP) mandatory**  
  *LOCATION:* `src/app/admin/login/page.tsx` & `src/app/api/admin/auth/route.ts` (Enforces 6-digit RFC 6238 TOTP verification using speakeasy / otplib)
- [x] **RBAC enforced server-side on every admin API route**  
  *LOCATION:* `src/lib/server-auth.ts` (`requireAdmin` and `requireAdminRole` guard routes against unauthorized user roles)
- [x] **IDOR prevention: users can only access own data**  
  *LOCATION:* `src/lib/server-auth.ts` (`requireOwnership` helper validates session user ID against resource owner ID before query execution)
- [x] **Full audit log for admin actions**  
  *LOCATION:* `prisma/schema.prisma` (`AuditLog` entity) & all admin API routes (Captures actor ID, action name, resource ID, IP address, and payload diff)

---

## 3. Application Security
- [x] **Zod schema validation on all API routes**  
  *LOCATION:* `src/lib/validations.ts` (Used in every API route handler for rigorous request body and query parameter typing)
- [x] **Prisma ORM (no raw SQL)**  
  *LOCATION:* Throughout `src/app/api/` (Parameterized queries prevent SQL injection by design; zero string concatenation)
- [x] **XSS: DOMPurify for rich text content**  
  *LOCATION:* `src/app/api/admin/content/route.ts` & public rendering views (Sanitizes blog content and product HTML descriptions before output)
- [x] **CSRF protection**  
  *LOCATION:* `src/middleware.ts` (SameSite=Strict cookies + origin and referer header validation on state-modifying POST/PUT/DELETE requests)
- [x] **Secure file upload (allow-list, re-encode, Cloudinary)**  
  *LOCATION:* `src/app/api/upload/route.ts` (MIME-type validation, magic byte inspection, SVG XML entity stripping, and direct Cloudinary CDN upload)
- [x] **Rate limiting on all sensitive routes**  
  *LOCATION:* `src/lib/rate-limit.ts` (Redis-backed token bucket rate limiters on auth, payment, review, and contact endpoints)
- [x] **CAPTCHA on signup, contact, booking, review forms**  
  *LOCATION:* Cloudflare Turnstile token validation integrated into form schemas and backend handlers
- [x] **Security headers (CSP, HSTS, etc.)**  
  *LOCATION:* `src/middleware.ts` & `nginx/nginx.conf` (HSTS max-age 63072000, CSP, X-Frame-Options SAMEORIGIN, nosniff, Permissions-Policy)

---

## 4. Data Protection
- [x] **HTTPS everywhere**  
  *LOCATION:* `nginx/nginx.conf` (HSTS preload header, automatic 301 HTTP -> HTTPS redirection) & `src/middleware.ts`
- [x] **PII fields encrypted at rest (AES-256-GCM)**  
  *LOCATION:* `src/lib/encryption.ts` (AES-256-GCM authenticated encryption applied to phone numbers, delivery addresses, and customer GSTIN)
- [x] **PII masking in logs**  
  *LOCATION:* `src/lib/logger.ts` (Regex sanitization masks phone numbers e.g. `98xxxxxx10` and email usernames before writing logs)
- [x] **No card/UPI data stored**  
  *LOCATION:* `prisma/schema.prisma` (Order and Payment tables store exclusively `razorpay_payment_id`, status, amount, and timestamp)
- [x] **Automated backups configured**  
  *LOCATION:* `deployment/backup.sh` (Daily encrypted PostgreSQL dumps using OpenSSL AES-256 with 30-day lifecycle retention)
- [x] **Least-privilege DB user**  
  *LOCATION:* Documented in `README.md` & `docs/SERVER_SETUP.md` (App connection role restricted to necessary tables without superuser privileges)

---

## 5. Video Calls
- [x] **Short-lived signed JWT room tokens**  
  *LOCATION:* `src/app/api/meetings/token/route.ts` & `src/lib/livekit.ts` (LiveKit AccessToken issued with 1-hour expiration and single room grant)
- [x] **Waiting room (lobby) before admit**  
  *LOCATION:* `src/app/(public)/meet/[token]/page.tsx` (Pre-join device verification screen and host admission control)
- [x] **No recording by default**  
  *LOCATION:* `src/lib/livekit.ts` (Egress / room recording disabled in default room configuration)
- [x] **Meeting link not public/indexed**  
  *LOCATION:* `src/middleware.ts` (`X-Robots-Tag: noindex, nofollow` for `/meet/*`) & `src/app/robots.ts`
- [x] **Rate limit on booking**  
  *LOCATION:* `src/app/api/meetings/book/route.ts` (Max 3 demo requests per IP/phone per hour)

---

## 6. Infrastructure
- [x] **Cloudflare WAF (documented)**  
  *LOCATION:* `docs/DEPLOYMENT.md` (Rules for blocking known malicious bots, managed challenges for suspicious ASNs, and rate limiting)
- [x] **UFW rules (documented)**  
  *LOCATION:* `docs/SERVER_SETUP.md` (Strict firewall default deny incoming; allow ports 22, 80, 443 only)
- [x] **Non-root Docker user**  
  *LOCATION:* `Dockerfile` (Runs container process as system user `nextjs` with UID 1001)
- [x] **Separate environments**  
  *LOCATION:* `.env.example`, `.env.production`, and `.github/workflows/ci.yml` (Staging vs Production environment isolation)

---

## 7. CI/CD
- [x] **Lint, typecheck, tests on PR**  
  *LOCATION:* `.github/workflows/ci.yml` (`lint-typecheck` and `test` jobs run on push and pull requests)
- [x] **Secret scanning (Gitleaks)**  
  *LOCATION:* `.github/workflows/ci.yml` (`gitleaks/gitleaks-action@v2` scans full git commit history)
- [x] **SAST (CodeQL)**  
  *LOCATION:* `.github/workflows/ci.yml` (`github/codeql-action` scans JavaScript/TypeScript codebase)
- [x] **Dependency scanning (npm audit)**  
  *LOCATION:* `.github/workflows/ci.yml` (`npm audit --audit-level=high` blocks builds with high/critical vulnerabilities)
- [x] **Container scan (Trivy)**  
  *LOCATION:* `.github/workflows/ci.yml` (`aquasecurity/trivy-action` scans Docker images for OS and package CVEs)
- [x] **DAST (OWASP ZAP) on staging**  
  *LOCATION:* `.github/workflows/ci.yml` (Staging pipeline triggers baseline OWASP security scanning)

---

## 8. Privacy (DPDP Act 2023)
- [x] **Explicit consent checkboxes**  
  *LOCATION:* `src/app/(auth)/signup/page.tsx` & `prisma/schema.prisma` (`ConsentLog` captures explicit timestamped grants)
- [x] **Privacy Center (download, correct, delete data)**  
  *LOCATION:* `src/app/(account)/account/privacy-center/page.tsx` (Self-service portal for Data Principal rights under Sections 11 & 12)
- [x] **Data deletion workflow**  
  *LOCATION:* `src/app/api/account/delete/route.ts` (Soft deletion of user identifiers with statutory retention of tax invoices)
- [x] **Cookie consent banner**  
  *LOCATION:* `src/components/layout/CookieConsentBanner.tsx` (Granular opt-in for analytics and marketing tracking)
- [x] **No PII in URLs or logs**  
  *LOCATION:* `src/lib/logger.ts` (Automated data masking) & `nginx/nginx.conf` (IP address anonymization)
