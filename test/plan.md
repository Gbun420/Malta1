
# Test Plan

This document outlines the testing strategy for the MVP.

## 1. Unit Tests

*   **Scope:** Individual functions and components.
*   **Focus:**
    *   **Schema:** Validate the database schema and constraints.
    *   **API:** Test the request/response contracts for each endpoint.
*   **Tools:** Jest

## 2. Integration Tests

*   **Scope:** Interactions between different parts of the system.
*   **Focus:**
    *   **Listing:** The full lifecycle of a listing (create, update, delete).
    *   **Search:** Filtering and pagination.
    *   **Messaging:** Sending and receiving messages.
*   **Tools:** Jest, Supertest

## 3. Smoke Tests

*   **Scope:** Critical end-to-end user flows.
*   **Focus:**
    *   **Payments:** The full payment flow, from intent to capture.
    *   **Verification:** The user verification flow.
*   **Tools:** A lightweight E2E testing framework (e.g., Playwright, Cypress).

## 4. Idempotency & Seed Resets

*   **Idempotency:** For `PUT`, `PATCH`, and `DELETE` tests, we will send the same request multiple times and assert that the outcome is the same.
*   **Seed Resets:** Before each test run, the database will be reset and re-seeded with the data from `scripts/seed.ts` to ensure a consistent test environment.
