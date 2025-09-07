# Integration Tests with Testcontainers

This document outlines the recommended approach for implementing integration tests using Testcontainers to ensure reliable testing against real database instances.

## Overview

Integration tests should run against ephemeral PostgreSQL instances using Testcontainers to:
- Ensure tests are isolated and repeatable
- Validate Prisma queries against a real database
- Prevent environment-specific issues
- Enable CI/CD pipeline execution

## Setup

### Prerequisites

1. Install Docker (required for Testcontainers)
2. Add Testcontainers dependencies:

```bash
npm install --save-dev testcontainers
```

### Test Structure

Create integration tests in the `test/integration` directory:

```
test/
├── unit/
├── integration/
│   ├── database.test.ts
│   ├── user.test.ts
│   └── listing.test.ts
```

### Example Test

```typescript
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';

describe('Database Integration', () => {
  let container: StartedTestContainer;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new GenericContainer('postgres:13')
      .withEnvironment({
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpass',
        POSTGRES_DB: 'testdb'
      })
      .withExposedPorts(5432)
      .start();

    // Configure Prisma to use the container
    const databaseUrl = `postgresql://testuser:testpass@${container.getHost()}:${container.getMappedPort(5432)}/testdb`;
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });

    // Run migrations
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255)
    )`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await container.stop();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });

    expect(user.email).toBe('test@example.com');
  });
});
```

## CI/CD Integration

Add the following to your CI pipeline (GitHub Actions example):

```yaml
integration-test:
  runs-on: ubuntu-latest
  services:
    docker:
      image: docker:20.10.16-dind
      options: --privileged
  steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Run integration tests
      run: npm run test:integration
      env:
        DOCKER_HOST: tcp://localhost:2375
```

## Running Tests Locally

Add scripts to package.json:

```json
{
  "scripts": {
    "test:integration": "jest --testPathPattern=integration",
    "test:integration:watch": "jest --watch --testPathPattern=integration"
  }
}
```

Run integration tests:

```bash
npm run test:integration
```

## Best Practices

1. **Isolation**: Each test suite should start with a fresh container
2. **Cleanup**: Always stop containers in afterAll hooks
3. **Performance**: Reuse containers when possible for faster test runs
4. **Configuration**: Use environment variables for container configuration
5. **Migrations**: Apply database migrations at the start of test suites
6. **Parallelization**: Configure Jest to run integration tests sequentially to avoid port conflicts

## Troubleshooting

### Docker Permission Issues

If you encounter permission issues with Docker:

```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER

# Restart Docker service
sudo systemctl restart docker
```

### Container Start Failures

If containers fail to start:

1. Check Docker is running: `docker info`
2. Verify sufficient system resources
3. Check for port conflicts
4. Review container logs: `docker logs <container-id>`

### Network Issues

For network-related issues:

1. Ensure containers can access the host network
2. Use appropriate network modes for containers
3. Check firewall settings