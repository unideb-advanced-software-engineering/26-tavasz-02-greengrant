---
title: "Software Requirements Specification"
description: "SRS for GreenGrant - detailed requirements, user interfaces, and system features"
---

# Software Requirements Specification for GreenGrant

### Version 1.0 approved

#### Prepared by:
- Bóna Noel
- Angi Dávid
- Czumbil Márk

---

## Table of Contents

1. [Introduction](#introduction)
2. [Overall Description](#overall-description)
3. [External Interface Requirements](#external-interface-requirements)
4. [System Features](#system-features)
5. [Other Nonfunctional Requirements](#other-nonfunctional-requirements)

---

## Introduction

### Purpose

In this SRS, we describe the requirements for the first version of a platform called GreenGrant, which is used to create, list and review grants and apply to them. The SRS contains the requirements for the entire system.

### Document Conventions

—

### Intended Audience and Reading Suggestions

This SRS may be interesting and useful for any employee involved in the project, regardless of their technical knowledge.

### Product Scope

In addition to digital transformation, the ZDR program also supports the country's sustainability goals. A key component of this is an online support portal through which individuals and businesses can apply for government subsidies for green investments.

### References

The case study on which the system is based can be found at: [02: GreenGrant](https://unideb-advanced-software-engineering.github.io/site/hu/scenarios/02-greengrant/)

---

## Overall Description

### Product Perspective

GreenGrant is a new greenfield project with no history whatsoever.

### Product Functions

#### Applicant facing (Web Site)
- Listing/Searching currently available grants
- Applying to currently available grants
- Notification by MundaMail

#### Public Administration facing (Web Site)
- Creating new grants
- Review and evaluate grant applications
- AI (GF) helper tool

#### System Administrator facing (Web Site)
- Manage users
- Manage other UIs

### User Classes and Characteristics

- All citizens of Zamunda (approximately 10 million people)
- Businesses operating in Zamunda (approximately 1 million businesses)
- Administrators in the Zamunda public administration
- System administrators

### Operating Environment

- Data processed by the system must be stored within Zamunda's territory, and the system must be operated within Zamunda's territory.

### Design and Implementation Constraints

- Uses MundaMail API for notifications.
- The whole system must be operated within Zamunda's territory.

### User Documentation

—

### Assumptions and Dependencies

- Applicants must be notified of the outcome of the evaluation through MundaMail API

---

## External Interface Requirements

### User Interfaces

The system provides the following user interfaces:
- Web interface
  - Compatible with mobile and desktop usage
  - Contains different views for each different role
  - Integrated AI tool

### Hardware Interfaces

—

### Software Interfaces

The supported operating system, data storage solutions, technologies, libraries and frameworks are currently unspecified.

Other software interfaces:
- The notifications system implements and is dependent on MundaMail™ API.

### Communications Interfaces

- For the web interface: HTTPS
- SFTP for document uploads
- Notifications email through MundaMail

---

## System Features

### 4.1 Listing/Searching currently available grants

#### Description and Priority

**High Priority**

Provides a search and filter function to easily navigate among published grants.

#### Stimulus/Response Sequences

As a response to the "Search" button pressed by the user, the system shows the list of published grants, based on the search and filter options provided by the user.

#### Functional Requirements

**F-LG-01**: The system search implements a fuzzy finder on grants names and description.

**F-LG-02**: The system provides a filtration option, based on:
- start date
- end date
- end of evaluation date
- category
- target audience
- amount of money

### 4.2 Applying to currently available grants

#### Description and Priority

**High Priority**

Provides the option to apply to a selected grant.

#### Stimulus/Response Sequences

The user provides the required documentation and information for the application, and the system validates and in case of validity records the application, by storing all info and docs.

#### Functional Requirements

**F-AG-01**: The system is able to accept text and file input through a form.

**F-AG-02**: The system is able validate all forms of input, based on size, content, metadata and others.

**F-AG-03**: The system is able to securely store all provided and validated input and user data.

### 4.3 Notification by MundaMail

#### Description and Priority

**Medium Priority**

Provides a notification feature, about the status of applications through the use of MundaMail.

#### Stimulus/Response Sequences

Any change in the status of a given application will trigger an automatic notification via the MundaMail system.

#### Functional Requirements

**F-MM-01**: The system is able to detect changes in application status automatically.

**F-MM-02**: The system is able to send a templated message through M.M. triggered by a detected change, with the correct values.

### 4.4 Creating new grants

#### Description and Priority

**High Priority**

Provides the ability to publicate grants in the system.

#### Stimulus/Response Sequences

A User with the role of Public Administrator provides the required information for the creation of a new grant, and the system creates and stores the new grant publication.

#### Functional Requirements

**F-CG-01**: The system is able to accept the format of the information.

**F-CG-02**: The system is able to validate the format of the given inputs.

**F-CG-03**: The system is able to create a new grant based on the provided information.

**F-CG-04**: The system is able to upload and store the created grant publication.

### 4.5 Review and evaluate grant applications

#### Description and Priority

**High Priority**

Provides the ability for Public Administrators to review submitted applications, score them based on grant-specific criteria, and record a final decision.

#### Stimulus/Response Sequences

A Public Administrator opens an application, verifies attached documentation, optionally uses the AI helper outputs, assigns scores per criterion, and submits a decision. The system stores the evaluation, records an audit trail entry, and triggers applicant notification.

#### Functional Requirements

**F-RE-01**: The system shall display complete application data and all uploaded documents for authorized reviewers.

**F-RE-02**: The system shall support grant-specific scoring models defined during grant creation.

**F-RE-03**: The system shall require a decision status (approved/rejected/needs clarification) and an optional textual justification before finalization.

**F-RE-04**: The system shall persist each evaluation change with timestamp, actor identity, and previous/new state values.

**F-RE-05**: The system shall prevent final approval when mandatory documents are missing according to the selected grant definition.

### 4.6 AI (GF) helper tool

#### Description and Priority

**Medium Priority**

Provides AI-assisted analysis to reduce manual document review effort for Public Administrators.

#### Stimulus/Response Sequences

A reviewer requests AI assistance for an application. The system processes submitted documentation and returns a structured summary with detected issues and references to source sections.

#### Functional Requirements

**F-AI-01**: The system shall generate an application summary containing key applicant attributes, requested amount, and mandatory document checklist status.

**F-AI-02**: The system shall flag potential inconsistencies or missing information and mark them as recommendations only.

**F-AI-03**: The system shall not allow AI output to finalize a decision without explicit human reviewer confirmation.

**F-AI-04**: The system shall present traceable references from each AI finding to the original source document section when available.

**F-AI-05**: The system shall log every AI assistance request for audit purposes.

### 4.7 Manage users

#### Description and Priority

**High Priority**

Provides user and role lifecycle management for System Administrators.

#### Stimulus/Response Sequences

A System Administrator creates, updates, disables, or re-enables a user account and assigns roles. The system validates authorization, applies changes, and records an audit entry.

#### Functional Requirements

**F-MU-01**: The system shall support creating and disabling accounts for applicant, public administrator, and system administrator roles.

**F-MU-02**: The system shall enforce role-based access control for all protected operations.

**F-MU-03**: The system shall provide secure password reset and account recovery workflow.

**F-MU-04**: The system shall record all role and status changes in an immutable audit log.

### 4.8 Manage other UIs

#### Description and Priority

**Medium Priority**

Provides centralized configuration management for applicant-facing and administration-facing web interfaces.

#### Stimulus/Response Sequences

A System Administrator updates UI-related configuration (for example banners, form labels, announcement content, and feature visibility). The system validates the change, applies it, and distributes it to the target UI.

#### Functional Requirements

**F-MO-01**: The system shall allow authorized administrators to manage localized static content used by multiple user interfaces.

**F-MO-02**: The system shall support enabling or disabling selected UI features without redeploying the whole platform.

**F-MO-03**: The system shall keep versioned history of UI configuration changes with rollback capability.

---

## Other Nonfunctional Requirements

### Performance Requirements

**NF-AG-01**: The processing time of applications must be p99 500ms from submission to storage of crucial data in the GreenGrant database. The processing process consists of client side input validation, and crucial data transfer to the server. The files and other forms of high volume data, are to be transferred and stored in an asynchronous way.

**NF-AH-01**: The AI helper tool should ensure the p90 response time is under 20 seconds, measured from the moment a user submits a prompt to the moment the complete response is rendered to the user's client.

### Safety Requirements

**NF-SA-01**: The system shall prevent loss of submitted applications by storing a durable server-side draft snapshot at least every 30 seconds while a user edits an application form.

**NF-SA-02**: The system shall provide explicit confirmation dialogs for destructive actions (for example withdrawing an application or deleting a grant draft).

**NF-SA-03**: The system shall preserve all finalized application and evaluation records for at least 10 years to support legal and administrative review.

### Security Requirements

**NF-SE-01**: All personal and application data shall be stored and processed only on infrastructure physically located in Zamunda.

**NF-SE-02**: The system shall enforce multi-factor authentication for Public Administrator and System Administrator accounts.

**NF-SE-03**: The system shall encrypt data in transit using HTTPS/TLS 1.2+ and encrypt sensitive data at rest.

**NF-SE-04**: The system shall produce tamper-evident security and audit logs for authentication, authorization, and data-modification events.

### Software Quality Attributes

**NF-QA-01 (Availability)**: The public applicant web interface shall provide at least 99.9% monthly availability, excluding planned maintenance windows.

**NF-QA-02 (Scalability)**: At grant opening time, the platform shall support at least 20,000 concurrent applicant sessions while preserving p95 page response time under 2 seconds for read operations.

**NF-QA-03 (Auditability)**: The system shall allow authorized auditors to reconstruct the full lifecycle of a grant application (submission, updates, evaluation actions, decision, notification) from system logs.

**NF-QA-04 (Usability)**: Applicant-facing pages shall be usable on mobile devices with viewport widths from 360px and above without horizontal scrolling in core workflows.

**NF-QA-05 (Maintainability)**: The system shall expose machine-readable API documentation for all internal service interfaces and keep it versioned with each production release.

### Business Rules

**BR-01**: A grant application is accepted only if submitted within the defined opening and deadline interval of the selected grant.

**BR-02**: A grant may only receive applications while remaining budget is greater than zero.

**BR-03**: Only Public Administrators can create grants and evaluate applications.

**BR-04**: Only System Administrators can create or modify privileged user accounts and role assignments.
