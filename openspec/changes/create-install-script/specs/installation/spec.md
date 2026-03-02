# Specification: Portra Installation

## ADDED Requirements

### Requirement: Install Portra Operator
The installation script MUST install the latest version of the Portra Operator using the official release manifest.

#### Scenario: Basic Installation
- **Given:** A Kubernetes cluster accessible via `kubectl`.
- **When:** The user runs the installation script.
- **Then:** `kubectl apply -f https://raw.githubusercontent.com/portra-run/portra-operator/refs/heads/main/dist/install.yaml` is executed.

### Requirement: Default Ingress Configuration
The installation script MUST ensure a default Ingress is configured for Portra.

#### Scenario: No Ingress Controller Found
- **Given:** A cluster without an Ingress Controller or default Ingress Class.
- **When:** The user runs the installation script.
- **Then:** The script should suggest installing `ingress-nginx` or ask for a specific Ingress Class.

#### Scenario: Existing Ingress Controller Found
- **Given:** A cluster with an existing Ingress Controller.
- **When:** The user runs the installation script.
- **Then:** The script should use the existing default Ingress Class or ask the user which one to use.

### Requirement: Deploy Portra Components
The installation script MUST deploy the Portra frontend, backend, and necessary supporting resources (Service, Ingress, etc.).

#### Scenario: Portra Deployment
- **Given:** The operator is installed.
- **When:** The user continues the installation.
- **Then:** The script applies manifests for Portra's `Deployment`, `Service`, and `Ingress`.

### Requirement: Prerequisites Verification
The installation script MUST verify that all required tools (`kubectl`, `curl`) are installed and that there's an active connection to a Kubernetes cluster.

#### Scenario: Missing Prerequisites
- **Given:** `kubectl` is not installed on the system.
- **When:** The user runs the installation script.
- **Then:** The script should fail gracefully with a descriptive error message.
