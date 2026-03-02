# Specification: Apps Management

## ADDED Requirements

### Requirement: List Portra Apps
The system MUST provide an endpoint and UI to list all `App` Custom Resources in the Kubernetes cluster.

#### Scenario: Listing Apps
- **Given:** Multiple `App` resources are deployed in the `portra-system` namespace.
- **When:** The user navigates to the Apps page.
- **Then:** All `App` resources are listed, displaying their name, image, replicas, and primary domain.

### Requirement: Get App Details
The system MUST provide an endpoint and UI to view detailed configuration and status for a specific `App`.

#### Scenario: View App Details
- **Given:** An `App` named `app-sample` exists in the cluster.
- **When:** The user selects the app from the list.
- **Then:** Detailed information including `image`, `containerPort`, `replicas`, `domains`, `tls` status, `env` variables, and resource `limits/requests` is displayed.

### Requirement: Display App Status
The system MUST display the current operational status of an `App` based on its Kubernetes conditions.

#### Scenario: View App Conditions
- **Given:** An `App` has status conditions (e.g., `Available: True`).
- **When:** The user views the app details.
- **Then:** The current state of conditions is displayed (Available, Progressing, Degraded).

### Requirement: Error Handling for Missing Apps
The system MUST gracefully handle scenarios where a requested `App` does not exist or the Kubernetes API is unreachable.

#### Scenario: Non-existent App
- **Given:** The user attempts to access `/apps/missing-app`.
- **When:** The backend returns a 404 error.
- **Then:** The UI displays a clear "App not found" message.
