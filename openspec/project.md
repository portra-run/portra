# Project Context

## Purpose
Portra is a modern Platform-as-a-Service (PaaS) UI and API designed specifically for Kubernetes. Inspired by tools like Dokploy, Coolify, and Caprover, Portra aims to simplify application deployment and management on Kubernetes clusters. This repository contains the frontend and backend API, while a separate operator handles the low-level Kubernetes orchestration.

## Tech Stack
- **Runtime:** Bun
- **Frontend Framework:** Next.js 16 (React 19)
- **Backend API:** Elysia (integrated into Next.js via API routes)
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, Lucide React, Shadcn UI
- **Authentication:** Better-Auth
- **Database:** SQLite (via Bun)
- **ORM:** Drizzle ORM
- **Kubernetes Interaction:** `@kubernetes/client-node`
- **Linting & Formatting:** Biome

## Project Conventions

### Code Style
- Use **Biome** for linting and formatting.
- Prefer **TypeScript** for all new code.
- Use **Lucide React** for icons and **Radix UI** for accessible components.
- Naming: Use kebab-case for filenames and PascalCase for React components.

### Architecture Patterns
- **API routes** are handled by Elysia under `src/backend`, mounted at `/api`.
- **Modular Backend:** Backend logic is organized into modules under `src/backend/modules`.
- **Shared Schemas:** Drizzle ORM is used for both application data and authentication schemas.
- **Client-Side Data Fetching:** Use Next.js 16 features combined with Elysia's type-safe clients where possible.

### Testing Strategy
- To be defined (likely using Bun's built-in test runner).

### Git Workflow
- Standard branch-based workflow (feature branches merged into `main`).
- Commit messages should be clear and descriptive.

## Domain Context
- **PaaS on Kubernetes:** Understanding of Kubernetes primitives (Pods, Deployments, Services, Ingress, etc.) is crucial.
- **Portra Operator:** Portra interacts with a custom Kubernetes operator to manage application lifecycles.

## Important Constraints
- **Kubernetes Native:** All resource management must translate to Kubernetes manifests or custom resource definitions (CRDs).
- **SQLite:** The current implementation uses SQLite for local state and metadata.

## External Dependencies
- **Kubernetes API:** The API must have access to a Kubernetes cluster (via `kubeconfig` or service account).
- **Better-Auth:** External auth provider configuration (if extended beyond email/password).

## Installation
Portra can be installed using the provided installation script:
```bash
./install.sh
```
This script handles the installation of the Portra Operator, configures a default Ingress controller if needed, and deploys Portra components into the `portra-system` namespace.
