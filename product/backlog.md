
# Product Backlog: Vertical Malta Classifieds v0.1

## Epic: User Accounts & Trust

*   **User Story 1:** As a new user, I want to create an account using my email and password, so I can join the platform.
    *   **Acceptance Criteria:** User can register, confirm their email, and log in.
    *   **Instrumentation:** Track user sign-ups, email confirmation rates.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

*   **User Story 2:** As a seller, I want to verify my identity by uploading my ID document, so I can build trust with buyers and list items for sale.
    *   **Acceptance Criteria:** User can access the verification flow, upload their ID, and receive a confirmation or rejection notice.
    *   **Instrumentation:** Track verification completion rate, time to complete verification.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

## Epic: Listing Management

*   **User Story 3:** As a seller, I want to create a new listing with fields for category, brand, model, condition, and price, so I can accurately describe my electronic item.
    *   **Acceptance Criteria:** The listing form includes all necessary fields and is easy to use. The listing is created in a "pending review" state.
    *   **Instrumentation:** Track number of new listings created, time to create a listing.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

*   **User Story 4:** As an ops team member, I want to review new listings and approve or reject them, so I can maintain the quality and safety of the marketplace.
    *   **Acceptance Criteria:** An admin interface exists to view, approve, and reject listings. Rejections trigger a notification to the seller.
    *   **Instrumentation:** Track number of listings reviewed, approval/rejection rate.
    *   **Owner:** Engineering
    *   **Parallelizable:** No

## Epic: Discovery & Search

*   **User Story 5:** As a buyer, I want to browse all active listings, so I can see what's available on the platform.
    *   **Acceptance Criteria:** A gallery or list view of all approved listings is available.
    *   **Instrumentation:** Track number of unique visitors to the browse page.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

*   **User Story 6:** As a buyer, I want to filter listings by category, price range, and condition, so I can find the specific item I'm looking for.
    *   **Acceptance Criteria:** The browse page includes functional filters that update the list of results.
    *   **Instrumentation:** Track usage of each filter.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

## Epic: Messaging & Communication

*   **User Story 7:** As a user, I want to send and receive messages with other users on the platform, so I can ask questions and negotiate transactions.
    *   **Acceptance Criteria:** A real-time messaging interface is available on each listing page. Users receive notifications for new messages.
    *   **Instrumentation:** Track number of messages sent, time to first response.
    *   **Owner:** Product
    *   **Parallelizable:** Yes

## Epic: Transactions (Buy/Book Pilot)

*   **User Story 8:** As a buyer, I want to purchase an item using a secure on-platform payment system, so I can be protected from scams.
    *   **Acceptance Criteria:** A "Buy Now" button is available on pilot listings. Users can pay with a credit card via a third-party payment provider (e.g., Stripe).
    *   **Instrumentation:** Track number of completed transactions, payment success/failure rates.
    *   **Owner:** Engineering
    *   **Parallelizable:** No

*   **User Story 9:** As a seller, I want to receive my payout after a successful transaction, so I can get my money.
    *   **Acceptance Criteria:** Payouts are automatically processed to the seller's bank account after the buyer confirms receipt.
    *   **Instrumentation:** Track payout processing times, payout failure rates.
    *   **Owner:** Engineering
    *   **Parallelizable:** No
