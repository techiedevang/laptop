# Security Policy — NextGen IT Hub

NextGen IT Hub is committed to safeguarding our customers, our payment infrastructure, and the confidentiality of personal data across India. We welcome responsible security researchers to report potential vulnerabilities.

---

## 1. How to Report a Vulnerability (Responsible Disclosure)

If you believe you have discovered a security vulnerability in NextGen IT Hub, please report it immediately:

- **Primary Contact:** [`security@nextgenithub.in`](mailto:security@nextgenithub.in) (or [`security@nextgenithhub.com`](mailto:security@nextgenithhub.com))
- **GPG / PGP Key:** Available upon request for encrypting sensitive vulnerability attachments.
- **Reporting Format:**
  - Brief description of the vulnerability and its potential impact.
  - Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
  - Target URL, HTTP request/response payloads, and parameter names.
  - Screenshots or video evidence (if applicable).

---

## 2. Response Timeline & SLAs

We adhere to clear communication timelines for all responsible security reports:

- **Acknowledgment:** Within **48 hours** of report receipt.
- **Triage & Validation:** Within **7 days** of initial acknowledgment.
- **Status Updates:** Every **14 business days** until full remediation.
- **Remediation & Patching:** High/Critical severity issues remediated within **14 to 30 calendar days**.

---

## 3. Scope of Testing

### In-Scope:
- Production web application: `https://nextgenithub.in`
- All public and authenticated API endpoints under `/api/*`
- Authentication, session management, and RBAC authorization barriers
- Razorpay payment calculation and signature verification logic
- IDOR (Insecure Direct Object Reference) vulnerabilities
- SQL injection, stored/reflected XSS, and server-side request forgery (SSRF)
- DPDP Act compliance gaps (unauthorized access to personal customer records)

### Out-of-Scope:
- Denial of Service (DoS / DDoS) attacks or stress testing against our web servers or networks.
- Social engineering, phishing, or physical attacks against employees, offices, or warehouse staff.
- Third-party SaaS infrastructure outside our code (e.g. core Razorpay, Cloudflare, Resend, or LiveKit cloud servers).
- Spamming, brute-force against contact forms, or automated scanner report dumps without validated exploitability.
- Violations of user privacy, exfiltration of production user data, or data destruction.

---

## 4. Responsible Disclosure Ground Rules

To qualify for our Hall of Fame and reward considerations, researchers must:
1. Act in good faith to avoid privacy violations, data destruction, and interruption of customer service.
2. Provide us reasonable time to remediate the vulnerability before publicly disclosing details.
3. Never modify or access data that does not belong to your test account.

---

## 5. Bug Bounty & Recognition

While NextGen IT Hub does not operate a guaranteed cash bug bounty program for every submission, researchers who discover novel, high-impact security vulnerabilities (such as payment tampering, unauthorized admin takeover, or PII exfiltration) will be:
- Formally credited on our **Security Hall of Fame**.
- Eligible for exclusive merchandise, swag kits, or discretionary financial bounties based on CVSS 3.1 severity scores.
