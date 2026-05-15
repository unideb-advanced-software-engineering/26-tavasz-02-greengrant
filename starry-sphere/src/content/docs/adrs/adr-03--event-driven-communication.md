---
title: "ADR-005: Event-Driven Communication via Kafka Message Bus"
description: "Decision to use Kafka for asynchronous, event-driven communication between microservices"
---

# ADR-005: Event-Driven Communication via Kafka Message Bus

- **Status:** Active
- **Date:** 2026-05-15
- **Decision Makers:** Architecture Team

## Context and Problem Statement

GreenGrant's microservices must coordinate across complex workflows (application submission, evaluation, notification) that involve multiple asynchronous actions. Synchronous service-to-service calls create bottlenecks and tight coupling. How can we decouple services while maintaining auditability and resilience?

## Decision Drivers

- **Scalability:** Thousands of concurrent applications at grant opening.
- **Resilience:** If MundaMail is slow, application submission shouldn't fail.
- **Auditability:** All state changes must be reconstructable.
- **Extensibility:** New services (analytics, reporting) should subscribe to events without modifying existing code.
- **Cost Efficiency:** Independent scaling of services.

## Considered Options

**Option A: Synchronous REST Calls** – Direct service-to-service; simple but tightly coupled and brittle.

**Option B: Job Queue** – RabbitMQ/Redis; point-to-point only; harder to support multiple consumers.

**Option C: Event-Driven with Kafka** – Broadcast events to multiple subscribers; decoupled and resilient.

**Option D: Hybrid** – Sync for critical paths, async for non-critical.

## Decision Outcome

**Chosen: Option C (Event-Driven with Kafka) combined with Option D (Hybrid) for critical paths**

### Rationale

- **Natural Scalability:** Kafka queues handle load; workers scale independently.
- **Resilience:** Events persist; subscribers retry if temporarily down.
- **Auditability:** Event log is immutable audit trail.
- **Multi-Consumer Broadcasting:** Many services react to same event.

## Key Design Points

- **Topics:** `application.submitted`, `evaluation.decision_finalized`, `notification.sent`, etc.
- **Partitioning:** By `applicant_id` to ensure ordering per applicant.
- **Retention:** 10 years for critical events (application, decision); 90 days for operational.
- **Consumer Groups:** Separate groups for Notification Service, Audit Service, AI Service, etc.

## Event Examples

| Event | Producer | Subscribers | Retention |
|---|---|---|---|
| `application.submitted` | App Service | Audit, Notification, AI, Review | 10 years |
| `evaluation.decision_finalized` | Review Service | Audit, Notification, Grant Service | 10 years |
| `document.validated` | Doc Worker | App Service, Audit | 10 years |

## Consequences

### Positive
- Decoupling & resilience.
- Scalability; independent worker scaling.
- Auditability; immutable event log.
- Extensibility; new consumers added without modifying producers.

### Negative
- Eventual consistency (transient inconsistencies).
- Operational complexity (Kafka cluster to manage).
- Debugging async flows is harder.
- Storage cost for 10-year event retention.

### Mitigation
- Distributed tracing with correlation IDs.
- Strong consistency for critical data (Core DB write before event publish).
- Comprehensive monitoring of consumer lag and dead-letter queues.
- Event schema registry.

## References

- [Specifications: ASR](../specification/asr.md) (Scalability, Availability, Auditability)
- [Architecture Style](./styles.md)
- [Polyglot Persistence](./adr-002-data-storage.md)
