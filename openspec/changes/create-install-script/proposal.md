# Proposal: Create Portra Installation Script

## Problem
Currently, Portra doesn't have a single-command installation script. Users need to manually install the operator and potentially configure Kubernetes resources. A unified installation script would simplify onboarding and ensure a consistent setup.

## Solution
Create a shell script (`install.sh`) that:
1.  Verifies `kubectl` and cluster access.
2.  Installs the `portra-operator` via the official manifest.
3.  Checks for an existing Ingress Controller (e.g., NGINX) and offers to install one (e.g., via Helm or a simple manifest) or configures a default Ingress for Portra.
4.  Deploys Portra (frontend and backend) into the cluster.

## Scope
-   `install.sh`: The main installation script.
-   Kubernetes manifests for Portra's deployment if not already defined.
-   Ingress configuration logic.

## Trade-offs
-   Shell script vs. Helm chart: A shell script is easier for quick starts, but a Helm chart is more idiomatic for complex Kubernetes deployments. We'll start with a script that can eventually wrap a Helm chart or use raw manifests.
-   Default Ingress: Choosing a default Ingress Controller (like ingress-nginx) might conflict with existing setups. The script should be interactive or provide clear options.
