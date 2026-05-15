---
title: "ADR-004: Asynchronous Document Upload and Management Strategy"
description: "Decision on async document upload with polling/SSE to support poor network conditions"
---

# ADR-004: Asynchronous Document Upload and Management Strategy

- **Status:** Active
- **Date:** 2026-05-15
- **Decision Makers:** Architecture/Backend Team

## Context and Problem Statement

Applicants submit documents (PDFs, scans) that can be 10+ MB each over variable-quality networks. Synchronous upload blocks the UI and fails entirely if the network drops mid-transfer. Asynchronous upload must work for Zamunda's connectivity conditions.

## Decision Drivers

- **Applicant Experience:** Mobile users need responsive UI; blocking on file uploads is unacceptable.
- **Resilience:** Must handle network drops gracefully.
- **High-Volume Concurrency:** Thousands of concurrent uploads at grant opening.
- **Audit Trail:** All uploads must be auditable.
- **Data Integrity:** No partial or corrupted files.

## Considered Options

**Option A: Synchronous Upload** – Block until complete; simple but poor for poor networks.

**Option B: Async with No Feedback** – Queue without notifying client of outcome.

**Option C: Async with SSE/Polling** – Queue, return immediately, client polls for status.

**Option D: Chunked Upload with Resume** – Break into chunks, resume on failure (complex but most resilient).

## Decision Outcome

**Chosen: Option C (Async with SSE/Polling), with Option D (Chunked) as future enhancement**

### Rationale

- **Responsive UI:** File upload doesn't block form submission.
- **Network Resilience:** Polling detects failures; client can retry.
- **Scalable:** Queue decouples concurrent uploads from worker pool.
- **Auditable:** Each upload tracked with status and validation result.

## Key Design Points

- **Upload Endpoint:** Returns immediately with `upload_id` and polling URL.
- **Background Worker:** Validates documents (type, size, virus scan, content).
- **Client Polling:** Check status until `valid` or `invalid`.
- **Staging Area:** Temporary storage for in-progress uploads.

## Consequences

### Positive
- Unblocked UI.
- Scalable queueing.
- Auditable.
- Cost efficient (background workers scale independently).

### Negative
- Eventual consistency (delay before reviewer sees documents).
- Client complexity (must handle polling).
- Temporary storage overhead.

## References

- [Specifications: SRS](../specification/srs.md) (F-AG-*, NF-SA-01, NF-QA-02)
- [Architecture Style](./styles.md) (Event-Driven patterns)
- [Event-Driven Communication](./adr-005-event-driven-communication.md)
