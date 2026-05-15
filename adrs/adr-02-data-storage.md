# ADR-002: Polyglot Persistence Strategy

- Status: Active
- Date: 2026-05-15
- Decision Makers: Architecture Team

## Context and Problem Statement

GreenGrant must store diverse data types with different access patterns and durability requirements:

1. **Transactional operational data** (users, grants, applications, evaluations) – requires ACID guarantees and strong consistency.
2. **Immutable audit trails** – must be append-only and tamper-evident for legal compliance and audit reconstruction.
3. **Large binary documents** (applicant PDFs, scans) – accessed by reference, not frequently queried relationally.

A single database cannot efficiently serve all three patterns without compromising design or performance. The question is: Should we use a single database with separate schemas, or adopt polyglot persistence with specialized stores for each pattern?

## Decision Drivers

- **Regulatory Compliance** – Audit logs must be immutable and cryptographically verifiable; this is a core legal requirement [NF-SE-04, NF-QA-03, Auditability in ac.md].
- **Storage Cost Efficiency** – Large files (application documents) should not bloat the transactional database; cloud object storage is cost-optimal. [ASR: Cost Efficiency]
- **Query Performance** – Auditors need to reconstruct application history efficiently; append-only stores are optimized for this pattern.
- **Data Localization** – All storage must remain within Zamunda; infrastructure selection must respect this constraint. [ASR: Data Localization]
- **Long-term Retention** – Applications and evaluations must be preserved for 10 years [NF-SA-03]; tiered archival strategies differ per store type.

## Considered Options

### Option A: Single PostgreSQL Database with Partitioned Schemas
- All data (operational, audit, documents) stored as blobs or large bytea columns in PostgreSQL.
- **Pros:** Single point of administration; single backup/recovery strategy.
- **Cons:** Bloats the database; audit compliance harder to enforce (standard SQL queries can mutate audit rows); object storage access patterns are inefficient; cost scales poorly for large files.

### Option B: Polyglot Persistence (PostgreSQL + Append-Only + MinIO)
- **Core DB (PostgreSQL):** Operational state (users, grants, applications, evaluations, decisions).
- **Audit Log Store (Append-only database or log-structured store):** Immutable history of all state-changing actions.
- **Document Store (S3-compatible or Cloud Object Storage):** Binary files uploaded by applicants, indexed by application ID and file hash.

**Pros:** Each store optimized for its access pattern; audit integrity guaranteed by store design; cost-effective for large files.
**Cons:** Operational complexity increases; eventual consistency between stores requires careful design; backup/recovery spans multiple systems.

### Option C: Event Sourcing + Single Event Store
- All state changes recorded as immutable events in a dedicated event store.
- Operational state reconstructed by replaying events into read models (CQRS pattern).
- **Pros:** Audit trail is implicit; full event history available for reconstruction.
- **Cons:** Complex implementation; requires skilled team; event upcasting for schema evolution adds overhead; may not be cost-efficient for large file storage.

## Decision Outcome

**Chosen option: Option B (Polyglot Persistence)**, because it directly aligns with operational and legal requirements while maintaining cost efficiency.

### Rationale

1. **Audit Compliance:** An append-only audit store provides database-level integrity guarantees that prevent accidental or malicious mutation of audit records. This is simpler and more reliable than application-level audit trails in a standard SQL database.

2. **Cost Efficiency:** Storing 10+ million document files in PostgreSQL as bytea or large objects would consume vast disk space and inflate backup sizes. Object storage services (within Zamunda) cost far less per GB and provide better durability and access patterns for large files.

3. **Separation of Concerns:** PostgreSQL excels at ACID transactions and relational queries; append-only stores excel at immutable history; object storage excels at large file management. Rather than forcing all three into one system, we let each tool do what it does best.

4. **Regulatory Alignment:** Public-sector environments often require audits that produce read-only extracts of system behavior. An append-only audit store naturally supports this requirement; documents are versioned and retrievable by audit queries without risk of retroactive modification.

## Detailed Design

### Core Database (PostgreSQL)

**Purpose:** Operational state, business logic, transactional boundaries.

**Stores:**
- `users` – User accounts, roles, status, credentials.
- `grants` – Grant definitions, budgets, dates, criteria, scoring models.
- `applications` – Application metadata (applicant ID, grant ID, status, submission date, decision).
- `evaluations` – Review scores, decision status, reviewer ID, timestamps.
- `document_metadata` – Links to document store objects (object ID, filename, size, content hash).

**Constraints:**
- Foreign keys maintain referential integrity.
- Timestamps on all tables for ordering and audit correlation.
- Soft deletes (status columns) rather than hard deletes to preserve history.

### Audit Log Store (Append-Only)

**Purpose:** Immutable record of all state changes for compliance and reconstruction.

**Design:**
- Single append-only table or collection.
- Columns: `event_id`, `timestamp`, `actor_id`, `action` (created/updated/deleted), `entity_type`, `entity_id`, `previous_state`, `new_state`, `correlation_id`.
- Each insert appends; no updates or deletes allowed (enforced by database access control or application design).

**Examples of Logged Events:**
- User created, user role assigned
- Grant published, grant closed
- Application submitted, application withdrawn
- Evaluation initiated, score assigned, decision finalized
- Document uploaded, document deleted

**Retention:** All logs retained for 10 years per regulations. Archival to cold storage after 1 year.

### Document Store (Object Storage)

**Purpose:** Secure, scalable storage of applicant-uploaded documents.

**Design:**
- S3-compatible or cloud-native object storage within Zamunda.
- Naming convention: `applications/{application_id}/{file_hash}_{original_filename}`.
- Each object tagged with metadata: `application_id`, `upload_date`, `uploader_id`.
- Content-addressable via SHA-256 hash to detect duplicates and bit rot.

**Lifecycle Policies:**
- Standard tier: Active application review period (while application is being evaluated).
- Archive tier: After decision and 1-year post-decision (cost optimization).
- Deletion: After 10-year retention period (per NF-SA-03).

**Access:**
- Document read requests route through the Core DB: `application_service` validates that the requester has authorization before serving the object.
- All access is logged for audit purposes.

## Consequences

### Positive
- **Audit Integrity:** Append-only store prevents tampering; auditors have strong confidence in historical records.
- **Cost Efficiency:** Object storage optimizes large file storage; old audit logs can be archived to cheaper tiers.
- **Scalability:** Each store can be sized independently; PostgreSQL doesn't swell with document blobs.
- **Regulatory Compliance:** Design naturally supports public-sector audit and retention requirements.

### Negative
- **Operational Complexity:** Three storage systems to backup, monitor, and maintain; requires skilled DevOps.
- **Consistency Challenges:** A failure during an application submission might leave data in Core DB but fail to write audit log. Compensating transactions and idempotency keys are required.
- **Latency:** Object storage lookups add network roundtrips compared to co-located file storage.

### Mitigation
- Implement distributed transactions with compensating workflows (e.g., write to Core DB, then to Audit, then to Document Store, with rollback logic).
- Use idempotency keys and duplicate detection to handle retries.
- Implement comprehensive logging and monitoring across all three stores.

## Confirmation

Implementation can be verified through:

1. **Schema Review** – Inspect Core DB schema for presence of expected tables and audit timestamp columns.
2. **Audit Log Integrity Test** – Attempt to update or delete a historical audit record; verify that the database rejects the operation.
3. **Document Storage Test** – Upload a document, verify it exists in object storage with correct metadata and access controls.
4. **Retention Validation** – Confirm that archival and deletion policies are in place and documented.
5. **Compliance Audit** – An independent auditor verifies that the audit log provides a complete reconstruction of state changes.

## References

- [ac.md](../ac.md) – Auditability, Security
- [asr.md](../asr.md) – Data localization, ASRs for F-AG-03, F-RE-04
- [as.md](../as.md) – Storage Architecture subsection
- [SRS](../srs.md) – NF-SA-03 (retention), NF-SE-03 (encryption), NF-SE-04 (audit logs)
