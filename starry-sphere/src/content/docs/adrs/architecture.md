---
title: "ADR-001: Hybrid architecture"
description: "ADR-001: Hybrid architecture"
---

Status: Active

## Context and Problem Statement

GreenGrant is part of the Zamunda Digital Renaissance (ZDR) program, providing an online portal for citizens and businesses to apply for green investment subsidies. The system must handle sensitive data entirely within Zamunda, support millions of users, work on low-bandwidth networks, integrate with the MundaMail API, and provide AI-assisted tools for administrators.

The key decision is: Which architectural style best ensures scalability, security, maintainability, and cost-efficiency while meeting these functional and operational requirements?

<!--Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems. -->

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

- Scalability – Must handle millions of users and spikes in applications when new grants open.
- Security & Data Residency – All data must remain and be processed within Zamunda.
- Reliability & Availability – System must remain operational during high traffic periods.
- ost Efficiency – Limited public funds require an economically viable solution.
- sability & Accessibility – Web interfaces must work across devices and low-bandwidth networks.
- Integration Capability – Must integrate seamlessly with the MundaMail API and potential future services.
- Maintainability & Extensibility – Should allow easy updates, new grant types, and evolving business rules.
- Support for AI-assisted Administration – System should enable AI tools to help evaluate large volumes of documentation.
- Sustainability Alignment – Architecture should support ZDR’s climate-friendly and resource-efficient goals.

## Considered Options

- Monolithic Architecture – A single unified application handling all functionality.
- Layered (n-tier) Architecture – Separate layers for presentation, business logic, and data management.
- Service-based – Independent services for different functional modules, communicating via APIs.
- Event-Driven Architecture – Components react asynchronously to events, suitable for high-traffic workloads.
- Space-Based Architecture – System designed to avoid central bottlenecks by distributing processing and storage across in-memory spaces, improving scalability for high-load scenarios.

## Decision Outcome

Chosen option: Hybrid Service-Based with Event-Driven Architecture, because it best balances scalability, reliability, and maintainability. This approach allows the system to decompose core functionality into independent services while using event-driven patterns to handle high traffic and asynchronous workflows, such as mass grant submissions and AI-assisted document processing. It meets critical decision drivers like data residency, cost efficiency, and integration with the MundaMail API, while supporting future extensibility and alignment with ZDR’s sustainability goals.
<!-- This is an optional element. Feel free to remove. -->
### Consequences

#### Pros  

- The system can scale independently for high-traffic grant applications, ensuring availability during peak periods.

- Services can be developed, deployed, and maintained independently, improving maintainability and extensibility.

- Event-driven workflows support asynchronous processing, such as AI-assisted document review, reducing bottlenecks.

- It supports integration with external systems like the MundaMail API and can accommodate future integrations.

#### Cons

- Increased architectural complexity requires more advanced DevOps and monitoring practices.

- Initial development may be slower compared to a monolithic approach due to service decomposition and event orchestration.

- Testing and debugging across distributed services can be more challenging.

<!-- This is an optional element. Feel free to remove. -->
### Confirmation

The implementation of the hybrid service-based, event-driven architecture can be confirmed through the following measures:

- Design and Code Reviews – Regular reviews will ensure services are properly decoupled, event-driven workflows are correctly implemented, and integration points (e.g., MundaMail API) follow the architectural guidelines.
- Automated Tests – Unit and integration tests will validate that services behave as expected independently and in coordination through events. End-to-end tests will simulate peak grant submission periods to confirm scalability and reliability.
- Monitoring and Observability – Metrics and logs from each service will be collected to verify correct asynchronous processing, system responsiveness, and error handling under load.
- Compliance Checks – Periodic audits will confirm that all data processing and storage remain within Zamunda, meeting security and residency requirements.
- Fitness Function Validation – Architectural principles such as service decoupling, event-driven communication, and scalability thresholds can be codified into automated rules using tools like ArchUnit or custom linting scripts.
- These measures ensure that the chosen architecture is correctly implemented and continues to meet the functional, non-functional, and operational requirements outlined in the ADR.
