# Tasks: Implement Apps Management

## Phase 1: Backend Infrastructure
- [ ] Initialize Kubernetes client utility.
- [ ] Implement `listApps` logic using `CustomObjectsApi`.
- [ ] Implement `getApp` logic using `CustomObjectsApi`.

## Phase 2: Elysia API Integration
- [ ] Create `src/backend/modules/apps/index.ts` with list and details endpoints.
- [ ] Integrate the `apps` module into the main Elysia instance in `src/backend/index.ts`.
- [ ] Add basic error handling for Kubernetes API calls.

## Phase 3: Frontend - Apps List
- [ ] Create `/apps` page in Next.js.
- [ ] Implement data fetching from the `/api/apps` endpoint.
- [ ] Design and build the apps table/grid.

## Phase 4: Frontend - App Details
- [ ] Create `/apps/:name` page in Next.js.
- [ ] Implement data fetching from the `/api/apps/:name` endpoint.
- [ ] Design and build the app details view (Spec, Status, Conditions).

## Phase 5: Verification & Refinement
- [ ] Verify functionality against a local cluster with sample `App` CRs.
- [ ] Ensure proper error messages are displayed when k8s is unreachable.
- [ ] Apply Biome formatting and linting.
