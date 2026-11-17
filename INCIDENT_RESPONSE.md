# Incident Response Plan — NextGen IT Hub

This document defines the official Standard Operating Procedure (SOP) for detecting, triaging, containing, eradicating, and recovering from information security and data breach incidents at **NextGen IT Hub**, adhering to **CERT-In Cyber Security Directions (2022)** and the **Digital Personal Data Protection Act, 2023 (DPDP Act)**.

---

## 1. Incident Severity Levels & SLAs

| Severity | Definition & Impact | Target Triage | Target Containment | External Notification Mandate |
| :--- | :--- | :--- | :--- | :--- |
| **P1 - Critical** | Active payment manipulation, database exfiltration, ransomware, super-admin account hijack, or production outage affecting all users. | < 15 minutes | < 1 hour | **CERT-In within 6 hours**; Data Protection Board of India (DPBI) and affected users without undue delay. |
| **P2 - High** | Sustained Layer 7 DDoS attack, anomalous spike in failed admin logins, partial API degradation, or leak of non-critical operational keys. | < 30 minutes | < 4 hours | Internal executive escalation; external if user data implicated. |
| **P3 - Medium** | Single user account lockout abuse, credential stuffing on login endpoint contained by rate limits, or minor non-exploitable vulnerability reported via bug bounty. | < 2 hours | < 12 hours | Internal incident tracking and sprint fix. |
| **P4 - Low** | Dependency vulnerability with no public exploit path, minor informational scanner finding, or non-security UI bug. | < 24 hours | Next release | None. Documented in vulnerability backlog. |

---

## 2. Incident Detection & Monitoring

Incidents are identified via three primary channels:
1. **Automated Telemetry & Alerts**:
   - Sentry error monitoring alerts on anomalous crash rate spikes (>5% error budget).
   - Redis and rate-limiting alerts triggering on IP brute-force thresholds (>50 failed attempts/min).
   - Razorpay webhook signature failure spikes (>10 consecutive HMAC validation errors).
   - PostgreSQL connection pool saturation and unusual query execution latency.
   - Cloudflare WAF threat mitigation spikes and origin server response anomalies.
2. **External Vulnerability Disclosures**:
   - Submissions received at `security@nextgenithub.in` per `SECURITY.md` and `security.txt`.
3. **Customer & Staff Escalations**:
   - Customer reports to support desk concerning unexpected order charges or unauthorized account activity.

---

## 3. Containment Steps Per Incident Type

### A. Data Breach / Exfiltration
1. **Isolate Database Access**:
   - Revoke public access to database cluster immediately.
   - Terminate active connection pools: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename = 'nextgen_user';`
2. **Rotate Master Encryption Keys & Database Secrets**:
   - Rotate `DATABASE_URL` and `DIRECT_URL` credentials in secrets manager.
   - Rotate `ENCRYPTION_KEY` and re-encrypt sensitive columns using offline key-rotation migration script.
3. **Capture Forensic Evidence**:
   - Snapshot database transaction logs (`WAL`), Nginx access logs, and Docker container memory states for forensic audit.
4. **Invalidate Active Sessions**:
   - Flush Redis session tokens: `redis-cli FLUSHDB` to terminate all customer and admin sessions immediately.

### B. Payment Fraud / Transaction Tampering
1. **Freeze Compromised Payment Gateway Webhooks**:
   - Revoke compromised `RAZORPAY_KEY_SECRET` and generate new live keys in the Razorpay Dashboard.
   - Update `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in production `.env` and restart containers.
2. **Lock Suspect Orders**:
   - Set status of all suspicious orders to `HELD_FOR_REVIEW` in PostgreSQL.
   - Prevent warehouse dispatch: halt automated packing/shipping queue jobs via BullMQ.
3. **Reconcile with Razorpay API**:
   - Run automated reconciliation script matching server-side paid amounts against Razorpay settlements to identify discrepancies.

### C. Distributed Denial of Service (DDoS)
1. **Activate Cloudflare "Under Attack" Mode**:
   - Enable JavaScript challenge and managed CAPTCHA for all traffic across `nextgenithub.in`.
2. **Enforce Rate Limits & Geo-blocking**:
   - Drop traffic originating from non-target geographical regions via Cloudflare WAF firewall rules.
   - Lower Nginx `limit_req` burst allowance from 40 to 10 in `nginx/nginx.conf`.
3. **Block Malicious CIDR Ranges**:
   - Inject identified attacking IP subnets directly into iptables / UFW firewall rules: `ufw insert 1 deny from <malicious_subnet> to any`.

### D. Administrative Account Compromise
1. **Revoke Compromised Admin Credentials**:
   - Set `isActive = false` on compromised admin user in `AdminUser` table.
   - Revoke all TOTP 2FA secrets and invalidate active JWT refresh tokens.
2. **Restrict Admin Panel Access**:
   - Update Nginx configuration to permit `/admin` routes solely from dedicated emergency VPN IP address.
3. **Audit Admin Actions**:
   - Query `AuditLog` table for the preceding 72 hours filtering by compromised `actorId` to identify unauthorized changes to pricing, order statuses, or customer data.

---

## 4. Eradication & Recovery Procedures

### Eradication:
1. Perform root cause analysis (RCA) to locate vulnerability entry point (e.g., outdated dependency, misconfigured permission, SQLi, or leaked token).
2. Develop patch in isolated branch, run automated CI tests (`.github/workflows/ci.yml`), and scan with Trivy and CodeQL.
3. Verify integrity of PostgreSQL backups: confirm last clean snapshot prior to incident timestamp.

### Recovery:
1. Deploy hotfix image to staging environment; run comprehensive automated test suite.
2. Promote to production cluster with rolling deployment.
3. Restore any corrupted database records from verified clean backup.
4. Closely monitor system telemetry, Sentry logs, and traffic graphs for 48 consecutive hours.

---

## 5. Notification Templates

### Template 1: Mandatory Regulatory Report to CERT-In (Within 6 Hours)
```text
To: incident@cert-in.org.in
Subject: Cyber Security Incident Notification — NextGen IT Hub (Category: [e.g. Data Exfiltration / Unauthorized Access])

1. Name of the Organisation: NextGen IT Hub Private Limited
2. Contact Person & Phone: Rajesh Sharma (+91-9876543210)
3. Date and Time of Incident: [YYYY-MM-DD HH:MM IST]
4. Description of Incident: [Brief factual summary of unauthorized event detected]
5. Affected Systems / Assets: [e.g. Production Application Cluster / Database]
6. Nature of Impact: [Data compromise, service interruption, etc.]
7. Immediate Containment Actions Taken: [e.g. Keys rotated, sessions flushed, IP blocked]
8. Remediation Status: [Contained / Under Investigation]
```

### Template 2: Mandatory Report to Data Protection Board of India (DPBI)
```text
To: dpo-reports@dpbi.gov.in
Subject: Notice of Personal Data Breach under Section 8(6) of DPDP Act 2023

Data Fiduciary Details:
- Name: NextGen IT Hub Private Limited
- Registration/CIN: U72900MH2020PTC123456
- Grievance Officer: grievance@nextgenithub.in

Breach Assessment:
- Nature and extent of personal data breach: [e.g., Contact details and delivery addresses]
- Approximate number of Data Principals affected: [e.g., 250]
- Potential consequences / risks to Data Principals: [Risk of unsolicited communications]
- Mitigating steps implemented: [Field-level AES-256 encryption active, credentials rotated, user sessions terminated]
- Guidance provided to Data Principals: [Password reset issued, phishing awareness advisory sent]
```

### Template 3: Notification to Affected Customers / Data Principals
```text
Subject: Important Security Notice Regarding Your NextGen IT Hub Account

Dear Customer,

At NextGen IT Hub, we treat the privacy and security of your personal information as our highest priority. We are writing to inform you of a recent security incident that may have affected your account details.

What Happened:
On [Date], our security telemetry detected [brief, transparent description of incident]. We initiated our emergency incident response protocol within 15 minutes and contained the incident.

What Information Was Involved:
Our investigation confirms that the data involved may have included your name, delivery address, and phone number. 
PLEASE NOTE: No debit/credit card numbers, UPI PINs, or bank account credentials were ever exposed or stored on our servers, as all payments are securely processed through Razorpay hosted infrastructure.

What We Have Done:
- Terminated all active account sessions to ensure unauthorized access is blocked.
- Rotated all server-side authentication credentials.
- Engaged external cybersecurity specialists to audit our systems.
- Notified the relevant regulatory authorities in compliance with Indian law.

What You Should Do:
- When you next log into your account, you will be prompted to set a new password.
- Please remain cautious against any suspicious emails or SMS messages asking for OTPs or personal credentials. NextGen IT Hub will NEVER ask for your password or payment PIN.

If you have questions, our dedicated Data Governance team is available at privacy@nextgenithub.in or call our support desk at +91-1800-XXX-XXXX.

Sincerely,
Rajesh Sharma
Grievance Officer, NextGen IT Hub
```

---

## 6. Post-Mortem & Root Cause Analysis (RCA) Template

Every P1 or P2 incident requires completion of an RCA document within 72 hours of incident resolution.

```markdown
# Incident Post-Mortem: [INCIDENT-ID]

## Executive Summary
- Date of Incident: [Date]
- Incident Commander: [Name]
- Severity: [P1 / P2]
- Total Downtime / Exposure Window: [Duration]

## Timeline (All times in IST)
- HH:MM — Incident detected via [Sentry alert / alert system].
- HH:MM — Incident response team assembled; containment commenced.
- HH:MM — Containment achieved (keys rotated / traffic blocked).
- HH:MM — Hotfix deployed to production.
- HH:MM — Incident declared resolved; monitoring initiated.

## Root Cause Analysis (5 Whys)
1. Why did the issue happen?
2. Why was it not prevented?
3. Why was it not detected sooner?
4. Why did existing controls fail?
5. What underlying design gap permitted this?

## Preventive & Corrective Actions
| Action Item | Owner | Target Completion Date | Status |
| :--- | :--- | :--- | :--- |
| Add integration test for route auth | DevSecOps | YYYY-MM-DD | Pending |
| Upgrade vulnerable dependency | Backend Team | YYYY-MM-DD | Done |
| Update WAF rate-limiting rule | DevOps | YYYY-MM-DD | Done |
```
