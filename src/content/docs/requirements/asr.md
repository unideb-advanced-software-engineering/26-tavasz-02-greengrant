---
title: "Architecturally significant requirements"
description: "The architecturally significant requirements of the system."
sidebar:
    order: 2
---

## General ZDR requirements

### Economy

Zamunda is not a poor country, but it does not want to waste money unnecessarily: projects must be planned with economy in mind. Climate-friendly goals also require this!

## Quality attributes

The quality attributes that can be considered [architectural characteristics](./requirements/ac.md) identified above are as follows:

- Extensibility.
- Interoperability.
- Scalability.
- Latency.

## Significant functional requirements

### F-KB-04

Custom integrations can be added to the system if standard FTP/HTTP/etc. solutions cannot be easily configured.

**Why ASR?**

- There may be many such custom integrations, and they must be managed efficiently. Both from the development and runtime sides.
- Custom integrations must be fault-tolerant and reliable. If something goes wrong, they must not bring down the system.
- It would be interesting to explore options such as generating integration code with AI. This is easier if the integrations are isolated units.

## Organizational experience, preferences

### Kafka

Our organization has extensive experience with Kafka (<https://kafka.apache.org/>), which may be worth leveraging in this project over other similar technologies.

**Why ASR?**
If we are designing a messaging-based architecture, we should build on our existing Kafka experience instead of using other technologies such as AWS SQS or NATS. This will speed up the project and allow us to leverage the strengths of our organization.kv
