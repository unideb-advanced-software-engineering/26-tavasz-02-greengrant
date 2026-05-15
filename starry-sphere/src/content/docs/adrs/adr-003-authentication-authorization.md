---
title: "ADR-003: Centralized Identity and Access Management with MFA and RBAC"
description: "Decision on authentication & authorization using OAuth2/JWT with MFA for privileged users"
---

# ADR-003: Centralized Identity and Access Management with MFA and RBAC

- **Status:** Active
- **Date:** 2026-05-15
- **Decision Makers:** Security/Architecture Team

## Context and Problem Statement

GreenGrant serves four distinct user types: Applicants, Public Administrators, System Administrators, and external services (MundaMail). Each has different risk profiles and privilege levels. The question is: How to implement authentication and authorization for **secure access**, **auditability**, **RBAC compliance**, and **resistance to account compromise**?

## Decision Drivers

- **Security Requirement:** Public and System Administrators must use MFA.
- **Auditability:** All auth events must be audit-logged.
- **Least Privilege:** Users have minimal necessary permissions.
- **Compliance:** Support government identity federation if required.
- **User Lifecycle:** Support account creation, role assignment, disabling, history.

## Considered Options

**Option A: Decentralized Per-Service Auth** – Each service manages its own identity.

**Option B: Centralized OAuth2/JWT** – Single Identity Service, token-based, local validation in services.

**Option C: Per-Request Auth Checks** – Call back to Identity Service on every request (higher latency).

**Option D: LDAP/Federation** – Integrate with government directory.

## Decision Outcome

**Chosen: Option B (Centralized OAuth2/JWT) with path to Option D (Federation)**

### Rationale

- **Practical Auditability:** Single source of truth for identity.
- **MFA Enforcement:** Enforced at token issuance.
- **Service Autonomy:** Services validate tokens locally; no per-request RPC.
- **Cost Efficient:** Lighter-weight than per-request checks.
- **Regulatory Flexibility:** Identity Service can bridge government LDAP later.

## Key Design Points

- **MFA:** Mandatory for Admins, optional for Applicants; enforced before JWT issuance.
- **Token Structure:** JWT with `mfa_verified` claim; services check this for sensitive operations.
- **RBAC:** Three roles: `applicant`, `public_administrator`, `system_administrator`.

## Consequences

### Positive
- Single source of truth.
- Immediate role changes across all services.
- MFA compliance.
- Scalable token-based approach.

### Negative
- Token revocation latency (until expiry).
- Secret management for signing keys.
- Clock synchronization required.

## References

- [Specifications: ASR](../specification/asr.md) (Security, F-MU-*)
- [Polyglot Persistence](./adr-002-data-storage.md)
