#!/bin/bash

set -e

# Portra Installation Script
# This script installs the Portra Operator and the Portra application.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Portra Installation...${NC}"

# Check for kubectl
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}Error: kubectl is not installed.${NC}"
  exit 1
fi

# Check for cluster connectivity
if ! kubectl cluster-info &> /dev/null; then
  echo -e "${RED}Error: Cannot connect to the Kubernetes cluster.${NC}"
  exit 1
fi

# Step 1: Install Portra Operator
echo -e "${YELLOW}Step 1: Installing Portra Operator...${NC}"
kubectl apply -f https://raw.githubusercontent.com/portra-run/portra-operator/refs/heads/main/dist/install.yaml

# Step 2: Ingress Configuration
echo -e "${YELLOW}Step 2: Checking Ingress Controller...${NC}"

# Check for existing IngressClasses
INGRESS_CLASSES=$(kubectl get ingressclasses -o jsonpath='{.items[*].metadata.name}')

if [ -z "$INGRESS_CLASSES" ]; then
  echo -e "${YELLOW}No Ingress Controller found.${NC}"
  read -p "Would you like to install ingress-nginx? (y/n): " INSTALL_NGINX
  if [[ $INSTALL_NGINX =~ ^[Yy]$ ]]; then
    echo -e "Installing ingress-nginx..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
    # Wait for nginx-ingress to be ready
    echo -e "Waiting for ingress-nginx to be ready (this may take a minute)..."
    kubectl wait --namespace ingress-nginx 
      --for=condition=ready pod 
      --selector=app.kubernetes.io/component=controller 
      --timeout=120s || true
  else
    echo -e "${YELLOW}Proceeding without installing an Ingress Controller. You may need to configure one manually.${NC}"
  fi
else
  echo -e "${GREEN}Found Ingress Controller(s): $INGRESS_CLASSES${NC}"
fi

# Step 3: Create Namespace
echo -e "${YELLOW}Step 3: Creating Portra Namespace...${NC}"
kubectl apply -f kubernetes/base/namespace.yaml

# Step 4: Deploy Portra
echo -e "${YELLOW}Step 4: Deploying Portra...${NC}"

# Handle basic domain configuration for Ingress
read -p "Enter the domain for Portra (e.g., portra.local): " PORTRA_DOMAIN
if [ -z "$PORTRA_DOMAIN" ]; then
  PORTRA_DOMAIN="portra.local"
fi

# Simple sed to replace domain if needed, or just apply if static
# For a more robust script, we could use envsubst
TEMP_DIR=$(mktemp -d)
cp kubernetes/base/* "$TEMP_DIR/"

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/portra.local/$PORTRA_DOMAIN/g" "$TEMP_DIR/ingress.yaml"
else
  sed -i "s/portra.local/$PORTRA_DOMAIN/g" "$TEMP_DIR/ingress.yaml"
fi

kubectl apply -f "$TEMP_DIR/pvc.yaml"
kubectl apply -f "$TEMP_DIR/service.yaml"
kubectl apply -f "$TEMP_DIR/deployment.yaml"
kubectl apply -f "$TEMP_DIR/ingress.yaml"

rm -rf "$TEMP_DIR"

echo -e "${GREEN}Portra installation completed!${NC}"
echo -e "Wait for the pods to be ready with: ${YELLOW}kubectl get pods -n portra-system${NC}"
echo -e "Once ready, you can access Portra at: ${YELLOW}http://$PORTRA_DOMAIN${NC}"
