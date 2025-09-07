
# CI Pipeline

This document describes the continuous integration pipeline for the project.

## 1. Pipeline Configuration (e.g., GitHub Actions)

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

## 2. Gemini CLI Guardrails

*   **Checkpointing:** Before making any significant changes to the codebase, we will use the Gemini CLI's checkpointing feature to save the current state of the project.
*   **Restore:** If a change introduces a bug or an unintended side effect, we can use the `/restore` command to revert to the last known good checkpoint.
