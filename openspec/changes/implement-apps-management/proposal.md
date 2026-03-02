# Proposal: Implement Apps Management

## Problem
Portra needs a way to manage applications deployed via the Portra Operator. Currently, there is no UI or API to list, view details, or manage these "App" Custom Resources.

## Solution
Implement a management interface in Portra that:
1.  Provides an API to list and fetch details of `App` Custom Resources from the Kubernetes cluster.
2.  Provides a frontend interface to browse apps and view their configuration, status, and associated resources.

## Scope
-   **Backend (Elysia):**
    -   New module `src/backend/modules/apps`.
    -   Endpoints: `GET /api/apps` (list), `GET /api/apps/:name` (details).
    -   Integration with `@kubernetes/client-node` to interact with the `core.portra.run/v1` CRD.
-   **Frontend (Next.js):**
    -   Apps list page.
    -   App details page showing image, replicas, domains, status, and resources.

## Trade-offs
-   Direct Kubernetes API vs. Caching: For now, we will use direct Kubernetes API calls for simplicity. As the number of apps grows, we might need a controller/informer pattern with a local cache.
-   Namespace scoping: The UI should allow filtering by namespace or default to a specific one (e.g., `default` or `portra-system`).
