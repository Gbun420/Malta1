
-- Enums
CREATE TYPE verification_status AS ENUM ('not_verified', 'pending', 'verified', 'rejected');
CREATE TYPE listing_status AS ENUM ('pending_review', 'active', 'sold', 'deleted');
CREATE TYPE dispute_state AS ENUM ('pending', 'paid', 'shipped', 'completed', 'disputed', 'refunded');
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Tables
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "phone_number" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Verification" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "status" verification_status NOT NULL DEFAULT 'not_verified',
    "document_type" TEXT,
    "document_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Listing" (
    "id" SERIAL PRIMARY KEY,
    "seller_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "condition" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "serial_number" TEXT,
    "status" listing_status NOT NULL DEFAULT 'pending_review',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Media" (
    "id" SERIAL PRIMARY KEY,
    "listing_id" INTEGER NOT NULL REFERENCES "Listing"("id"),
    "url" TEXT NOT NULL,
    "type" media_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "listing_id" INTEGER NOT NULL REFERENCES "Listing"("id"),
    "sender_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "receiver_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Transaction" (
    "id" SERIAL PRIMARY KEY,
    "listing_id" INTEGER NOT NULL REFERENCES "Listing"("id"),
    "buyer_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "seller_id" INTEGER NOT NULL REFERENCES "User"("id"),
    "amount" INTEGER NOT NULL,
    "status" dispute_state NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AuditLog" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "User"("id"),
    "action" TEXT NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX ON "Verification" ("user_id");
CREATE INDEX ON "Listing" ("seller_id");
CREATE INDEX ON "Listing" ("status");
CREATE INDEX ON "Media" ("listing_id");
CREATE INDEX ON "Message" ("listing_id", "sender_id", "receiver_id");
CREATE INDEX ON "Transaction" ("listing_id");
CREATE INDEX ON "Transaction" ("buyer_id");
CREATE INDEX ON "Transaction" ("seller_id");
