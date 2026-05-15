# ADR-004: Event-Driven Communication via Kafka Message Bus

- Status: Active
- Date: 2026-05-15
- Decision Makers: Architecture Team

## Context and Problem Statement

GreenGrant's microservices must coordinate across several critical workflows:

1. **Application Submission** – When an applicant submits an application, multiple actions must occur:
   - Application metadata stored in Core DB.
   - Documents validated.
   - Audit log entry created.
   - Eligibility rules checked.
   - Applicant notified via MundaMail.

2. **Evaluation and Decision** – When a reviewer finalizes an application decision:
   - Decision stored.
   - Audit trail recorded.
   - Budget updated.
   - Applicant notified of outcome.

3. **AI Assistance** – When a reviewer requests AI analysis:
   - Request queued.
   - AI service processes (potentially long-running).
   - Results delivered asynchronously to reviewer.

If communication is synchronous (service A calls service B, which calls service C, etc.), the entire workflow blocks on the slowest service. For a non-critical failure (e.g., email delivery is slow), the entire submission fails.

**Question:** How should services coordinate to decouple concerns, improve resilience, and scale independently?

## Decision Drivers

- **Scalability [ASR: Scalability]** – At grant opening, thousands of apps submit simultaneously; synchronous chains create bottlenecks.
- **Resilience [Availability in ac.md]** – If MundaMail is temporarily down, application submission should not fail; notification can be retried later.
- **Auditability [Auditability in ac.md]** – All state changes must be reconstructable; events create an immutable audit trail.
- **Extensibility** – New services can be added (e.g., reporting, analytics) by subscribing to events without changing existing services.
- **Cost Efficiency [ASR: Cost Efficiency]** – Event-driven allows right-sizing each service independently; less resource waste in tight coupling.
- **Low-Bandwidth Resilience [ASR: Variable Connectivity]** – Events can be persisted locally and synced later if connectivity drops.

## Considered Options

### Option A: Synchronous Service-to-Service Calls (REST/gRPC)
- Each service calls dependent services' APIs directly.
- Workflow: Application Service → Core DB → Audit Service → Notification Service (blocking chain).
- **Pros:** Simple; immediate consistency.
- **Cons:** Tightly coupled; cascading failures; poor scalability under load; not resilient if downstream service is slow.

### Option B: Asynchronous Job Queue (RabbitMQ, Redis Queue)
- Services post jobs to a queue; workers consume asynchronously.
- Each worker executes jobs in sequence.
- **Pros:** Decoupling; resilience; easier to implement than event sourcing.
- **Cons:** Point-to-point only; scaling workers requires queue depth monitoring; not a full event-driven architecture; harder to support multiple consumers of same event.

### Option C: Event-Driven with Kafka
- Services publish domain events to a Kafka topic (e.g., `ApplicationSubmitted`).
- Multiple specialized services subscribe to topics for their concerns.
- Example: Application Service publishes `ApplicationSubmitted` event; Audit Service, Notification Service, AI Service all subscribe.
- **Pros:** Decoupling at scale; multiple independent consumers; natural audit trail; resilient to subscriber failures; supports broadcasting to many services.
- **Cons:** Operational complexity; eventual consistency requires careful design; event schema versioning challenges.

### Option D: Hybrid – Synchronous + Asynchronous
- Critical paths use sync (e.g., application form validation happens immediately).
- Non-critical paths use async (e.g., email notification).
- **Pros:** Best of both worlds for responsiveness and decoupling.
- **Cons:** Complex to reason about; testing more involved.

## Decision Outcome

**Chosen option: Option C (Event-Driven with Kafka)**, combined with Option D (hybrid approach) for the most critical synchronous paths (core DB writes).

### Rationale

1. **Natural Scalability:** When grant opening happens and 100,000 applications come in within an hour, Kafka automatically queues the load. Multiple notification workers can process events in parallel without the Application Service being aware. This is built into Kafka's design.

2. **Resilience:** If MundaMail is temporarily unavailable, the Notification Worker requeues the event and retries. The applicant's submission doesn't fail; they see success immediately, and the notification is delivered once service recovers.

3. **Auditability:** Every event is logged to Kafka with a timestamp. The complete history of an application is reconstructable by replaying events. This directly supports [Auditability in ac.md] and [NF-QA-03].

4. **Multi-Consumer Broadcasting:** Multiple services can react to the same event. When `ApplicationSubmitted` fires, the Audit Service logs it, the Notification Service sends an email, and the AI Service initializes analysis. They're independent; adding a new consumer doesn't affect existing services.

5. **Cost Efficiency:** The Application Service doesn't wait for notifications or AI processing. It completes quickly and hands off to async workers, freeing resources for the next request. This is more cost-efficient than long-blocking synchronous chains.

6. **Future Extensibility:** New services (e.g., data warehouse, analytics) can be added simply by subscribing to existing event topics without modifying existing code.

## Detailed Design

### Event Topics

**Core Domain Events:**

| Topic | Producer | Subscribers | Retention |
|-------|----------|-------------|-----------|
| `grant.opened` | Grant Service | Notification Worker, Analytics | 90 days |
| `grant.closed` | Grant Service | Notification Worker, Analytics | 90 days |
| `application.submitted` | Application Service | Audit Service, Notification Worker, AI Service, Review Service | 10 years |
| `application.withdrawn` | Application Service | Audit Service, Notification Worker, Review Service | 10 years |
| `evaluation.started` | Review Service | Audit Service, AI Service | 10 years |
| `evaluation.decision_finalized` | Review Service | Audit Service, Notification Worker, Grant Service (budget update) | 10 years |
| `document.validated` | Document Processing Worker | Application Service, Audit Service | 10 years |
| `audit.log_entry_created` | Any Service | Audit Log Store (not Kafka, persisted directly) | 10 years (archive) |
| `notification.sent` | Notification Worker | Audit Service, Analytics | 1 year |
| `ai.analysis_complete` | AI Service | Review Service, Audit Service | 90 days |


### Consumer Groups

**Notification Worker:**
- Consumer group: `notification-workers`
- Commits offset after successful MundaMail delivery (with retry).


**Audit Service:**
- Consumer group: `audit-service`
- Writes events to append-only audit log store (PostgreSQL or dedicated audit DB).

**AI Service:**
- Consumer group: `ai-service`
- Initiates document analysis on subscription.

**Review Service:**
- Consumer group: `review-service`
- Makes AI results available to reviewers.

### Error Handling & Dead-Letter Topics

**Failed Processing:**
- If Notification Worker fails to send to MundaMail 3 times, event is sent to dead-letter topic `notification.failed`.
- Dead-letter events are periodically reviewed and manually retried or marked as dropped.
- All drops are logged to audit store.

**Schema Evolution:**
- Events include a `version` field.
- Consumers check version and apply transformation logic if needed (e.g., old events lack a field; consumer provides default).
- New fields are optional; old fields are never removed (appended instead).

### Monitoring & Observability

**Metrics Collected:**
- Consumer lag (how far behind is each consumer group).
- Event throughput (events/sec per topic).
- Processing latency (time from event publication to consumption).
- Dead-letter queue depth.

**Alerts:**
- Consumer lag exceeds threshold (e.g., > 10,000 events) → scale up consumer instances.
- Dead-letter queue growing → investigate failures.
- Event processing latency spikes → investigate downstream service.

## Consequences

### Positive
- **Decoupling & Resilience** – Services are loosely coupled; failure in Notification Worker doesn't affect application submission.
- **Scalability** – At high load, Kafka queues are natural; workers scale independently.
- **Auditability** – Events are immutable and ordered; full audit trail is reconstructable.
- **Extensibility** – New consumers can be added without modifying producers.
- **Performance** – Application Service doesn't wait on slow downstream services; returns quickly to applicant.

### Negative
- **Eventual Consistency** – Transient inconsistencies between services; requires careful design.
- **Operational Complexity** – Kafka cluster to manage; consumer groups to monitor; schema versioning to maintain.
- **Debugging Challenges** – Asynchronous flows are harder to trace than synchronous ones; requires good logging and correlation IDs.
- **Storage Cost** – Kafka requires persistent storage within Zamunda for 10 years of critical events.

### Mitigation
- Implement distributed tracing (e.g., OpenTelemetry) with correlation IDs to trace a single application through all services.
- Use strong consistency for critical data (Core DB write happens before event publish).
- Implement comprehensive monitoring of consumer lag and dead-letter queues.
- Document event schemas in a schema registry (e.g., Confluent Schema Registry or custom).

## Confirmation

Implementation can be verified through:

1. **Event Persistence Test** – Publish an event, kill the Notification Worker, restart it, verify it consumes the event (no loss).
2. **Multi-Consumer Test** – Publish an event with 3 subscriber services; verify all 3 consume it.
3. **Ordering Test** – Send 100 sequential events for one applicant; verify they're consumed in order by Audit Service.
4. **Lag Monitoring Test** – Monitor consumer lag as bursts of events arrive at grant opening; verify lag is tracked and reported.
5. **Dead-Letter Handling Test** – Force notification delivery to fail; verify event lands in dead-letter topic and can be manually retried.
6. **Correlation ID Trace** – Follow a single application through all services using correlation IDs in logs; verify end-to-end traceability.

## References

- [ac.md](../ac.md) – Scalability, Availability, Auditability
- [asr.md](../asr.md) – Scalability, Availability
- [as.md](../as.md) – Event-Driven Architecture, Secondary Style
- [ADR-001](./architecture.md) – Hybrid Service-Based with Event-Driven Architecture
- [SRS](../srs.md) – NF-QA-02 (concurrent load), NF-QA-03 (auditability)
