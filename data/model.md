# Data Model

This document describes the entities and relationships for the Vertical Malta Classifieds platform.

## Entities

### User

Represents a user of the platform.

*   `id` (Primary Key)
*   `email` (Unique)
*   `password_hash`
*   `phone_number`
*   `created_at`
*   `updated_at`

### Verification

Represents the identity verification status of a user.

*   `id` (Primary Key)
*   `user_id` (Foreign Key to User)
*   `status` (Enum: `not_verified`, `pending`, `verified`, `rejected`)
*   `document_type`
*   `document_url`
*   `created_at`
*   `updated_at`

### Listing

Represents an item listed for sale.

*   `id` (Primary Key)
*   `seller_id` (Foreign Key to User)
*   `title`
*   `description`
*   `price`
*   `category`
*   `condition`
*   `brand`
*   `model`
*   `serial_number`
*   `location` (e.g., "Sliema", "Valletta")
*   `status` (Enum: `pending_review`, `active`, `sold`, `deleted`)
*   `created_at`
*   `updated_at`

### Media

Represents a photo or video associated with a listing.

*   `id` (Primary Key)
*   `listing_id` (Foreign Key to Listing)
*   `url`
*   `type` (Enum: `image`, `video`)
*   `created_at`

### Message

Represents a message in a conversation between two users about a listing.

*   `id` (Primary Key)
*   `listing_id` (Foreign Key to Listing)
*   `sender_id` (Foreign Key to User)
*   `receiver_id` (Foreign Key to User)
*   `content`
*   `created_at`

### Transaction

Represents a transaction for a listing.

*   `id` (Primary Key)
*   `listing_id` (Foreign Key to Listing)
*   `buyer_id` (Foreign Key to User)
*   `seller_id` (Foreign Key to User)
*   `amount`
*   `status` (Enum: `pending`, `paid`, `shipped`, `completed`, `disputed`, `refunded`)
*   `created_at`
*   `updated_at`

### AuditLog

Represents a log of important events for auditing purposes.

*   `id` (Primary Key)
*   `user_id` (Foreign Key to User, optional)
*   `action` (e.g., `user.login`, `listing.create`, `transaction.dispute`)
*   `details` (JSONB)
*   `created_at`

## Relationships

*   A `User` can have many `Listings`.
*   A `User` can have one `Verification`.
*   A `Listing` belongs to one `User` (the seller).
*   A `Listing` can have many `Media` items.
*   A `Listing` can have many `Messages`.
*   A `Listing` can have one `Transaction`.
*   A `Transaction` involves one `Buyer` and one `Seller` (both are `Users`).

## Indexing Notes

*   Index foreign keys (e.g., `Verification.user_id`, `Listing.seller_id`).
*   Index columns used in queries (e.g., `Listing.status`, `Listing.category`, `Listing.price`, `Listing.created_at`, `Listing.location`).
*   Create a composite index on `(sender_id, receiver_id, listing_id)` for the `Message` table to optimize conversation lookups.
*   For cursor-based pagination, an index on `created_at` is essential.