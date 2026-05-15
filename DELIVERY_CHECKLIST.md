# GreenGrant Projekt - Beadandó Ellenőrzési Checklist

## Dokumentáció Teljesítési Lista

### 1. Software Requirements Specification (SRS)
- **Fájl:** `/srs.md` és `/starry-sphere/src/content/docs/specification/srs.md`
- **Status:**  TELJES
- **Tartalom:**
  - [x] Introduction (Purpose, Conventions, Audience, Scope, References)
  - [x] Overall Description (Product Perspective, Functions, User Classes, Operating Environment, Constraints)
  - [x] External Interface Requirements (UI, Hardware, Software, Communications)
  - [x] System Features (8 major features with description, priority, stimulus/response, requirements)
    - [x] 4.1 Listing/Searching grants
    - [x] 4.2 Applying to grants
    - [x] 4.3 Notification by MundaMail
    - [x] 4.4 Creating new grants
    - [x] 4.5 Review and evaluate applications
    - [x] 4.6 AI helper tool
    - [x] 4.7 Manage users
    - [x] 4.8 Manage other UIs
  - [x] Nonfunctional Requirements
    - [x] Performance Requirements (NF-AG-01, NF-AH-01)
    - [x] Safety Requirements (NF-SA-01, NF-SA-02, NF-SA-03)
    - [x] Security Requirements (NF-SE-01 through NF-SE-04)
    - [x] Software Quality Attributes (NF-QA-01 through NF-QA-05)
    - [x] Business Rules (BR-01 through BR-04)

### 2. Architectural Characteristics
- **Fájl:** `/ac.md` és `/starry-sphere/src/content/docs/specification/ac.md`
- **Status:** TELJES
- **Karakterisztikák:**
  - [x] Scalability (definition, importance, architectural impact)
  - [x] Availability (definition, importance, architectural impact)
  - [x] Security (definition, importance, architectural impact)
  - [x] Auditability (definition, importance, architectural impact)
- **Indoklás:** Minden karakterisztika indokolva van, hogy miért SZIGNIFIKÁNS

### 3. Architecturally Significant Requirements (ASR)
- **Fájl:** `/asr.md` és `/starry-sphere/src/content/docs/specification/asr.md`
- **Status:** TELJES
- **Tartalom:**
  - [x] ZDR General Requirements (Cost Efficiency, Data Localization, Variable Connectivity)
  - [x] Quality Attributes alignment (Scalability, Availability, Security, Auditability)
  - [x] Significant Functional Requirements (F-AG-03, F-RE-04, F-MM-02, F-AI-03)
  - [x] Additional Architectural Constraints (Traceability, Multi-Role)
- **Indoklás:** Minden ASR-hez magyarázat, hogy miért szignifikáns az architektúrára

### 4. Architecture Style
- **Fájl:** `/as.md` [részletes] és `/starry-sphere/src/content/docs/architecture/styles.md` [Astro]
- **Status:** TELJES
- **Tartalom:**
  - [x] Overview: Hybrid Service-Based + Event-Driven Architecture
  - [x] Primary Style: Service-Based Architecture (leírás, előnyök, korlátok)
  - [x] Secondary Style: Event-Driven Architecture (leírás, előnyök, korlátok)
  - [x] Storage Architecture: Polyglot Persistence (PostgreSQL, Append-Only, Object Storage)
  - [x] Deployment Architecture (Containerized, Cloud-Native, Data Residency)
  - [x] Integration Points (MundaMail, External AI)
  - [x] Quality Attributes Mapping (táblázat)
  - [x] Tradeoffs (Pros vs Cons)

### 5. Architectural Decision Records (ADRs) - Minimum 5
- **Fájlok:** `/adrs/` és `/starry-sphere/src/content/docs/adrs/`
- **Status:** TELJESÜL (5 ADR)

#### ADR-001: Hybrid Architecture
- **Fájl:** `/adrs/architecture.md` + Astro
- **Status:** TELJES
- **Tartalom:** Context, Problem, Decision Drivers, Options, Decision Outcome, Consequences

#### ADR-002: Polyglot Persistence Strategy
- **Fájl:** `/adrs/adr-002-data-storage.md` + Astro
- **Status:** TELJES
- **Tartalom:** PostgreSQL + Append-Only + Object Storage; Indoklás, Consequences

#### ADR-003: Centralized Identity and Access Management
- **Fájl:** `/adrs/adr-003-authentication-authorization.md` + Astro
- **Status:** TELJES
- **Tartalom:** OAuth2/JWT + MFA + RBAC; Detailed Design, Consequences

#### ADR-004: Asynchronous Document Upload and Management
- **Fájl:** `/adrs/adr-004-document-management.md` + Astro
- **Status:** TELJES
- **Tartalom:** Async Upload Pattern; SSE/Polling; Validation; Consequences

#### ADR-005: Event-Driven Communication via Kafka
- **Fájl:** `/adrs/adr-005-event-driven-communication.md` + Astro
- **Status:** TELJES
- **Tartalom:** Kafka Message Bus; Topics, Consumers, Error Handling; Consequences

**ADR Stílusok:** NYGARD/MADR stílus (Context, Decision Drivers, Options, Outcome, Consequences)

### 6. C4 Diagramok
- **Fájl:** `/adrs/c4/greengrant.c4` (LikeC4 modell)
- **Status:** TELJES
- **Tartalom:**
  - [x] **L1 System Context View** - Actors (Applicant, Public Admin, System Admin), GreenGrant, MundaMail
  - [x] **L2 Container View** - Web Apps, Services, Databases, Event Bus
    - [x] Applicant Web App (SPA)
    - [x] Administration Web App
    - [x] API Gateway
    - [x] Identity & Access Service
    - [x] Grant Management Service
    - [x] Application Service (detailed components)
    - [x] Review Service (detailed components)
    - [x] AI Assistant Service (detailed components)
    - [x] Notification Worker (detailed components)
    - [x] Core Database (PostgreSQL)
    - [x] Audit Log Store
    - [x] Document Store (Object Storage)
    - [x] Event Bus (Kafka)
  - [x] **L3 Component Views**
    - [x] Application Service components
    - [x] Review Service components
    - [x] AI Assistant Service components
    - [x] Notification Worker components
  - [x] Relationships teljes dokumentációval
  - [x] Technology informatív címkék

### 7. Astro Dokumentációs Oldal
- **Könyvtár:** `/starry-sphere/`
- **Status:** TELJES
- **Tartalom:**
  - [x] **Welcome Page** (`index.mdx`) - Áttekintés, Quick Navigation
  - [x] **Specifications Section**
    - [x] SRS (`specification/srs.md`)
    - [x] Architectural Characteristics (`specification/ac.md`)
    - [x] ASR (`specification/asr.md`)
  - [x] **Architecture Section**
    - [x] Architecture Styles (`architecture/styles.md`)
  - [x] **ADRs Section**
    - [x] ADR-001 (`adrs/architecture.md`)
    - [x] ADR-002 (`adrs/adr-002-data-storage.md`)
    - [x] ADR-003 (`adrs/adr-003-authentication-authorization.md`)
    - [x] ADR-004 (`adrs/adr-004-document-management.md`)
    - [x] ADR-005 (`adrs/adr-005-event-driven-communication.md`)
  - [x] **Navigation** - Sidebar Astro konfigurációval
  - [x] **Config frissítve** (`astro.config.mjs`)
  - [x] **README** (`starry-sphere/README.md`)

## Általános Követelmények Teljesítése

### Dokumentumok Minősége
- [x] Magyar vagy angol nyelv (ENG választott)
- [x] Helyesírás és nyelvhelyesség
- [x] Minden döntés az esettanulmányra vagy csapat tapasztalatára visszavezethető
- [x] Jól strukturált és logikus

### Astro Oldal
- [x] Nyilvánosan elérhető (GitHub Pages-hez előkészített)
- [x] Könnyen navigálható (szidebar-os menü)
- [x] Esztétikus (Starlight theme)
- [x] Összes kötelező elem megtalálható
- [x] README a futtatáshoz

## Beadandó Helye

- **GitHub Repo:** https://github.com/unideb-advanced-software-engineering/26-tavasz-02-greengrant
- **Main ág:** Összes dokumentáció a main ágon
- **Astro oldal:** `/starry-sphere/` - GitHub Pages-hez előkészítve

## Esettanulmány Hivatkozás

**02: GreenGrant**
https://unideb-advanced-software-engineering.github.io/site/hu/scenarios/02-greengrant/

---