# Administrator User Guide — NextGen IT Hub

This guide is designed for store managers, inventory technicians, and system administrators operating the **NextGen IT Hub Admin Portal** (`https://nextgenithub.in/admin`).

---

## 1. Access & Two-Factor Authentication (TOTP)

1. Navigate to `/admin/login`.
2. Enter your authorized administrator email and password.
3. Open your configured authenticator app (Google Authenticator, Authy, or 1Password) and submit the 6-digit TOTP verification code.
4. Admin accounts enforce a mandatory 15-minute inactivity session timeout and lock after 5 consecutive failed attempts.

---

## 2. Managing Laptops & Inventory

### Adding a New Laptop:
1. Navigate to **Admin → Laptops → Add New**.
2. **Product Identity**:
   - **Title**: e.g., `Dell Latitude 7490 (14", Core i7 8th Gen, 16GB, 512GB SSD)`
   - **Brand**: Select `Dell`, `HP`, `Lenovo`, `Apple`, `Asus`, or `Acer`.
   - **Model & Generation**: Specify exact hardware generation.
   - **HSN Code**: Default is `8471` (Mandatory for GST invoice calculation).
3. **Refurbished Grading & Condition**:
   - **Grade A+**: Like new condition, 0 cosmetic scratches, 90%+ battery health.
   - **Grade A**: Minor faint scratches on exterior lid, flawless screen, 80%+ battery.
   - **Grade B**: Visible signs of wear, fully tested and functionally 100% verified.
4. **Pricing & GST**:
   - Enter **Base Price (Exclusive)** or **Selling Price (Inclusive of 18% GST)**.
   - Enter Original MRP for automated discount badge calculation.
5. **Serial Numbers & Tracking**:
   - In NextGen IT Hub, individual laptop units have discrete serial numbers and unique battery health records.
   - Enter unit serial numbers under the **Units** tab to increment available stock.

---

## 3. Order Management & Fulfillment Workflow

Navigate to **Admin → Orders** to view the live order pipeline.

### Order Status Progression:
1. **PLACED**: Customer has initiated checkout; payment confirmation received from Razorpay.
2. **CONFIRMED**: Order details and billing GSTIN validated by staff.
3. **PACKED**: Laptop pulled from inventory shelf, 40-point QC checklist validated, packed with tamper-proof security tape.
4. **SHIPPED**: Logistics courier (Delhivery, BlueDart, DTDC) assigned with tracking AWB number. An automated WhatsApp dispatch notification is triggered.
5. **DELIVERED**: Courier webhook or customer delivery confirmation received. 6-month warranty period commences automatically.
6. **RETURNED / REFUNDED**: In case of return within 30-day window, technician inspects device condition before initiating administrative refund.

---

## 4. Moderating Customer Reviews

Customer reviews submitted on product pages enter a `PENDING` queue to guard against spam, abusive language, or competitor sabotage.

1. Navigate to **Admin → Reviews**.
2. Review the rating (1 to 5 stars), customer comment, verified buyer badge, and attached device photos.
3. Actions:
   - **Approve**: Review is published publicly on product page and aggregated into average rating score.
   - **Reject**: Review is flagged as spam/inappropriate and archived.
   - **Staff Response**: Post a formal merchant response visible directly beneath the review.

---

## 5. Video Demoroom & Meeting Management

NextGen IT Hub features a live 1-on-1 video call system allowing customers to inspect refurbished laptop conditions in real time via WebRTC.

1. Navigate to **Admin → Video Meetings**.
2. View scheduled appointment slots (customer name, requested laptop model, contact number).
3. Actions:
   - **Join Call**: Clicking "Launch Demoroom" issues a secure host token and opens `/meet/[token]` in a dedicated operator window.
   - **Reschedule**: Select an alternative date/time slot; triggers automated SMS and WhatsApp update to customer.
   - **Complete**: Mark meeting as completed with notes on customer purchase intent.

---

## 6. Content Management System (CMS)

Navigate to **Admin → Content**:
- **Announcement Bar**: Toggle site-wide top banner (e.g., `"Diwali Festive Offer: Flat ₹2,000 Off on all ThinkPads with code FESTIVE2000"`).
- **Hero Carousel**: Update homepage banner graphics, CTA button labels, and target URLs.
- **Blog & Buying Guides**: Draft and publish SEO-optimized guides (e.g., *"How to Choose Between ThinkPad T480 and Dell Latitude 7490"*). Rich text is automatically sanitized with DOMPurify.

---

## 7. User Roles & Access Control (RBAC)

Admin privileges are strictly separated based on job roles:
- **SUPER_ADMIN**: Full platform authority, including staff account management, database backups, financial refunds, and secret rotation.
- **ADMIN**: Inventory management, order processing, refunds up to ₹50,000, review moderation.
- **MANAGER**: Order status tracking, video meeting assignments, inventory read/write, customer enquiries.
- **STAFF**: Packaging, tracking number input, video meeting host.

---

## 8. Site Settings & Indian Tax Configuration

Navigate to **Admin → Settings**:
- **Registered Business State**: Default is `Maharashtra`. Intra-state orders automatically calculate CGST 9% + SGST 9%; inter-state orders calculate IGST 18%.
- **Company GSTIN & CIN**: Sets official tax identifiers printed on automated PDF tax invoices.
- **Live Video Demo Hours**: Set daily operating window (e.g., 10:00 AM – 7:00 PM IST).
