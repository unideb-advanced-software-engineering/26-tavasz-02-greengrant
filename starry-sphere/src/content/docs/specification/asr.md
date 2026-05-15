---
title: "Architecturally Significant Requirements"
description: "Requirements that significantly influence the architecture of GreenGrant"
---

# Architecturally Significant Requirements

Architecturally Significant Requirements (ASRs) are requirements that have a profound impact on the architecture and design of the system. Each ASR below includes justification for why it is considered architecturally significant.

---

## ZDR General Requirements

### Cost Efficiency

Zamunda is not a poor country, but unnecessary spending must still be avoided. The architecture should prefer cost-efficient, operationally simple solutions while remaining compliant with public-sector requirements.

**Why ASR?**
- Constrains technology choices toward cloud-native, horizontally scalable solutions.
- Requires careful resource allocation and right-sizing of infrastructure.
- Influences choice of open-source vs. commercial tools.

---

### Data Localization

All data processed by the system must be stored and operated within Zamunda.

**Why ASR?**
- Strongly constrains infrastructure and deployment topology.
- Rules out most public cloud options (AWS US, Azure Global); requires on-premise or Zamunda-specific cloud.
- Affects disaster recovery, backup strategy, and third-party integration choices.
- Every architectural decision around data storage must verify Zamunda residency.

---

### Variable Connectivity Conditions

Some areas have unstable internet quality, and even in covered areas, higher latency and lower bandwidth are expected.

**Why ASR?**
- Impacts API contract design: payload sizes must be minimized.
- Requires retry behavior, timeout strategy, and circuit breaker patterns.
- Drives decision for asynchronous processing (don't block on slow networks).
- Client applications must support offline-first or degraded-mode operation.

---

## Quality Attributes (from ac.md) 

The following quality attributes are architecturally significant:

### Scalability

Grant openings can create burst traffic from many applicants trying to submit early before the budget is exhausted.

**Why ASR?**
- Requires explicit choices for load distribution, queueing, and horizontal scaling.
- Influences data model and transaction boundaries under high concurrency.
- Event-driven patterns are chosen specifically to support scalability.
- Database partitioning strategy must be planned for millions of concurrent operations.

---

### Availability

The platform must be reliably accessible during critical windows (especially at opening times and around deadlines).

**Why ASR?**
- Requires redundancy for critical components and resilience patterns.
- Affects operational architecture: multi-region failover, health checks, automated recovery.
- Monitoring and incident response infrastructure is non-negotiable.
- SLA commitments (99.9% availability) drive architectural choices.

---

### Security

The system handles personal data, business data, and government decisions with legal and financial impact.

**Why ASR?**
- Security needs shape identity (MFA), authorization (RBAC), encryption architecture.
- Data residency requirement constrains where systems and backups can be stored.
- Strongly constrains integration design and data flows (e.g., how to interface with MundaMail securely).

---

### Auditability

Grant processing must be transparent and reconstructable for legal and public accountability reasons.

**Why ASR?**
- Requires immutable audit trails and event history for critical actions.
- Affects storage design, retention strategy, and reporting interfaces.
- Event-driven architecture is chosen partly to support auditability.

---

## Significant Functional Requirements

### F-AG-03: Securely Store Validated Application Data

The system is able to securely store all provided and validated input and user data.

**Why ASR?**
- Drives architecture for document storage, metadata indexing, and confidentiality controls.
- Requires clear boundaries between transactional metadata (PostgreSQL) and large binary documents (Object Storage).
- Encryption and access control policies are foundational.

---

### F-RE-04: Persist Evaluation Changes with Full Traceability

The system shall persist each evaluation change with timestamp, actor identity, and previous/new state values.

**Why ASR?**
- Enforces design of append-only or tamper-evident audit mechanisms.
- Influences domain model: evaluation records must support version history.
- Database schema must support immutable audit trails.

---

### F-MM-02: Send Notification through MundaMail

The system is able to send a templated message through M.M. triggered by a detected change, with the correct values.

**Why ASR?**
- Introduces a critical external integration boundary.
- Requires delivery guarantees, retries, and idempotency strategy to avoid duplicate or missing notifications.
- Event-driven patterns are chosen to decouple notification processing from application submission.

---

### F-AI-03: No Autonomous AI Decision Finalization

The system shall not allow AI output to finalize a decision without explicit human reviewer confirmation.

**Why ASR?**
- Requires human-in-the-loop workflow architecture.
- Constrains AI component boundaries and responsibility separation from decision logic.
- UI/UX design must make this requirement explicit (cannot skip human review).

---

## Additional Architectural Constraints

### Public Sector Traceability

All important state changes in grants and applications must be attributable to a user, role, and timestamp.

**Why ASR?**
- This is a cross-cutting architectural concern impacting every major backend module.
- Identity and Access Service must be central to all state-changing operations.
- Audit logging must be pervasive, not optional.

---

### Multi-Role Web Platform

The system must support three distinct user roles (Applicant, Public Administrator, System Administrator) with different UI views, permissions, and workflows.

**Why ASR?**
- Requires flexible UI architecture (separate SPA for applicants, separate for admins).
- API Gateway must route to role-specific microservices or gating logic.
- Authorization rules are complex and must be enforced consistently.

---

## Summary

| ASR | Category | Impact |
|---|---|---|
| Data Localization | Infrastructure | Constrains cloud provider, backup location, disaster recovery |
| Variable Connectivity | Network | Drives async processing, retry logic, minimal payloads |
| Scalability | Performance | Requires horizontal scaling, load balancing, event-driven patterns |
| Availability | Reliability | Requires redundancy, resilience, monitoring |
| Security | Quality | Requires encryption, MFA, RBAC, data residency enforcement |
| Auditability | Compliance | Requires immutable logs, event trails, 10-year retention |
| F-AG-03 (Data Storage) | Functional | Polyglot persistence: PostgreSQL + Append-Only + Object Storage |
| F-RE-04 (Evaluation Audit) | Functional | Immutable evaluation records and audit trails |
| F-MM-02 (Email Integration) | Functional | Event-driven notification system with retries |
| F-AI-03 (Human Review) | Functional | Human-in-the-loop AI workflow |
| Traceability | Cross-Cutting | Central identity system, audit logging everywhere |
| Multi-Role Architecture | Cross-Cutting | Separate UIs, flexible authorization, role-based routing |

All architectural decisions (ADRs) are justified by at least one ASR and quality attribute from Architectural Characteristics.
