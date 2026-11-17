# DPDP Act 2023 Compliance Checklist — NextGen IT Hub

This document establishes the comprehensive technical compliance architecture of **NextGen IT Hub** with the **Digital Personal Data Protection Act, 2023 (DPDP Act 2023)** enacted by the Parliament of India.

---

## 1. Notice & Consent Architecture (Section 5 & Section 6)

| Statutory Requirement | Code Implementation & Location | Status |
| :--- | :--- | :--- |
| **Clear & Itemized Notice (Sec 5)** | Consent notice provided in simple, accessible language outlining the exact purpose of data collection, processing mechanisms, and Data Principal rights. <br>*Location:* [`src/app/(auth)/signup/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(auth)/signup/page.tsx) & [`src/app/(public)/privacy-policy/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(public)/privacy-policy/page.tsx) | `COMPLIANT` |
| **Granular, Unticked Consent (Sec 6(1))** | Checkboxes for Terms of Service, WhatsApp delivery updates, and marketing communications are independent and unticked by default. Pre-ticked boxes are strictly prohibited. <br>*Location:* [`src/app/(auth)/signup/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(auth)/signup/page.tsx) | `COMPLIANT` |
| **Immutable Consent Logging (Sec 6(2))** | Every consent action records: `userId`, `purpose`, `policyVersion`, `granted` (boolean), client IP hash, user agent, and timestamp. Stored in relational table `ConsentLog`. <br>*Location:* [`prisma/schema.prisma`](file:///D:/my/laptop/nextgen-it-hub/prisma/schema.prisma) (`ConsentLog`) | `COMPLIANT` |
| **Easy Withdrawal of Consent (Sec 6(4))** | Data Principals can withdraw consent with the same ease with which it was given directly from their Account Privacy Center. <br>*Location:* [`src/app/(account)/account/privacy-center/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(account)/account/privacy-center/page.tsx) | `COMPLIANT` |
| **Granular Cookie Management** | Cookie banner prompts for explicit category acceptance (Essential, Analytics, Marketing). No non-essential tracking cookies fire before consent. <br>*Location:* [`src/components/layout/CookieConsentBanner.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/components/layout/CookieConsentBanner.tsx) | `COMPLIANT` |

---

## 2. Data Principal Rights (Section 11, 12, 13)

| Data Principal Right | Technical Solution | Location |
| :--- | :--- | :--- |
| **Right to Access Information (Sec 11)** | Self-service button generates a machine-readable JSON archive containing profile info, addresses, orders, and consent records. | [`src/app/api/account/export-data/route.ts`](file:///D:/my/laptop/nextgen-it-hub/src/app/api/account/export-data/route.ts) |
| **Right to Correction & Updating (Sec 12)** | Account settings page permits updating name, secondary phone numbers, and saved addresses. Blind index updated automatically. | [`src/app/(account)/account/settings/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(account)/account/settings/page.tsx) |
| **Right to Erasure / Deletion (Sec 12(3))** | Initiates automated personal identifier purging (`deletedAt` set, email and name anonymized, auth tokens revoked). | [`src/app/api/account/delete-request/route.ts`](file:///D:/my/laptop/nextgen-it-hub/src/app/api/account/delete-request/route.ts) |
| **Right to Grievance Redressal (Sec 13)** | Direct grievance submission portal with statutory 7-day SLA and published officer contact details. | [`src/app/(public)/grievance-officer/page.tsx`](file:///D:/my/laptop/nextgen-it-hub/src/app/(public)/grievance-officer/page.tsx) |
| **Right to Nominate (Sec 14)** | Profile field enabling the customer to designate a nominee in the event of death or incapacity. | [`prisma/schema.prisma`](file:///D:/my/laptop/nextgen-it-hub/prisma/schema.prisma) (`DataRequest`) |

---

## 3. Data Protection & Technical Safeguards (Section 8(5))

- **Field-Level AES-256-GCM Encryption**:  
  Personal Identifiable Information (PII) such as phone numbers, postal addresses, and customer GSTINs are stored using AES-256-GCM authenticated encryption. Each encrypted value contains a unique 96-bit initialization vector (IV) and 128-bit authentication tag.  
  *Location:* [`src/lib/encryption.ts`](file:///D:/my/laptop/nextgen-it-hub/src/lib/encryption.ts)

- **HMAC-SHA256 Blind Indexing**:  
  To enable fast indexed search of customer phone numbers without decrypting the entire database or storing plaintext, an HMAC-SHA256 blind index is calculated using a cryptographically separate `HASH_SECRET`.  
  *Location:* [`src/lib/encryption.ts`](file:///D:/my/laptop/nextgen-it-hub/src/lib/encryption.ts) (`hashForLookup`)

- **PII Redaction in Telemetry and Application Logs**:  
  Server logs redact phone numbers, email prefixes, credit card identifiers, and tokens before streaming to console or file.  
  *Location:* [`src/lib/logger.ts`](file:///D:/my/laptop/nextgen-it-hub/src/lib/logger.ts)

- **IP Anonymization in Web Server Logs**:  
  Nginx configuration masks the final octet of IPv4 client addresses (e.g. `203.0.113.0`) and trailing hextets of IPv6 addresses.  
  *Location:* [`nginx/nginx.conf`](file:///D:/my/laptop/nextgen-it-hub/nginx/nginx.conf)

---

## 4. Statutory Data Retention Standards (Section 8(7) vs. CGST Act)

- **Tax & Accounting Legal Override**: Under Section 36 of the Central Goods and Services Tax (CGST) Act, 2017, tax invoices containing customer GSTIN and billing address must be preserved for **72 months (6 years)** following the annual return filing date.
- **Implementation Strategy**:
  1. When an erasure request is executed, the user account is decoupled from public login and marketing tables.
  2. The customer's active session is terminated, and login credentials (`passwordHash`, `refreshTokens`) are purged.
  3. Tax invoices and historical order ledgers retain legally mandated tax details under cold, restricted-access storage.
  4. Marketing preferences, cookie consents, and temporary cart entries are permanently deleted.

---

## 5. Breach Notification Protocol (Section 8(6))

In the event of a verified personal data breach:
1. **Intimation to Data Protection Board of India (DPBI)**: Formal incident report filed without delay.
2. **CERT-In Incident Report**: Mandatory notification to the Indian Computer Emergency Response Team (CERT-In) within 6 hours as per Cyber Security Directions.
3. **Notification to Affected Data Principals**: Plain-language notification sent via registered email and SMS describing the nature of the breach, affected data categories, and protective steps taken.
*SOP Location:* [`INCIDENT_RESPONSE.md`](file:///D:/my/laptop/nextgen-it-hub/INCIDENT_RESPONSE.md)

---

## 6. Grievance Officer Contact Details

In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines) and Section 13 of the DPDP Act 2023:

- **Grievance Officer:** Mr. Rajesh Sharma  
- **Designation:** Head of Data Governance & Security  
- **Office Address:** NextGen IT Hub, Sector 18, Vashi, Navi Mumbai, Maharashtra 400703, India  
- **Email:** `grievance@nextgenithub.in`  
- **Response Acknowledgment:** Within 48 hours  
- **Statutory Resolution Window:** Maximum 30 calendar days  
