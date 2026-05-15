# Architecture Styles

## Overview

GreenGrant adopts a **Hybrid Service-Based with Event-Driven Architecture**, combining the benefits of service decomposition with asynchronous event-driven communication patterns. This architecture is documented in detail in [Architecture](./architecture.md).

## Primary Style: Service-Based Architecture

### Description

The system decomposes into independent, synchronous services that manage distinct business domains:

- **Identity & Access Service** – Manages authentication (MFA), authorization (RBAC), and user lifecycle.
- **Grant Management Service** – Handles grant creation, publication, lifecycle, and budget tracking.
- **Application Service** – Processes grant applications, validation, document intake, and submission workflows.
- **Review Service** – Manages evaluation workflows, scoring, decision recording, and audit trails.
- **AI Assistant Service** – Provides AI-powered document summarization and inconsistency detection.
- **Notification Worker** – Consumes events and dispatches notifications via MundaMail API.

Each service:
- Owns its data schema and storage.
- Exposes REST APIs for synchronous operations.
- Publishes domain events for asynchronous workflows.
- Implements its own audit logging for local accountability.

### Why Service-Based?

- **Independent Deployability** – Services can be released independently, reducing blast radius of changes.
- **Team Autonomy** – Different teams can own different services without tight coordination.
- **Technology Flexibility** – Each service may choose its own technology stack if needed.
- **Clear Domain Boundaries** – Follows domain-driven design principles for maintainability.

### Constraints

- Network latency between services may impact response times.
- Distributed transactions require compensating workflows or eventual consistency patterns.
- Operational complexity increases; monitoring and debugging span multiple deployable units.

## Secondary Style: Event-Driven Architecture

### Description

Services communicate asynchronously through domain events published to an event bus (Kafka). This pattern is used for:

1. **Application Submission Workflow** – When an application is submitted, an event triggers document storage, audit logging, eligibility checks, and applicant notification.
2. **Evaluation Workflow** – When a review decision is finalized, events notify the applicant and update grant budget state.
3. **AI Assistant Requests** – AI processing is decoupled from the review UI, supporting long-running operations with eventual result delivery.
4. **Notifications** – All state changes that warrant user notification are published as events, consumed by the notification worker.

### Why Event-Driven for These Workflows?

- **Decoupling** – Application submission doesn't wait for AI processing, email delivery, or audit writing.
- **Scalability** – High-traffic periods (grant opening) can be handled by scaling out event consumers independently.
- **Resilience** – If the notification service is temporarily down, events persist in the queue and are reprocessed later.
- **Auditability** – Event sourcing principles support reconstructing the complete history of each application.

### Key Event Types

- `GrantOpened`, `GrantClosed`
- `ApplicationSubmitted`, `ApplicationWithdrawn`
- `EvaluationStarted`, `EvaluationDecisionFinalized`
- `ApplicantNotified`
- `AuditLogEntry`

### Constraints

- Event schema evolution must be handled carefully to ensure backward compatibility.
- Eventual consistency means temporary inconsistencies; business logic must account for this.
- Debugging asynchronous flows is more complex than synchronous request-response.

## Storage Architecture

The system uses a **polyglot persistence** approach:

- **Core Database** – Transactional storage for grants, applications, user accounts, business rules.
- **Audit Log Store** – Immutable history of all state-modifying actions for legal compliance.
- **Document Store** – Large files (PDFs, images) uploaded by applicants; supports efficient access and archival.

### Why Polyglot?

- A relational database provides ACID guarantees for operational data and transactional integrity.
- Append-only storage prevents tampering and supports legal audit trails.
- Object storage optimizes cost and access patterns for large binary assets.

## Deployment Architecture

**Containerized deployment** on a cloud-native platform (Kubernetes or similar) within Zamunda's infrastructure:

- Each microservice runs in its own container, potentially multiple replicas for availability.
- Services communicate over HTTPS for all inter-service calls.
- Event bus (Kafka) runs with replication for durability and fault tolerance.
- Data stores (relational database, object storage) are managed with backup, replication, and disaster recovery policies.

All infrastructure and data remain within Zamunda's territory per legal requirements.

## Integration Points

- **MundaMail API** – External integration for email notifications handled by the Notification Worker service.
- **External AI Services** (optional future) – If AI models are not hosted internally, the AI Assistant Service would integrate with external APIs over HTTPS with contract-based protections.

## Quality Attributes Supported by This Architecture

| Attribute | How It's Supported |
|-----------|-------------------|
| **Scalability** | Event-driven async processing + horizontal service scaling + database replication. |
| **Availability** | Service redundancy + circuit breakers + resilient event consumption patterns + graceful degradation. |
| **Security** | Centralized Identity & Access Service + encryption in transit (HTTPS) + encryption at rest + audit logging. |
| **Auditability** | Immutable audit log + domain events capture state changes + service-level logging + user attribution. |
| **Cost Efficiency** | Lean microservices architecture + cloud-native deployment allows right-sizing resources per service demand. |
| **Usability** | Independent web UI services can be optimized for applicant vs. administrator workflows without affecting each other. |

## Tradeoffs

| Pros | Cons |
|------|------|
| Independent service deployability and scalability | Increased operational complexity |
| Asynchronous patterns support high traffic loads | Eventual consistency requires careful design |
| Clear domain separation improves maintainability | Network latency between services |
| Event-driven workflows are auditable and reconstructable | Distributed transaction challenges |
| Team autonomy and parallel development | Requires advanced monitoring and observability |

## Conclusion

The Hybrid Service-Based with Event-Driven architecture enables GreenGrant to handle the Zamunda government's scaling and reliability needs while maintaining strong security and auditability. The combination provides the right balance of operational simplicity and technical sophistication for a public-sector grant portal.