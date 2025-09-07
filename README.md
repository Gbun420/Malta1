# Vertical Malta Classifieds

This is the MVP for a vertical classifieds platform in Malta, focusing on high-value electronics.

## Quick Start

For detailed instructions, see [QUICK_START.md](QUICK_START.md)

### Local Development
```bash
npm install
cp .env.example .env  # Update with your configuration
npm run dev
```

### Docker Deployment
```bash
DOCKER_BUILDKIT=1 docker build -t app:local .
docker run --rm -p 3000:3000 --env-file .env app:local
```

### PM2 Deployment
```bash
pm2 start ecosystem.config.js
```

## How to run locally (Detailed)

1.  Install dependencies:
    ```
    npm install
    ```
2.  Create a `.env` file and populate it with the required secrets (see `.env.example`).
3.  Run the development server:
    ```
    npm run dev
    ```
4.  Run tests:
    ```
    npm run test
    ```

## Verification

Check that the application is running correctly:
```bash
# Health check
curl -fsS http://localhost:3000/health || echo "Health check failed"

# Prisma client check
node -e "require('@prisma/client'); console.log('prisma ok')"
```