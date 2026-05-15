---
title: "Architectural Characteristics"
description: "Quality attributes that constrain the architecture of GreenGrant"
---

# Architectural Characteristics

Architectural Characteristics are quality attributes that significantly influence the architecture of a system. The following characteristics have been identified for GreenGrant based on the case study and problem domain:

## Scalability

**Definition Link:** [Scalability - NEG](https://quality.arc42.org/qualities/scalability)

### Why is it important?

Publication of new grants may generate bursts of heavy usage, but most of the time site usage is scarce. The system must gracefully handle both quiet periods and sudden spikes when new grants open and thousands of applicants try to submit immediately.

**Impact on Architecture:**
- Requires horizontal scaling of application services.
- Event-driven patterns decouple request handling from processing.
- Database must support concurrent load without bottlenecking.
- Load balancing and auto-scaling are essential operational concerns.

---

## Availability

**Definition Link:** [Availability - NEG](https://quality.arc42.org/qualities/availability)

### Why is it important?

While some applications target smaller segments, many applications can expect a significant number of applicants who want to apply immediately when the application opens so that the budget is not exhausted. The system must be reliably accessible during these critical windows, or applicants will lose grant opportunities.

**Impact on Architecture:**
- Redundancy for critical components (application service, database).
- Resilient external integrations (MundaMail API with retries and fallbacks).
- Monitoring and alerting for instant incident response.
- Graceful degradation if non-critical components fail.

---

## Security

**Definition Link:** [Security - NEG](https://quality.arc42.org/qualities/security)

### Why is it important?

1. The system handles confidential user information (applicant identity, financial data, business details).
2. The review process of grant applications should be protected against attack patterns by malicious actors.
3. Data Localization is mandated: data processed by the system must be stored within Zamunda's territory, and the system must be operated within Zamunda's territory.

**Impact on Architecture:**
- Centralized identity and access management with MFA for privileged users.
- Encryption of data in transit (HTTPS/TLS) and at rest.
- All infrastructure and data storage must be within Zamunda's borders.
- Audit trails for all sensitive operations.
- Regular security assessments and compliance verification.

---

## Auditability

**Definition Link:** [Auditability - NEG](https://quality.arc42.org/qualities/auditability)

### Why is it important?

Given the presence of high financial and governmental stakes, the system has to allow stakeholders to audit/inspect/verify the whole grant management process. This includes:
- Who submitted applications and when?
- What decisions were made and by whom?
- What changed and when?
- Can the complete lifecycle of a grant be reconstructed?

**Impact on Architecture:**
- Immutable audit logs for all state-changing operations.
- Event-driven design captures state changes in an ordered, reconstructable manner.
- All user actions attributed to identity with timestamps.
- Long-term retention (10 years) of audit data.
- Query interfaces for auditors to extract and analyze audit information.

---

## Summary Table

| Characteristic | Criticality | Impact |
|---|---|---|
| **Scalability** | High | Horizontal scaling, async processing, load balancing |
| **Availability** | High | Redundancy, resilience, monitoring, graceful degradation |
| **Security** | Critical | Encryption, MFA, RBAC, data residency, audit trails |
| **Auditability** | Critical | Immutable logs, event sourcing, user attribution, long-term retention |

These characteristics directly drive architectural decisions documented in the ADRs and the overall architecture style (Hybrid Service-Based with Event-Driven Architecture).
