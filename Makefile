# Makefile for Docker operations
# Use 'make help' to see all available commands with descriptions

# Variables
IMAGE_NAME := app
IMAGE_TAG := local
REGISTRY := registry.example.com
PORT := 3000

# Build with BuildKit for cache mounts (consistent for CI and local)
.PHONY: build
build: ## Build with BuildKit for cache mounts (consistent for CI and local)
	DOCKER_BUILDKIT=1 docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Build multi-arch images for shared registries
.PHONY: buildx
buildx: ## Build multi-arch images (linux/amd64,linux/arm64)
	DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Run locally with env file
.PHONY: run
run: ## Run locally with .env and port mapping
	docker run --rm -p $(PORT):$(PORT) --env-file .env $(IMAGE_NAME):$(IMAGE_TAG)

# Run with custom port
.PHONY: run-port
run-port: ## Run with custom port (4000)
	docker run --rm -e PORT=4000 -p 4000:4000 $(IMAGE_NAME):$(IMAGE_TAG)

# Smoke test health endpoint
.PHONY: test
test: ## Smoke test health endpoint
	curl -fsS http://localhost:$(PORT)/health || echo "health check failed"

# Run unit/integration tests locally (no Docker)
.PHONY: test-local
test-local: ## Run unit/integration tests locally
	npm test

# Run linting locally (no Docker)
.PHONY: lint
lint: ## Run ESLint and TypeScript compilation check
	npx eslint src/**/*.ts
	npx tsc --noEmit

# Prisma client sanity check
.PHONY: test-prisma
test-prisma: ## Test Prisma client
	docker run --rm $(IMAGE_NAME):$(IMAGE_TAG) node -e "require('@prisma/client'); console.log('prisma ok')"

# Verify non-root UID
.PHONY: test-user
test-user: ## Verify non-root UID
	docker run --rm $(IMAGE_NAME):$(IMAGE_TAG) sh -lc 'id -u && id -g'

# Generate SBOM for supply-chain hygiene
.PHONY: sbom
sbom: ## Generate SBOM (Software Bill of Materials)
	syft packages . -o spdx-json > sbom.spdx.json

# Scan image for vulnerabilities
.PHONY: scan
scan: ## Scan image for vulnerabilities
	trivy image $(IMAGE_NAME):$(IMAGE_TAG)

# Push to registry
.PHONY: push
push: ## Push to registry
	DOCKER_BUILDKIT=1 docker build -t $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG) .
	docker push $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)

# Rollback to previous image (requires previous image tag)
.PHONY: rollback
rollback: ## Rollback to previous image tag
	@echo "Rollback requires manual retagging of previous image"
	@echo "Example: docker tag $(REGISTRY)/$(IMAGE_NAME):previous $(REGISTRY)/$(IMAGE_NAME):latest"

# Clean up dangling images
.PHONY: clean
clean: ## Clean up dangling images
	docker image prune -f

# Show help
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'