# Architecturally Significant Requirements

## ZDR general requirements

### Cost efficiency

Zamunda is not a poor country, but unnecessary spending must still be avoided. The architecture should prefer cost-efficient, operationally simple solutions while remaining compliant with public-sector requirements.

### Data localization

All data processed by the system must be stored and operated within Zamunda.

**Why ASR?**
- Strongly constrains infrastructure and deployment topology.
- Affects disaster recovery, backup strategy, and third-party integration choices.

### Variable connectivity conditions

Some areas have unstable internet quality, and even in covered areas, higher latency and lower bandwidth are expected.

**Why ASR?**
- Impacts API contract design, payload sizes, retry behavior, and timeout strategy.
- Requires architecture decisions for graceful degradation and asynchronous processing.

## Quality attributes

The quality attributes identified in [ac.md](./ac.md) that are architecturally significant are:
- Scalability
- Availability
- Security
- Auditability

### Scalability

Grant openings can create burst traffic from many applicants trying to submit early before the budget is exhausted.

**Why ASR?**
- Requires explicit choices for load distribution, queueing, and horizontal scaling.
- Influences data model and transaction boundaries under high concurrency.

### Availability

The platform must be reliably accessible during critical windows (especially at opening times and around deadlines).

**Why ASR?**
- Requires redundancy for critical components and resilience patterns.
- Affects operational architecture, monitoring, and incident response design.

### Security

The system handles personal data, business data, and government decisions with legal and financial impact.

**Why ASR?**
- Security needs shape identity, authorization, encryption, and secret-management architecture.
- Strongly constrains integration design and data flows.

### Auditability

Grant processing must be transparent and reconstructable for legal and public accountability reasons.

**Why ASR?**
- Requires immutable audit trails and event history for critical actions.
- Affects storage design, retention strategy, and reporting interfaces.

## Significant functional requirements

### F-AG-03 (Securely store validated application data)

**Why ASR?**
- Drives architecture for document storage, metadata indexing, and confidentiality controls.
- Requires clear boundaries between transactional metadata and large binary documents.

### F-RE-04 (Persist evaluation changes with full traceability)

**Why ASR?**
- Enforces design of append-only or tamper-evident audit mechanisms.
- Influences domain model, database schema, and retention policy.

### F-MM-02 (Send notification through MundaMail)

**Why ASR?**
- Introduces a critical external integration boundary.
- Requires delivery guarantees, retries, and idempotency strategy to avoid duplicate or missing notifications.

### F-AI-03 (No autonomous AI decision finalization)

**Why ASR?**
- Requires human-in-the-loop workflow architecture.
- Constrains AI component boundaries and responsibility separation from decision logic.

## Additional architectural constraints

### Public sector traceability

All important state changes in grants and applications must be attributable to a user, role, and timestamp.

**Why ASR?**
- This is a cross-cutting architectural concern impacting every major backend module.

### Multi-role web platform

The same product family serves applicants, public administrators, and system administrators, each with different capabilities.

**Why ASR?**
- Requires consistent role-based architecture at API and UI levels.
- Affects service/module boundaries, authorization strategy, and test architecture.