# syntax=docker/dockerfile:1.6
# This Dockerfile uses BuildKit features (cache mounts, heredocs, etc.)
# Build with: DOCKER_BUILDKIT=1 docker build -t app:local .

############################################
# 1) Dependencies + build (with prisma generate)
############################################
FROM node:20-slim AS deps
WORKDIR /app

# Install system deps once (curl optional for healthcheck in final stage)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Copy only lockfiles first to maximize cache
COPY package*.json ./

# Install full deps (incl. dev) with cache mount for speed
# The --mount=type=cache,target=/root/.npm uses BuildKit cache mounts for faster installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source and build
COPY . .

# Generate Prisma client at build time (dev dep "prisma" is available here)
# If using Prisma, ensure schema.prisma exists in the repo.
RUN npx prisma generate

# Build TS → JS
RUN npm run build

############################################
# 2) Production runtime (non-root, slim)
############################################
FROM node:20-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN useradd -r -u 10001 -g root -m app && chown -R app:root /app
USER app

# Copy only what we need
COPY package*.json ./

# Install prod deps (preserve generated Prisma artifacts by copying later)
# Use cache for speed; omit dev deps
# The --mount=type=cache,target=/root/.npm uses BuildKit cache mounts for faster installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --audit=false --fund=false

# Bring over built app and generated Prisma client files
COPY --from=deps /app/dist ./dist
# Prisma artifacts live in node_modules and @prisma/client
# If you generated in deps stage, just copy the artifacts
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# (Optional) Minimal healthcheck using curl installed in deps step (reinstall if desired)
# HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
#   CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1

EXPOSE 3000
CMD ["node", "dist/index.js"]