# Placeholders to Replace

This document enumerates all temporary placeholder assets, credentials, and legal texts in **NextGen IT Hub** that must be updated with your company's official information prior to production release.

---

## Critical (must replace before launch)
- [ ] **Logo**: Replace text logo in `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx` with your official SVG / PNG logo image (`public/images/logo.png`).
- [ ] **Phone**: Replace `+91-XXXXXXXXXX` in all files (`Footer.tsx`, contact page, schemas) with your business hotline.
- [ ] **WhatsApp**: Replace `91XXXXXXXXXX` in `FloatingButtons.tsx` and WhatsApp Cloud API configuration with your verified WhatsApp Business number.
- [ ] **Address**: Replace placeholder address in `Footer.tsx` and `src/app/(public)/contact/page.tsx` with your real showroom/warehouse address in India.
- [ ] **GSTIN**: Replace `[PLACEHOLDER]` / `27AAAAA0000A1Z5` with your active 15-digit Goods and Services Tax Identification Number.
- [ ] **CIN**: Replace `[PLACEHOLDER]` / `U72900MH2020PTC123456` with your Corporate Identification Number registered with MCA India.
- [ ] **Email**: Replace `hello@nextgenithhub.com` / `support@nextgenithub.in` with your official corporate email address.

---

## Media (replace with real assets)
- [ ] **Hero video**: `src/assets/videos/` or `public/videos/` — add `hero.mp4` and `hero.webm` (10–20s, optimized, <3MB each).
- [ ] **Hero poster**: `public/images/hero-poster.jpg` (1920x1080 compressed fallback image for mobile and low-bandwidth connections).
- [ ] **Laptop images**: Add 4+ high-resolution photos per laptop from your actual refurbished inventory (front open, keyboard close-up, ports side, exterior top lid).
- [ ] **Team photos**: `src/assets/images/team/` or `public/images/team/` — replace placeholders on About page with leadership and technician portraits.
- [ ] **Showroom/warehouse photos**: Add authentic photos of your testing bench, warehouse racks, and customer experience center.
- [ ] **Partner logos**: Replace corporate client and logistics partner logos (Delhivery, BlueDart, Razorpay, Intel) with licensed high-res SVGs.

---

## Legal (review by lawyer)
- [ ] **Privacy Policy**: Review `src/app/(public)/privacy-policy/page.tsx` with qualified Indian cyber law counsel for compliance with DPDP Act 2023.
- [ ] **Terms & Conditions**: Update `src/app/(public)/terms/page.tsx` with your dispute jurisdiction (e.g. Courts of Mumbai/Pune).
- [ ] **Return & Refund Policy**: Customize the 30-day return policy terms, conditions for refusal (physical liquid damage), and refund processing timelines.
- [ ] **Warranty Policy**: Formalize the 6-month comprehensive hardware warranty coverage terms (screen, motherboard, battery health thresholds).
- [ ] **Grievance Officer details**: Appoint and list official Grievance Officer name, email, and Indian registered office address in `src/app/(public)/grievance-officer/page.tsx`.

---

## Google Maps
- [ ] **Real coordinates**: Update latitude and longitude in `src/app/(public)/contact/page.tsx` and structured JSON-LD data.
- [ ] **Google Maps embed URL**: Generate an authentic Google Maps iframe embed tag pointing to your verified Google Business Profile.

---

## SEO
- [ ] **Real meta descriptions**: Audit and customize unique, compelling meta descriptions and OpenGraph preview images across all routes.
- [ ] **Google Analytics 4 ID**: Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (format: `G-XXXXXXXXXX`) in `.env`.
- [ ] **Facebook / Meta Pixel ID**: Set `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` in `.env`.
- [ ] **Google Search Console verification**: Add your Google Search Console HTML verification meta tag in `src/app/layout.tsx`.
