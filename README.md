# NextGen IT Hub — Enterprise & Retail Refurbished Laptops Platform

> Production-ready, lightweight, SEO-optimized, secure e-commerce & video consultation platform with an administrative management panel for **NextGen IT Hub**, an Indian company selling refurbished laptops across B2B (bulk) and retail (individual) markets.

[![CI/CD Pipeline](https://github.com/nextgenithub/nextgen-it-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/nextgenithub/nextgen-it-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP%20Act%202023%20Compliant-emerald.svg)](PRIVACY_CHECKLIST.md)

---

## 💻 Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Next-Themes (Dual Light/Dark Theme support, default is Light)
- **Backend / API**: Next.js API Routes + Server Actions
- **Database & ORM**: PostgreSQL + Prisma ORM v6
- **Authentication & RBAC**: NextAuth.js + Argon2id / Bcrypt password hashing + TOTP 2FA for Admin
- **Payments**: Razorpay Standard / Hosted Checkout (UPI, GPay, PhonePe, Cards, Netbanking, COD)
- **Video Calling**: LiveKit WebRTC behind an abstract `VideoProvider` interface
- **Notifications**: WhatsApp Business Cloud API + Resend / SMTP Email
- **Data Protection**: AES-256-GCM application-level encryption for sensitive PII (DPDP Act 2023)

---

## 🚀 Key Features

### 1. Public Storefront
- **Dual Theme Support**: Flawless light and dark theme toggle via `next-themes` (Default: Light). High contrast, accessible WCAG AA design.
- **Hero Video & Trust Badges**: Clean responsive hero with background video and fallback poster, 50-point diagnostic guarantee, and 6-month comprehensive warranty.
- **Laptop Listing & Filtering**: Filter by brand, RAM, storage, processor, condition grade (A+/A/B), and in-stock status.
- **Laptop Detail Page**: Multi-angle image gallery, full hardware specs table, grade condition explainer, and Product JSON-LD schema.
- **Cart & Multi-Step Checkout**: Guest checkout, saved addresses, optional GSTIN for 18% Input Tax Credit, and Razorpay payment integration.
- **Corporate B2B Fleet Supply**: Volume pricing tiers (10 to 500+ units), custom OS deployment, and official GST quote request form.
- **Service Coverage & Pincode Checker**: Instant 6-digit Indian PIN delivery turnaround lookup (Bluedart / Delhivery / DTDC).
- **Comparison Page**: Objective "NextGen IT Hub vs Others" evaluation matrix.
- **Verified Customer Reviews**: Review rating distributions, verified buyer badges, and Review schema.

### 2. Interactive "Live Laptop Demo" Video Feature
- Customers can schedule a private 1-on-1 video call before purchasing.
- Warehouse engineers demonstrate the exact physical laptop on camera (screen angles, ports, battery health, cosmetic condition).
- Works directly in modern mobile/desktop web browsers (no app installation required).
- Short-lived signed JWT access tokens with lobby waiting room.

### 3. Comprehensive Admin Panel (`/admin`)
- **Dashboard**: Revenue analytics, orders by status, top-selling models, and low stock warnings.
- **Inventory Management**: Complete CRUD, SKU generator, grade assignment, cost vs selling margins, and duplicate unit action.
- **Orders Pipeline**: Status management (Placed, Packed, Shipped, Delivered, Cancelled), courier AWB tracking assignment, and GST invoice generation.
- **Video Meeting Hub**: View scheduled demos, assign staff engineers, launch host room, and check WhatsApp/Email delivery status.
- **Bulk B2B Pipeline**: Kanban-style corporate enquiries tracker with quote generator.
- **Security & Privacy**: Mandatory TOTP 2FA, session timeout, audit logging, and DPDP data request fulfillment.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ database running (or Docker)
- Redis 7+ (optional for queues)

### 1. Clone & Install Dependencies
```bash
cd D:\my\laptop\nextgen-it-hub
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL and keys. For local testing, default dummy secrets are provided.

### 3. Generate Prisma Client & Database Migration
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - Default Admin Email: `admin@nextgenithub.in`
  - Default Password: `Admin@12345`
  - 2FA Code: Any 6 digits (e.g. `123456`)

---

## 🔒 DevSecOps & Security Documentation
- [`SECURITY_CHECKLIST.md`](SECURITY_CHECKLIST.md): Technical mapping of all OWASP Top 10 & PCI-DSS controls.
- [`PRIVACY_CHECKLIST.md`](PRIVACY_CHECKLIST.md): Compliance checklist mapped to India's DPDP Act 2023.
- [`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md): 5-phase incident management protocol.
- [`SECURITY.md`](SECURITY.md): Responsible vulnerability disclosure guidelines.
- [`PLACEHOLDERS.md`](PLACEHOLDERS.md): List of assets, phone numbers, and keys to customize before production.

---

## 🐳 Docker Production Deployment

Build and run using Docker Compose:
```bash
docker-compose up --build -d
```
The application will launch on port 3000 behind an isolated internal network connected to PostgreSQL and Redis.

---

## 📄 License
This project is proprietary and built for **NextGen IT Hub Private Limited**, Delhi, India.
