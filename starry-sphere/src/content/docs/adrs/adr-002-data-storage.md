---
title: "ADR-002: Polyglot Persistence Strategy"
description: "Decision on data storage architecture using PostgreSQL, append-only logs, and object storage"
---

# ADR-002: Polyglot Persistence Strategy

- **Status:** Active
- **Date:** 2026-05-15
- **Decision Makers:** Architecture Team

## Context and Problem Statement

GreenGrant must store diverse data types with different access patterns and durability requirements:

1. **Transactional operational data** (users, grants, applications, evaluations) – requires ACID guarantees and strong consistency.
2. **Immutable audit trails** – must be append-only and tamper-evident for legal compliance and audit reconstruction.
3. **Large binary documents** (applicant PDFs, scans) – accessed by reference, not frequently queried relationally.

A single database cannot efficiently serve all three patterns without compromising design or performance.

## Decision Drivers

- **Regulatory Compliance** – Audit logs must be immutable and cryptographically verifiable; this is a core legal requirement.
- **Storage Cost Efficiency** – Large files should not bloat the transactional database; cloud object storage is cost-optimal.
- **Query Performance** – Auditors need to reconstruct application history efficiently.
- **Data Localization** – All storage must remain within Zamunda.
- **Long-term Retention** – Applications and evaluations must be preserved for 10 years.

## Considered Options

**Option A: Single PostgreSQL Database** – All data in one database; bloats database and audit compliance is harder to enforce.

**Option B: Polyglot Persistence** – Core DB (PostgreSQL) + Append-Only Store + Object Storage for documents.

**Option C: Event Sourcing** – Complex implementation; may not be cost-efficient for large files.

## Decision Outcome

**Chosen: Option B (Polyglot Persistence)**

### Rationale

- **Audit Compliance:** Append-only store provides database-level integrity guarantees.
- **Cost Efficiency:** Object storage costs far less per GB than PostgreSQL bytea columns.
- **Separation of Concerns:** Each tool optimized for its access pattern.

## Consequences

### Positive
- Audit integrity guaranteed by store design.
- Cost-effective for large files.
- Scalable and maintainable.

### Negative
- Operational complexity increases (three systems to manage).
- Eventual consistency between stores requires careful design.

## References

- [Specifications: SRS](../specification/srs.md), [AC](../specification/ac.md), [ASR](../specification/asr.md)
- [Architecture Style](./styles.md)
