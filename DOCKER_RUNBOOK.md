# Docker Runbook

A quick reference guide for building, running, and verifying Docker images for this project.

## Quick Commands

### Build Image
```bash
# Build with BuildKit for cache mounts (consistent for CI and local)
# DOCKER_BUILDKIT=1 ensures consistent behavior between CI and local environments
DOCKER_BUILDKIT=1 docker build -t app:local .
```

### Run Image
```bash
# Run locally with env file
docker run --rm -p 3000:3000 --env-file .env app:local
```

### Smoke Test
```bash
# Test health endpoint
curl -fsS http://localhost:3000/health || echo "health check failed"
```

## Verification Checklist (30-second validation)

### 1. Prisma Sanity Checks
```bash
# Confirm Prisma client is present
docker run --rm app:local node -e "require('@prisma/client'); console.log('prisma ok')"

# Run migrations (outside image, CI/release step)
npx prisma migrate deploy
```

### 2. Runtime Safety Checks
```bash
# Verify non-root UID (should not be 0)
docker run --rm app:local sh -lc 'id -u && id -g'

# Test configurable PORT
docker run --rm -e PORT=4000 -p 4000:4000 app:local node dist/index.js
```

### 3. Health Endpoint and Graceful Stop
```bash
# Test health endpoint
curl -fsS http://localhost:3000/health

# Test graceful shutdown (in another terminal)
# docker stop <container-id>
# Ensure the app handles SIGTERM and exits quickly
```

### 4. .dockerignore Verification
Ensure these files are excluded from build context:
```
node_modules
dist
.git
*.log
.env
Dockerfile
docker-compose*.yml
```

## CI/CD Workflow

### Build and Push
```bash
# Build with cached layers (consistent with local)
# Using DOCKER_BUILDKIT=1 ensures cache mounts and parallelization for faster builds
DOCKER_BUILDKIT=1 docker build -t REGISTRY/app:sha-XXXX .
docker push REGISTRY/app:sha-XXXX
```

### Release Order
1. Run `npx prisma migrate deploy`
2. Update secrets/environment variables
3. Roll out new image
4. Verify `/health` endpoint and minimal API flow

### Smoke Test Job
Add a lightweight job that:
1. Runs the image
2. CURLs `/health` endpoint
3. Proceeds with promotion only if successful

### CI/CD Guardrails
- **Pipeline order**: migrate deploy → set secrets/env → roll out image → smoke test /health → promote
- **Caching**: use BuildKit + registry cache; pin node:20-slim (or consistent alpine+libs) to keep cache hits stable across builds
- **Signed images**: consider cosign sign/verify and storing attestations (SBOM + provenance) alongside the image
- **Rollback**: keep previous image tag and use `make rollback` target that re-tags and redeploys

## Optional Enhancements

### Enable Healthcheck
Uncomment in Dockerfile (only when monitoring is ready):
```dockerfile
# HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=5s \
#   CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1
```

Healthcheck notes:
- Start with interval=30s timeout=3s retries=3 start-period=5s
- Ping /health with short timeout and low retry count to avoid false positives
- Transitions containers through starting → healthy/unhealthy
- Enforceable by orchestrators
- Enable only when observability/alerts are ready

### Alpine Variant
If switching to Alpine:
```bash
# Add runtime dependencies
apk add --no-cache openssl libc6-compat curl

# Retain prisma generate in build stage
# Copy @prisma and .prisma artifacts to runtime
```

## Makefile Commands

For convenience, use the Makefile:
```bash
make build     # Build with BuildKit
make run       # Run with .env and port mapping
make test      # Curl /health
make push      # Push to registry
make help      # Show all commands
```

The Makefile includes self-documenting targets with embedded descriptions. Use `make help` to see all available commands.

Additional Makefile targets for local development:
```bash
make lint      # Run ESLint and TypeScript compilation check
make test-local # Run unit/integration tests locally
make sbom      # Generate SBOM (Software Bill of Materials)
make scan      # Scan image for vulnerabilities
make buildx    # Build multi-arch images
```

## One-Screen Validation

Quick validation on a single screen:

```bash
# 1. Build image (multi-stage for smaller size)
# Multi-stage builds separate build and runtime dependencies for smaller images
DOCKER_BUILDKIT=1 docker build -t app:local .

# 2. Run with env (non-root user for security)
# Running as non-root user reduces security risks
docker run --rm -p 3000:3000 --env-file .env app:local

# 3. Smoke test (verify health endpoint)
# Quick health check to verify the application is responding
curl -fsS http://localhost:3000/health || echo "health check failed"

# 4. Prisma check (verify client artifacts)
# Verify Prisma client is properly included in the image
docker run --rm app:local node -e "require('@prisma/client'); console.log('prisma ok')"

# 5. User check (verify non-root runtime)
# Confirm the container runs as a non-root user for security (should not be 0)
docker run --rm app:local sh -lc 'id -u && id -g'
```

## Troubleshooting

### Common Issues
1. **Build fails with missing dependencies**: Ensure .dockerignore is correct
2. **Prisma client not found**: Verify prisma generate ran in build stage and @prisma/.prisma copied to runtime
3. **Permission denied**: Check non-root user configuration
4. **Port conflicts**: Use custom PORT environment variable
5. **Stale target names**: All non-file targets are marked as .PHONY to avoid timestamp surprises
6. **Healthcheck flaps**: Reduce retries and interval or remove HEALTHCHECK until observers are configured
7. **Build speed issues**: Prefer BuildKit, cache mounts, and stable base tags for high cache hit rates
8. **Works locally, not in container**: Re-confirm PORT env, binding to 0.0.0.0, and that the health endpoint does not require auth

### Quick Fixes
```bash
# Clean up dangling images
docker image prune -f

# Rebuild without cache
DOCKER_BUILDKIT=1 docker build --no-cache -t app:local .

# Check running containers
docker ps

# View container logs
docker logs <container-id>

# Simple log viewing with jq (if logs are JSON)
docker logs <container-id> 2>&1 | jq '.'
```

## Operational Guidelines

### Logging
- Standardize on JSON logs with timestamps and levels
- Use `docker logs <container-id>` for viewing logs
- For JSON logs, use `docker logs <container-id> 2>&1 | jq '.'` for better readability

### Graceful Shutdown
- Ensure SIGTERM is handled and server closes within the platform's timeout (typically 30 seconds)
- The application should exit gracefully within 10-15 seconds of receiving SIGTERM
- Test with `docker stop <container-id>` to verify graceful shutdown

### Environment Safety
Always validate required secrets on process start (fail fast). Required environment variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | Database connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| PORT | Application port | No (defaults to 3000) |

## Best Practices Reinforced

1. **Multi-stage builds**: Smaller images by separating build and runtime dependencies
2. **BuildKit usage**: Faster builds with cache mounts and parallelization
3. **Non-root runtime**: Security through running as dedicated user
4. **Consistent invocation**: Same DOCKER_BUILDKIT=1 pattern for CI and local
5. **.PHONY targets**: Prevents timestamp surprises for non-file targets
6. **Healthcheck configuration**: When enabled, ping /health with short timeout and low retry count to avoid false positives
7. **Supply chain hygiene**: Use `make sbom` and `make scan` for vulnerability management