# Design: Apps Management

## Architecture Overview
The Portra platform will interact directly with the Kubernetes API using `@kubernetes/client-node` to manage `App` Custom Resources (CRDs).

## Key Components

### 1. Kubernetes Client (Backend)
- A shared utility or module to initialize and manage the Kubernetes API connection (`KubeConfig`).
- Functions to interact with Custom Resources:
  - `listApps()`: Fetches all `App` resources in a given namespace.
  - `getApp(name)`: Fetches a single `App` resource.

### 2. Elysia Backend Module (`src/backend/modules/apps`)
- Exposes REST endpoints to the frontend.
- Maps Kubernetes CRD objects to clean, type-safe JSON objects for the frontend.
- Handles error states (e.g., app not found, k8s API unavailable).

### 3. Next.js Frontend
- **Page `/apps`**: Lists all available apps in a table or grid view. Shows image name, replicas (current/desired), and domain.
- **Page `/apps/:name`**: Detailed view.
  - Spec section: image, port, replicas, domains, TLS, env vars, resource limits.
  - Status section: Conditions (Available, Progressing, Degraded).
  - Actions: Delete app (optional for this proposal), update config (optional).

## Data Models

### App Custom Resource Schema (CRD)
Based on the provided Go spec:
- **Group:** `core.portra.run`
- **Version:** `v1`
- **Kind:** `App`
- **Spec:** `image`, `containerPort`, `domains`, `tls`, `env`, `replicas`, `resources`.
- **Status:** `conditions` (Type, Status, Reason, Message).

## Implementation Details
- Use `@kubernetes/client-node`'s `CustomObjectsApi` for CRD interaction.
- Ensure the backend correctly handles the translation from Kubernetes' generic object structure to Portra's typed representation.
