# ADR-006: Separate Applicant and Administration Web Frontends with an API Gateway

- Status: Active
- Date: 2026-05-15
- Decision Makers: Architecture Team

## Context and Problem Statement

GreenGrant has two major user-facing groups with very different workflows and risk profiles:

1. **Applicants** need a lightweight, mobile-friendly interface for browsing grants and submitting applications over unstable connections.
2. **Public Administrators and System Administrators** need a more complex interface for grant creation, review, auditing, and user management.

Both interfaces rely on the same backend domain services, but they should not expose the same UI or the same interaction patterns. We also need a controlled entry point that can enforce authentication, route requests, and centralize access to backend services.

The question is: should GreenGrant use one shared frontend, or separate role-specific frontends behind an API Gateway?

## Decision Drivers

- **Usability** – Applicant and administrative workflows have different UX needs.
- **Security** – Administrative actions require stronger access control and clearer separation.
- **Maintainability** – Different frontends can evolve independently without entangling all workflows.
- **Scalability** – Applicant traffic can spike independently of admin traffic.
- **Architecture Simplicity** – A gateway reduces direct coupling between browsers and internal services.
- **Low-Bandwidth Support** – Applicant UI must stay lightweight and optimized for poor connectivity.

## Considered Options

### Option A: Single Shared Frontend
One web application handles all roles and routes users through role-based screens.

**Pros:**
- Single codebase.
- Shared components and styling.
- Easier initial deployment.

**Cons:**
- Large and complex UI with mixed concerns.
- Harder to optimize for applicant vs. admin needs.
- Higher risk of exposing privileged functionality in the same surface.

### Option B: Separate Web Frontends with API Gateway
Applicant Web App and Administration Web App are separate deployments. Both call the backend through a central API Gateway.

**Pros:**
- Clear separation of user journeys.
- Applicant UI stays lean and mobile-friendly.
- Admin UI can focus on dense operational workflows.
- Gateway centralizes routing, authentication enforcement, and API exposure.

**Cons:**
- More frontends to maintain.
- Shared functionality may need duplication or shared libraries.
- Gateway becomes an additional operational component.

### Option C: Backend-for-Frontend (BFF) per UI Without Gateway
Each frontend talks directly to services, with a thin per-frontend backend layer.

**Pros:**
- UI-specific API shaping.
- Some separation of concerns.

**Cons:**
- More moving parts than necessary.
- Harder to enforce consistent security and cross-cutting controls.
- Reduces the clarity of the central entry point.

## Decision Outcome

**Chosen option: Option B, Separate Web Frontends with API Gateway.**

### Rationale

1. **Different UX requirements:** Applicants need a simple, fast interface, while administrators need richer operational screens. One shared frontend would compromise one of these user groups.

2. **Security and access control:** The gateway provides a single entry point where authentication, authorization, and request routing can be handled consistently.

3. **Independent evolution:** Applicant-facing changes can be optimized for usability and performance without affecting admin workflows, and vice versa.

4. **Scalability:** Grant opening periods can generate applicant traffic spikes that do not require the same scaling strategy as administrative traffic.

5. **Cost efficiency:** The applicant UI can stay lightweight, while the administrative UI can remain feature-rich only where needed.

## Consequences

### Positive
- Cleaner separation of concerns between public and internal workflows.
- Better performance optimization for the applicant experience.
- Easier to apply different security and accessibility requirements per frontend.
- API Gateway becomes the controlled edge of the system.

### Negative
- Two frontend applications must be maintained.
- Shared UI logic needs a deliberate packaging strategy.
- Gateway configuration must be kept aligned with backend service evolution.

### Mitigation
- Extract shared UI utilities into reusable packages where appropriate.
- Keep the API Gateway routing contract versioned.
- Use the same design system tokens and terminology across both frontends.

## Confirmation

The decision can be confirmed through:

- separate deployment pipelines for the two web apps,
- role-based routing tests through the API Gateway,
- usability validation on mobile devices for the applicant UI,
- security tests proving privileged admin actions are only reachable through authenticated roles,
- performance checks showing applicant traffic does not degrade admin workflows.

## References

- [SRS](../srs.md) – Multi-role UI requirements, performance and usability constraints
- [ASR](../asr.md) – Multi-role web platform, variable connectivity, security
- [Architecture Style](../as.md) – Service-based and event-driven architecture, deployment architecture
- [ADR-02](./adr-02-authentication-authorization.md) – Centralized Identity and Access Management
- [ADR-001](../architecture.md) – Hybrid architecture in the root project
