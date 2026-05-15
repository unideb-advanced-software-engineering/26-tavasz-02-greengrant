---
title: "ADR-006: Separate Applicant and Administration Web Frontends with an API Gateway"
description: "Decision on separating the two web frontends and routing them through a central API Gateway"
---

# ADR-006: Separate Applicant and Administration Web Frontends with an API Gateway

- **Status:** Active
- **Date:** 2026-05-15
- **Decision Makers:** Architecture Team

## Context and Problem Statement

GreenGrant has two major user-facing groups with different workflows and risk profiles. Applicants need a lightweight, mobile-friendly interface for browsing grants and submitting applications over unstable connections. Public Administrators and System Administrators need a denser interface for grant creation, review, auditing, and user management.

Both interfaces rely on the same backend domain services, but they should not expose the same UI or the same interaction patterns. We also need a controlled entry point that can enforce authentication, route requests, and centralize access to backend services.

## Decision Drivers

- Usability
- Security
- Maintainability
- Scalability
- Architecture simplicity
- Low-bandwidth support

## Considered Options

**Option A: Single Shared Frontend** – One web app handles all roles.

**Option B: Separate Web Frontends with API Gateway** – Applicant Web App and Administration Web App are separate deployments behind a central gateway.

**Option C: Backend-for-Frontend without Gateway** – Each frontend talks directly to services through a per-UI backend.

## Decision Outcome

**Chosen: Option B, Separate Web Frontends with API Gateway.**

### Rationale

- Different UX requirements call for different frontends.
- The gateway provides a single entry point for authentication, authorization, and routing.
- Applicant traffic can scale independently from admin traffic.
- The applicant UI can remain lighter and faster for poor connectivity.

## Consequences

### Positive
- Clear separation of concerns.
- Better mobile experience for applicants.
- Stronger control over public API exposure.
- Easier role-specific optimization.

### Negative
- Two frontend applications to maintain.
- Shared UI logic needs a deliberate packaging strategy.
- Gateway configuration must stay aligned with backend evolution.

## References

- [Specifications](../specification/srs.md), [ASR](../specification/asr.md)
- [Architecture Styles](../architecture/styles.md)
- [ADR-003](./adr-003-authentication-authorization.md)
- [ADR-001](./architecture.md)
