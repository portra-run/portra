# Tasks: Portra Installation Script

## Phase 1: Script Scaffolding & Prerequisites
- [ ] Create `install.sh` base structure.
- [ ] Implement prerequisite checks for `kubectl` and `curl`.
- [ ] Add check for Kubernetes cluster connectivity.

## Phase 2: Operator Installation
- [ ] Add logic to apply the `portra-operator` manifest.
- [ ] Verify the operator pods are running after application.

## Phase 3: Ingress Detection & Configuration
- [ ] Implement logic to detect available `IngressClass`es.
- [ ] Implement interactive choice for Ingress Class if multiple exist.
- [ ] Implement `ingress-nginx` installation option if no Ingress Controller is found.

## Phase 4: Portra Deployment
- [ ] Create basic Kubernetes manifests for Portra (`Deployment`, `Service`, `Ingress`).
- [ ] Add logic to `install.sh` to apply Portra manifests with basic configuration.
- [ ] Verify Portra pods are ready.

## Phase 5: Finalization
- [ ] Display successful installation message with access URL.
- [ ] Add basic error handling and logging throughout the script.
- [ ] Test the script on a fresh Kubernetes cluster (e.g., Minikube or Kind).
