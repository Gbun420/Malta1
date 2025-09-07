
# API Contract

This document defines the API endpoints and request/response contracts for the Vertical Malta Classifieds platform.

**Authentication:** All API requests must include a valid JSON Web Token (JWT) in the `Authorization` header: `Authorization: Bearer <token>`.

**Pagination:** List endpoints support pagination using `limit` and `offset` query parameters. Default `limit` is 20.

## Listings

### `POST /listings`

Create a new listing.

*   **Request Body:**
    ```json
    {
        "title": "string",
        "description": "string",
        "price": "integer",
        "category": "string",
        "condition": "string",
        "brand": "string",
        "model": "string",
        "serial_number": "string"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
        "id": "integer",
        "title": "string",
        "status": "pending_review"
    }
    ```

### `GET /listings`

Search for listings with filters.

*   **Query Parameters:** `category`, `price_min`, `price_max`, `condition`, `limit`, `offset`
*   **Response (200 OK):**
    ```json
    {
        "listings": [
            {
                "id": "integer",
                "title": "string",
                "price": "integer",
                "condition": "string",
                "thumbnail_url": "string"
            }
        ],
        "total": "integer"
    }
    ```

### `GET /listings/{id}`

Get a single listing.

*   **Response (200 OK):**
    ```json
    {
        "id": "integer",
        "title": "string",
        "description": "string",
        "price": "integer",
        "category": "string",
        "condition": "string",
        "brand": "string",
        "model": "string",
        "seller": {
            "id": "integer",
            "name": "string",
            "verification_status": "string"
        },
        "media": [
            {"url": "string", "type": "string"}
        ]
    }
    ```

### `PUT /listings/{id}`

Update a listing.

*   **Request Body:** Same as `POST /listings`
*   **Response (200 OK):** The updated listing object.

### `DELETE /listings/{id}`

Delete a listing.

*   **Response (204 No Content)**

## Messaging

### `GET /listings/{id}/messages`

Get the message thread for a listing.

*   **Response (200 OK):**
    ```json
    {
        "messages": [
            {
                "id": "integer",
                "sender_id": "integer",
                "content": "string",
                "created_at": "timestamp"
            }
        ]
    }
    ```

### `POST /listings/{id}/messages`

Send a message in a thread.

*   **Request Body:**
    ```json
    {
        "content": "string"
    }
    ```
*   **Response (201 Created):** The created message object.

## Verification

### `GET /users/{id}/verification`

Get the verification status of a user.

*   **Response (200 OK):**
    ```json
    {
        "user_id": "integer",
        "status": "string"
    }
    ```

### `POST /verification`

Submit documents for verification.

*   **Request Body:** (Multipart form data with document upload)
*   **Response (202 Accepted):**
    ```json
    {
        "status": "pending"
    }
    ```
