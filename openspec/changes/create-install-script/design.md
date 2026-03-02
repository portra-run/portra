# Design: Portra Installation Script

## Architecture Overview
The installation script will be a `bash` script designed to run from the user's terminal with `kubectl` access. It will handle the orchestration of the installation process.

## Key Components

### 1. Prerequisites Check
- `kubectl` availability.
- Cluster connectivity.
- `helm` (optional, for ingress installation).

### 2. Operator Installation
- `kubectl apply -f https://raw.githubusercontent.com/portra-run/portra-operator/refs/heads/main/dist/install.yaml`

### 3. Ingress Management
- Detect existing Ingress Controllers: `kubectl get ingressclasses`.
- If no default Ingress Class exists:
  - Provide an option to install `ingress-nginx`.
  - Or, if an Ingress Class exists, use it.
- Create a Portra Ingress manifest referencing the detected or installed Ingress Class.

### 4. Portra Deployment
- Deploy the Portra application itself. This requires Kubernetes manifests:
  - `Deployment` for Portra (frontend + backend).
  - `Service` (ClusterIP).
  - `Ingress`.
  - `Secret` or `ConfigMap` for configuration (SQLite DB path, env vars).

## Implementation Details

### Script Workflow
1.  Check dependencies.
2.  Install `portra-operator`.
3.  Check/Install Ingress Controller.
4.  Configure and apply Portra manifests.
5.  Wait for pods to be ready.
6.  Display the access URL.

### Manifest Templates
The script will use `envsubst` or simple `sed` to customize manifests with the user's domain and configuration.

## Risks
- **Manifest Drift:** Kubernetes manifests in the script might go out of sync with the application code.
- **Environment Variance:** Different cloud providers (GKE, EKS, local k3s) handle Ingress differently. The script should aim for a common denominator or provide provider-specific paths.
