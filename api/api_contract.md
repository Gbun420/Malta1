
# API Contract v1

This document defines the v1 API endpoints and request/response contracts.

**Authentication:** All API requests must include a valid JWT in the `Authorization` header: `Authorization: Bearer <token>`.

**Error Format:**
```json
{
    "error": {
        "code": "string",
        "message": "string"
    }
}
```

## Listings

### `POST /v1/listings`

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
        "serial_number": "string",
        "location": "string"
    }
    ```
*   **Response (201 Created):** The created listing object.

### `GET /v1/listings`

Search for listings with filters.

*   **Query Parameters:** `category`, `price_min`, `price_max`, `condition`, `location`, `limit`, `cursor`
*   **Response (200 OK):**
    ```json
    {
        "data": [
            {
                "id": "integer",
                "title": "string",
                "price": "integer",
                "condition": "string",
                "thumbnail_url": "string"
            }
        ],
        "pagination": {
            "next_cursor": "string",
            "has_next_page": "boolean"
        }
    }
    ```

### `GET /v1/listings/{id}`

Get a single listing.

*   **Response (200 OK):** The listing object.

### `PUT /v1/listings/{id}`

Update a listing.

*   **Request Body:** Same as `POST /v1/listings`
*   **Response (200 OK):** The updated listing object.

### `DELETE /v1/listings/{id}`

Delete a listing.

*   **Response (204 No Content)**

## Messaging

### `GET /v1/listings/{id}/messages`

Get the message thread for a listing.

*   **Query Parameters:** `limit`, `cursor`
*   **Response (200 OK):**
    ```json
    {
        "data": [
            {
                "id": "integer",
                "sender_id": "integer",
                "content": "string",
                "created_at": "timestamp"
            }
        ],
        "pagination": {
            "next_cursor": "string",
            "has_next_page": "boolean"
        }
    }
    ```

### `POST /v1/listings/{id}/messages`

Send a message in a thread.

*   **Request Body:**
    ```json
    {
        "content": "string"
    }
    ```
*   **Response (201 Created):** The created message object.

## Moderation

### `POST /v1/listings/{id}/report`

Report a listing.

*   **Request Body:**
    ```json
    {
        "reason": "string",
        "description": "string"
    }
    ```
*   **Response (202 Accepted):**
    ```json
    {
        "message": "Report received. Our team will review it shortly."
    }
    ```

### `POST /v1/messages/{id}/report`

Report a message.

*   **Request Body:**
    ```json
    {
        "reason": "string"
    }
    ```
*   **Response (202 Accepted):**
    ```json
    {
        "message": "Report received. Our team will review it shortly."
    }
    ```

## Notes

*   **Rate Limiting:** A rate limit of 100 requests per minute will be applied to all endpoints.
*   **Idempotency:** `PUT`, `PATCH`, and `DELETE` requests are idempotent. `POST` requests are not.
*   **Request Validation:** The API will validate requests against the defined schema and return a `400 Bad Request` with a descriptive error message for any validation failures.
