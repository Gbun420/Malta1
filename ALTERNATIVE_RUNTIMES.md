# Alternative Runtime Options

This document describes the alternative runtime options available for this project, allowing you to choose the best approach for your development and deployment needs.

## Table of Contents
1. [Colima for Local Containers](#colima-for-local-containers)
2. [Buildpacks for Image Building](#buildpacks-for-image-building)
3. [PM2 for Local Process Management](#pm2-for-local-process-management)
4. [Render for Hosted Deployment](#render-for-hosted-deployment)
5. [Traditional Docker](#traditional-docker)

## Colima for Local Containers

Colima provides a lightweight way to run containers on macOS without Docker Desktop.

### Quick Start
```bash
brew install colima
colima start
docker context use colima
# Now use docker build/run as usual
```

### Quick Verification
```bash
# Switch Docker context to Colima and confirm
docker context use colima && docker context ls && docker info | grep -i context

# Run a test container
docker run -p 5433:5432 postgres:13
```

### Setup
```bash
npm run setup:colima
```

### Usage
After setup, you can use standard Docker commands:
```bash
# Start database
docker run -p 5433:5432 postgres:13

# Build and run your application
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Troubleshooting
If `colima start` fails, try:
```bash
colima delete
colima start
```

If docker.sock issues arise, ensure the context is colima or set DOCKER_HOST to Colima's socket.

When leaving Colima, return the Docker CLI to its default daemon:
```bash
docker context use default
```

## Buildpacks for Image Building

Cloud Native Buildpacks automatically create optimized container images without requiring a Dockerfile.

### Quick Start
```bash
brew install buildpacks/tap/pack
pack builder suggest
pack build my-app --builder paketobuildpacks/builder-jammy-base --path .
docker run -p 3000:3000 my-app
curl http://localhost:3000/health
```

### Setup and Build
```bash
npm run build:pack
```

### Quick Verification
```bash
# Install and pin builder
brew install buildpacks/tap/pack
pack builder suggest

# Build and test
pack build my-app --builder paketobuildpacks/builder-jammy-base --path .
docker run -p 3000:3000 my-app
curl http://localhost:3000/health
```

### Usage
The script will create a container image that can be run with:
```bash
docker run -p 3000:3000 my-app
```

### Builder Information
- `paketobuildpacks/builder-jammy-base` includes language buildpacks (Node, Java, etc.)
- Buildpackless variants require explicit buildpack flags

### Documentation
For more information on pack CLI commands, visit:
[https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/cli/](https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/cli/)

For CI usage, see flags like `--env` and `--publish` to push directly to registries.

## PM2 for Local Process Management

PM2 is a production-grade Node.js process manager that's perfect when containers are overkill.

### Quick Start
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 logs  # for live debugging
```

### Quick Verification
```bash
# Start and persist
pm2 start ecosystem.config.js
pm2 save

# Auto-start on boot (follow printed command)
pm2 startup

# Day-to-day commands
pm2 logs
pm2 restart api-server
pm2 reload api-server
pm2 monit
```

### Setup
```bash
npm run setup:pm2
```

### Usage
```bash
# Start the application
npm run start:pm2

# Stop the application
npm run stop:pm2

# Restart the application
npm run restart:pm2
```

### Useful PM2 Commands
- `pm2 status` - View application status
- `pm2 logs` - View application logs
- `pm2 restart <name>` - Restart applications
- `pm2 reload <name>` - Zero-downtime reload
- `pm2 monit` - Monitor applications
- `pm2 stop all` - Stop all applications
- `pm2 delete` - Remove applications from PM2

### Auto-start on Boot
To enable PM2 to start on system boot:
```bash
pm2 startup
# Follow the printed command to configure launchd/systemd
```

After reboot, validate the setup:
```bash
pm2 resurrect
pm2 status
```

## Render for Hosted Deployment

Render provides simple deployment with automatic HTTPS and git-based deploys.

### Quick Start
1. Create an account at [Render](https://render.com)
2. Connect your repository
3. Use the provided render.yaml configuration

### Configuration
The render.yaml file specifies:
- Build Command: `npm ci && npm run build && npx prisma migrate deploy`
- Start Command: `node dist/index.js`

### Quick Verification
Ensure the build/start pair matches Render's pattern:
```bash
# Build command
npm ci && npm run build && npx prisma migrate deploy

# Start command
node dist/index.js
```

### Environment Variables
Before first deploy, add all required environment variables in the service:
- DATABASE_URL
- JWT_SECRET
- Stripe keys
- Feature flags

This ensures migrations and webhooks succeed on first boot.

### Deploy
Simply push to your repository and Render will automatically deploy your application.

## Traditional Docker

For those who prefer traditional Docker workflows, an optimized multi-stage Dockerfile is provided.

### Optimized Dockerfile Features
- **Smaller, faster builds**: Uses slim base image, copies lockfiles before source to maximize layer cache, and uses BuildKit cache mounts for npm
- **Safer runtime**: Runs as a dedicated non-root user and sets NODE_ENV=production
- **Prisma ready**: Runs prisma generate in the build stage and copies generated client/artifacts to runtime
- **Predictable ports and health**: Sets PORT, adds optional HEALTHCHECK, and exposes only the app port

### Quick Start
```bash
# Build with BuildKit for cache mounts (consistent for CI and local)
DOCKER_BUILDKIT=1 docker build -t my-app .

# Run locally
docker run -p 3000:3000 --env-file .env my-app
```

### Build and Run
```bash
# Build the image with BuildKit (consistent invocation for CI/local)
DOCKER_BUILDKIT=1 docker build -t my-app .

# Run the container
docker run -p 3000:3000 --env-file .env my-app
```

### Multi-Platform Builds
For building images that work on multiple architectures (AMD64 and ARM64):
```bash
# Requires Docker Buildx
DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t my-app .
```

### .dockerignore
A .dockerignore file is included to:
- Reduce context size
- Speed up builds
- Avoid cache invalidation
- Prevent secrets from being included in the build context

The .dockerignore excludes:
- node_modules
- dist
- .git
- logs
- .env

### Prisma Integration
- Keep prisma generate in a build stage
- Copy only @prisma and .prisma artifacts into the runtime layer to avoid shipping dev tooling

### Alpine Variant Considerations
If switching to Alpine (node:20-alpine), ensure runtime system libs for Prisma are present:
```bash
apk add --no-cache openssl libc6-compat curl
```

### Health Check
A commented-out HEALTHCHECK example is included for orchestrators to automatically restart unhealthy tasks:
```dockerfile
# HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=5s \
#   CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1
```

Healthcheck notes:
- Ping /health with short timeout and low retry count to avoid false positives
- Transitions containers through starting → healthy/unhealthy
- Enforceable by orchestrators
- Keep the HEALTHCHECK snippet commented until monitoring is ready

### CI and Migrations
In CI/production, run database migrations outside the container lifecycle (e.g., a separate job or release step) using:
```bash
npx prisma migrate deploy
```

For registry caching and layer reuse to speed up pipelines with multi-stage builds:
- Docker's layer caching works by reusing unchanged layers from previous builds
- Pin builder and runtime variants consistently (e.g., node:20-slim)
- Use multi-stage builds to separate build dependencies from runtime

### Quick Reference
For convenience, see:
- [DOCKER_RUNBOOK.md](DOCKER_RUNBOOK.md) - 30-second verification checklist
- [Makefile](Makefile) - One-command operations (use `make help` for self-documenting targets)

### Makefile Niceties
- All targets are marked as .PHONY to prevent timestamp surprises
- Self-documenting help target shows all available commands
- Consistent BuildKit usage for CI and local development

## Multi-Runtime Notes

If your team uses different container runtimes locally (Colima, Podman, etc.), include this one-liner before build/run commands:

```bash
# For Colima users
docker context use colima

# For Podman users
export DOCKER_HOST=unix:///var/run/user/$(id -u)/podman/podman.sock
```

This ensures consistent behavior across different development environments.

## When to Choose Which

| Scenario | Recommendation | Reason |
|----------|----------------|---------|
| Security/daemonless | Podman rootless | Docker-like but daemonless, emphasizes least-privilege |
| macOS without Docker Desktop | Colima | Lightweight Linux VM with Docker/containerd backends |
| Containerd-native | nerdctl | Docker-compatible CLI over containerd and BuildKit |
| No Dockerfile needed | Buildpacks or Nixpacks | Turn source into OCI images automatically |
| Kubernetes dev loop | kind | Local multi-node cluster for validating manifests |
| Skip local containers | PM2 + Render/Cloud Run | Simple local management and deployment |

## Migration Notes

- Update documentation and scripts to use the chosen runtime/CLI
- Adjust CI/CD to build with pack or nixpacks as appropriate
- Train the team on operational differences (rootless behavior, VM lifecycle, builder selection)

## Development Workflow Improvements

The package.json includes a pre-dev hook that automatically frees port 3000 before starting the development server:
```json
"predev": "kill-port 3000 || true"
```

This ensures the port is always available when starting the dev server and prevents stale listeners from previous stacks.

## Reference Documentation

- [Docker's multi-stage docs and best practices](https://docs.docker.com/build/building/multi-stage/)
- [Prisma in containers guide](https://www.prisma.io/docs/guides/deployment/deploying-to-containers)
- [Good .dockerignore template for Node projects](https://github.com/github/gitignore/blob/main/Node.gitignore)