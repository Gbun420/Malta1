
# Payment Flows

This document describes the payment flows for the platform, with a focus on PSD2/SCA compliance.

## 1. Create Payment Intent

When a buyer clicks "Buy Now", the client will make a request to our server to create a payment intent with our payment provider (e.g., Stripe).

*   **Endpoint:** `POST /v1/payments/intent`
*   **Request Body:**
    ```json
    {
        "listing_id": "integer",
        "amount": "integer"
    }
    ```
*   **Response:** A client secret for the payment intent.

## 2. 3D Secure 2 (3DS2) Authentication

The client will use the client secret to confirm the payment with the payment provider. This will trigger the 3DS2 authentication flow.

*   **Frictionless Flow:** If the transaction is low-risk, the authentication will happen in the background without any user interaction.
*   **Step-up Flow:** If the transaction is high-risk, the user will be prompted to complete a challenge (e.g., a one-time code sent to their phone).
*   **Failure Fallback:** If the authentication fails, the client will display a user-friendly error message and prompt the user to try a different payment method.

## 3. Capture & Refund

*   **Capture:** Once the payment is authenticated, the funds will be captured. The server will receive a webhook from the payment provider confirming the successful payment.
*   **Refund:** If a dispute is resolved in favor of the buyer, we will issue a full or partial refund via the payment provider's API.

## 4. Payouts

*   **Process:** Payouts to sellers will be processed automatically after the buyer confirms receipt of the item.
*   **Metadata:** All payment intents and transactions will include metadata linking them to the `listing_id` and `seller_id` for tracking and reconciliation.

## 5. Idempotency

All `POST` requests to the payments API will require an `Idempotency-Key` header to prevent duplicate transactions.
