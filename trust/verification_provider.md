
# Verification Provider Integration

This document outlines the plan for integrating with a third-party identity verification provider and the manual fallback process.

## 1. Provider Options

We will evaluate the following providers for identity verification:

*   **Stripe Identity:** A good option if we are already using Stripe for payments.
*   **Veriff:** A standalone provider with a strong feature set.
*   **Onfido:** Another popular provider with a focus on AI-powered verification.

## 2. Integration Plan

1.  **SDK Integration:** We will integrate the chosen provider's SDK into our client-side application.
2.  **Webhook Handling:** We will set up a webhook endpoint on our server to receive verification status updates from the provider.
3.  **Status Updates:** When we receive a webhook, we will update the user's verification status in our database.

## 3. Manual Fallback Workflow

In the early stages, we will have a manual fallback process for users who are unable to complete the automated verification.

1.  **User Request:** The user will contact our support team to request a manual verification.
2.  **Document Submission:** The user will securely upload their ID document and a selfie to a dedicated, access-controlled folder.
3.  **Manual Review:** A trained member of our ops team will manually review the documents.
4.  **Status Update:** The ops team member will manually update the user's verification status in our admin panel.

## 4. GDPR & Data Retention

*   **Data Minimization:** We will only collect the data that is strictly necessary for verification.
*   **Retention Schedule:** All verification artifacts (ID scans, selfies) will be permanently deleted from our systems and the provider's systems within 30 days of the verification being completed.
