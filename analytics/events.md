
# Analytics Events

This document defines the event taxonomy for the platform, following GA4-style naming conventions.

**ID Strategy:** All events will include a `user_id` (if the user is logged in) and a unique `session_id`.

**Sampling:** For high-volume events, we will use a 10% sampling rate in our analytics platform.

## Marketplace Funnel Events

*   **Event Name:** `create_listing`
    *   **Parameters:** `listing_id`, `category`, `price`
    *   **Example Payload:** `{ "event": "create_listing", "user_id": 123, "listing_id": 456, "category": "electronics", "price": 500 }`

*   **Event Name:** `view_listing`
    *   **Parameters:** `listing_id`, `category`, `seller_id`
    *   **Example Payload:** `{ "event": "view_listing", "user_id": 456, "listing_id": 789, "category": "electronics", "seller_id": 123 }`

*   **Event Name:** `contact_seller`
    *   **Parameters:** `listing_id`, `seller_id`
    *   **Example Payload:** `{ "event": "contact_seller", "user_id": 456, "listing_id": 789, "seller_id": 123 }`

*   **Event Name:** `seller_reply`
    *   **Parameters:** `listing_id`, `buyer_id`
    *   **Example Payload:** `{ "event": "seller_reply", "user_id": 123, "listing_id": 789, "buyer_id": 456 }`

*   **Event Name:** `create_purchase_intent`
    *   **Parameters:** `listing_id`, `amount`
    *   **Example Payload:** `{ "event": "create_purchase_intent", "user_id": 456, "listing_id": 789, "amount": 500 }`

*   **Event Name:** `capture_transaction`
    *   **Parameters:** `transaction_id`, `listing_id`, `amount`
    *   **Example Payload:** `{ "event": "capture_transaction", "user_id": 456, "transaction_id": 101, "listing_id": 789, "amount": 500 }`

## Trust & Safety Events

*   **Event Name:** `start_kyc`
    *   **Parameters:** `user_id`

*   **Event Name:** `complete_kyc`
    *   **Parameters:** `user_id`, `status` (`verified` or `rejected`)

*   **Event Name:** `submit_report`
    *   **Parameters:** `report_type`, `reported_id` (listing or user ID)

*   **Event Name:** `open_dispute`
    *   **Parameters:** `transaction_id`

*   **Event Name:** `resolve_dispute`
    *   **Parameters:** `transaction_id`, `resolution` (`refunded`, `paid_out`)

## Moderation Events

*   **Event Name:** `moderate_content`
    *   **Parameters:** `content_id`, `action` (`approved`, `rejected`)
