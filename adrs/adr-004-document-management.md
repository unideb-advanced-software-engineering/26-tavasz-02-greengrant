# ADR-004: Asynchronous Document Upload and Management Strategy

- Status: Active
- Date: 2026-05-15
- Decision Makers: Architecture/Backend Team

## Context and Problem Statement

Applicants submit grant applications with multiple supporting documents (PDFs, scans, images) that can be 10+ MB each. The system must:

1. Accept document uploads reliably.
2. Store them durably within Zamunda.
3. Make documents accessible efficient to reviewers.
4. Prevent document loss even if the upload process is interrupted.
5. Support offline-first or low-bandwidth scenarios (per Zamunda's variable connectivity [ASR: Variable Connectivity]).

**The Problem:** Synchronous document upload (upload file → store immediately → return success) can be slow and unreliable on high-latency, low-bandwidth networks. If the network drops mid-upload, the entire upload fails, requiring the applicant to retry from scratch.

**Question:** Should documents be uploaded synchronously (blocking) or asynchronously (client gets confirmation quickly, documents processed in background)?

## Decision Drivers

- **Applicant Experience [NF-QA-04]** – Mobile users (360px+) with poor connectivity need responsive UI; blocking on large file uploads is unacceptable.
- **Resilience to Network Issues [ASR: Variable Connectivity]** – Document uploads must succeed even if connectivity is poor.
- **High-Volume Concurrent Uploads [NF-QA-02]** – At grant opening, thousands of applicants may upload simultaneously; system must handle concurrency without exhausting resources.
- **Audit Trail [NF-SE-04, F-RE-04]** – Document upload, validation, and storage must be auditable.
- **Data Integrity [F-AG-03]** – Uploaded documents must be stored securely and completely; no partial or corrupted files.
- **Draft Preservation [NF-SA-01]** – Application forms must auto-save every 30 seconds; documents should follow similar resilience.

## Considered Options

### Option A: Synchronous Upload (Blocking)
- Client uploads file directly to Application Service.
- Application Service validates file, stores to object store immediately.
- Returns success/failure immediately.
- **Pros:** Simple; audit trail straightforward (one upload event).
- **Cons:** Blocks UI; slow on poor networks; fails entirely if network drops mid-transfer; high concurrency strain.

### Option B: Asynchronous with Client-Side Retry
- Client uploads file to a dedicated upload endpoint that queues the document for processing.
- Server returns confirmation immediately ("upload accepted for later processing").
- Background job processes upload, validates, stores; if validation fails, client is not notified.
- **Pros:** UI unblocked; handles network interruption better.
- **Cons:** Client doesn't know if upload succeeded; no feedback if validation fails; difficult to implement client-side retry logic.

### Option C: Asynchronous with Client-Side Polling / Server-Sent Events (SSE)
- Client uploads file to upload endpoint; server queues it.
- Server returns upload_id + polling URL immediately.
- Client polls (or uses SSE) to check upload status.
- Once complete, document appears in application review UI.
- **Pros:** Unblocked UI; client knows outcome; scalable; supports low-bandwidth.
- **Cons:** Client must implement polling or SSE; more complex orchestration; eventual consistency.

### Option D: Chunked Upload with Resume
- Client breaks large files into chunks; uploads chunks with resume tokens.
- Server stores chunks temporarily; once all chunks received, concatenates and validates.
- Client can resume partial uploads.
- **Pros:** Supports very large files; resilient to network drops; can validate as chunks arrive.
- **Cons:** Highest complexity; requires client-side chunking logic; temporary storage overhead.

## Decision Outcome

**Chosen option: Option C (Asynchronous with SSE/Polling)**, with chunked upload (Option D) as a future enhancement.

### Rationale

1. **Application Experience:** Applicants submit documents that often exceed 100 MB (scanned documents). Blocking on upload would make the UI unresponsive. Asynchronous upload with SSE polling provides fast feedback and a responsive form.

2. **Network Resilience:** With polling, the client can detect upload failures and retry. This is critical for Zamunda's connectivity conditions.

3. **Scalability:** Queueing uploads decouples the number of concurrent uploads from the number of backend workers. At grant opening, thousands of applicants can submit simultaneously without overwhelming the service.

4. **Auditability:** Each upload is assigned a document_id and logged with its status. Reviewers can see which documents succeeded and which failed.

5. **Cost Efficiency:** Asynchronous processing allows horizontal scaling of upload workers; resources are allocated dynamically based on queue depth.

## Detailed Design

### Application Submission Workflow

1. **User Fills Form** – Applicant fills out application form on mobile or desktop. For each document field, they select a file (or drag-and-drop).

2. **Client-Side Queuing** – As documents are selected:
   - UI shows "uploading..." indicator.
   - Client generates a unique `upload_id` (UUID).
   - Client uploads document to `POST /documents/upload` endpoint with `upload_id` and application context.

3. **Server-Side Upload Endpoint** – The endpoint:
   - Validates request (authentication, application exists, file type allowed).
   - Stores the file temporarily (in a staging area or directly to object storage).
   - Publishes an event: `DocumentUploadInitiated {upload_id, application_id, file_name, file_size}`.
   - Returns immediately with `{upload_id, status: "queued", polling_url: "/documents/upload/{upload_id}/status"}`.

4. **Background Processing** – An async worker:
   - Consumes `DocumentUploadInitiated` events from the event bus.
   - Validates document (file integrity, virus scan, content type, size limits).
   - If valid, moves document to permanent object storage and publishes `DocumentValidated {upload_id, document_object_id}`.
   - If invalid, publishes `DocumentInvalid {upload_id, reason, timestamp}`.
   - Logs all actions to audit store.

5. **Client-Side Polling/SSE** – Client periodically (or via SSE) requests:
   ```
   GET /documents/upload/{upload_id}/status
   ```
   Response:
   ```json
   {
     "upload_id": "uuid-123",
     "status": "processing | validating | valid | invalid",
     "progress": 75,
     "error_message": null
   }
   ```

6. **Application Submission** – Once all required documents show `status: valid`, the applicant can submit the application. The form submission includes `upload_id` references for each document.

### Document Metadata Schema

**In Core Database** (application documents table):
```
document_id (PK)
application_id (FK)
upload_id (unique, maps to upload request)
document_object_id (reference to object store)
file_name
file_size
content_hash (SHA-256 for integrity verification)
status (queued | validating | valid | invalid)
error_message (if invalid)
uploaded_at (timestamp)
validated_at (timestamp)
validation_result JSON (details if invalid)
uploader_id (user who uploaded)
```

### Object Storage Layout

```
documents/
  {application_id}/
    {upload_id}_{document_object_id}_{sanitized_filename}
```

Each object tagged with metadata:
- `application_id`
- `upload_id`
- `uploaded_timestamp`
- `content_hash`

### Validation Rules

**File Type:** Allowed types defined per grant (PDF, JPEG, PNG, etc.).

**File Size:** Maximum 50 MB per document (configurable per grant).

**Virus Scanning:** Integrate with antivirus service (housed within Zamunda); block infected files.

**Content Validation:** For certain document types (e.g., tax forms), use OCR or document parsing to extract and validate key fields.

### Handling Upload Failures

**Client-Side:**
- If polling detects `status: invalid`, show error message to user with reason.
- Applicant can re-upload the document.

**Server-Side:**
- Failed validation documents are marked as invalid but retained for audit.
- Application can still be submitted if alternate documents are provided.

### Draft Preservation

Per [NF-SA-01], the application form auto-saves every 30 seconds. Document uploads are **decoupled** from form saves:
- Form snapshot saved to `application_draft` table (encrypted).
- Document uploads progress is saved separately.
- On recovery (if browser crashes), applicant sees which documents were uploaded and which need re-upload.

## Consequences

### Positive
- **Resilient to Network Issues** – Applicants on poor networks can upload documents piecemeal; polling detects failures and allows retry.
- **Responsive UI** – Form is never blocked on file I/O; users get immediate feedback.
- **Scalable** – Upload workers can be scaled independently; thousands of concurrent uploads are handled by queueing.
- **Auditable** – Every document upload is logged with status, timestamp, and validation result.
- **Cost Efficient** – Background processing can be scheduled during off-peak hours (if desired).

### Negative
- **Eventual Consistency** – Documents are not immediately available to reviewers; there's a delay (typically seconds to minutes) between applicant submission and reviewer access.
- **Client Complexity** – Client must implement polling/SSE and handle async status states.
- **Temporary Storage** – Staging area adds infrastructure and cleanup complexity (failed uploads must be deleted).

### Mitigation
- Implement aggressive cleanup of failed uploads (e.g., delete temporary files after 7 days).
- Use TTLs on event records to prevent stale processing.
- Use WebSocket or SSE for real-time status updates (reduce polling overhead).

## Future Enhancement: Chunked Upload

Once basic async upload is working, consider chunked upload (Option D) for applicants with very slow connections:
- Client breaks 100+ MB files into 10 MB chunks.
- Each chunk uploaded independently; server reassembles.
- Resume token allows recovering partial uploads.
- This can be added without redesigning the core async upload architecture.

## Confirmation

Implementation can be verified through:

1. **Upload Status Flow Test** – Submit a document, poll status, verify state transitions from "queued" → "validating" → "valid".
2. **Failure Handling Test** – Upload an invalid file (e.g., wrong format), verify status becomes "invalid" with error message, UI shows error.
3. **Concurrent Upload Test** – Submit 1000 concurrent documents; verify all eventually process without queue overflow or data loss.
4. **Audit Completeness Test** – Review audit logs for an application with 5 documents; verify upload, validation, and storage events are logged.
5. **Network Resilience Test** – Interrupt an upload mid-stream; verify polling detects failure and allows retry without losing partial state.

## References

- [ac.md](../ac.md) – Scalability, Availability
- [asr.md](../asr.md) – Variable Connectivity, F-AG-03
- [as.md](../as.md) – Storage Architecture, Event-Driven patterns
- [SRS](../srs.md) – F-AG-01, F-AG-02, F-AG-03, NF-SA-01, NF-QA-02, NF-QA-04
