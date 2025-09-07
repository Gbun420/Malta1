# Quick Start Guide

This guide provides copy-paste commands to run the web app in development, with Docker, or via PM2, plus a 30-second verification step.

## Quick Answer

- **For local dev**: `npm run dev`, then open http://localhost:3000/health and expect 200 OK
- **With Docker**: `DOCKER_BUILDKIT=1 docker build -t app:local . && docker run --rm -p 3000:3000 --env-file .env app:local`
- **With PM2**: `pm2 start ecosystem.config.js`

## Local Development

### Start Development Server
```bash
npm run dev
```

This command:
- Uses `ts-node` to run the TypeScript application directly
- Automatically kills any process using port 3000 before starting (via predev hook)
- Runs the application on http://localhost:3000

### Alternative Development Ports
```bash
# Run on port 4000
npm run dev:4000
```

### Verification
```bash
# Check health endpoint
curl -fsS http://localhost:3000/health || echo "Health check failed"
```

## Docker Run

### Build and Run
```bash
# Build with BuildKit for faster builds and better caching
DOCKER_BUILDKIT=1 docker build -t app:local .

# Run the container
docker run --rm -p 3000:3000 --env-file .env app:local
```

### One-liner Build and Run
```bash
DOCKER_BUILDKIT=1 docker build -t app:local . && docker run --rm -p 3000:3000 --env-file .env app:local
```

### Notes
- The `-p 3000:3000` flag publishes the container's port 3000 to the host's port 3000
- `EXPOSE 3000` in the Dockerfile alone does not make the port reachable from outside the container
- `--env-file .env` loads environment variables from the .env file

### Verification
```bash
# Check health endpoint
curl -fsS http://localhost:3000/health || echo "Health check failed"

# Verify Prisma client presence (if bundled)
docker run --rm app:local node -e "require('@prisma/client'); console.log('prisma ok')"
```

## PM2 (No Container)

### Start from Ecosystem File
```bash
pm2 start ecosystem.config.js
```

### Environment Management
```bash
# Start with production environment
pm2 start ecosystem.config.js --env production

# Restart specific app
pm2 restart ecosystem.config.js --only api-server

# View logs
pm2 logs

# Save current process list
pm2 save
```

### Notes
- PM2 can inject environment blocks (`env`, `env_production`) from the ecosystem file
- Switch environments with `--env` flag
- The ecosystem file defines both development and production environments

## 30-Second Verification

### Health Check
```bash
curl -fsS http://localhost:3000/health || echo "Health check failed"
```

### Prisma Client Presence (Optional)
```bash
# For local development
node -e "require('@prisma/client'); console.log('prisma ok')"

# For Docker (if bundled)
docker run --rm app:local node -e "require('@prisma/client'); console.log('prisma ok')"
```

## Environment Variables

Before running the application, ensure you have a `.env` file with the required variables:
```bash
# Copy the example file and fill in the values
cp .env.example .env
```

Required variables:
- DATABASE_URL
- JWT_SECRET

## Notes

- `npm run` executes scripts from package.json
- `npm start` and `npm run dev` are conventions, not special commands unless defined
- The application uses TypeScript and requires compilation for production (`npm run build`)
- PM2 manages the production process with automatic restarts and memory limits