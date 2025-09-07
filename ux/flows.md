
# Mobile-First UX Flows

This document describes the core user flows for the mobile web experience.

## 1. Onboarding Flow

**Goal:** Get the user to create an account and understand the next steps.

*   **Step 1: Welcome Screen**
    *   **Annotation:** Logo, tagline ("The safest way to buy and sell electronics in Malta"), "Sign Up" button, "Log In" link.
*   **Step 2: Sign Up Form**
    *   **Annotation:** Fields for Email, Password. "Sign Up" button. Link to Terms of Service and Privacy Policy.
*   **Step 3: Email Confirmation**
    *   **Annotation:** Message: "We've sent a confirmation link to your email. Please check your inbox."
*   **Step 4: Post-Confirmation Screen**
    *   **Annotation:** Message: "Your account is created! What would you like to do next?" Buttons: "Browse Listings", "List an Item".

## 2. Listing Creation Flow

**Goal:** Make it fast and easy for a seller to list an item.

*   **Step 1: Start Listing**
    *   **Annotation:** Prompt to enter a title for the listing.
*   **Step 2: Category & Details**
    *   **Annotation:** Fields for Category (pre-selected to Electronics), Brand, Model, Condition. "Next" button.
*   **Step 3: Price & Photos**
    *   **Annotation:** Field for Price. Photo upload component (allowing camera access or gallery selection). "Next" button.
*   **Step 4: Verification Gate**
    *   **Annotation:** If the user is not Level 2 verified, show a message: "To sell items, you need to verify your identity. It only takes a minute." Button: "Verify Now".
*   **Step 5: Review & Submit**
    *   **Annotation:** Summary of the listing. "Submit for Review" button.
*   **Step 6: Confirmation**
    *   **Annotation:** Message: "Your listing is under review. We'll notify you when it's live."

## 3. Search Flow

**Goal:** Help a buyer find the item they are looking for.

*   **Step 1: Browse Screen**
    *   **Annotation:** Grid of listings with thumbnail, title, price. Search bar at the top. Filter icon.
*   **Step 2: Apply Filters**
    *   **Annotation:** A slide-in panel with filter options: Category, Price Range, Condition, Brand.
*   **Step 3: View Listing**
    *   **Annotation:** Tapping a listing opens the full listing detail page.

## 4. Messaging Flow

**Goal:** Enable secure communication between buyer and seller.

*   **Step 1: Contact Seller**
    *   **Annotation:** On the listing page, a "Message Seller" button.
*   **Step 2: Conversation View**
    *   **Annotation:** A chat interface with the conversation history. Text input field at the bottom. Safety warning: "Never share personal details or transact outside the platform."

## 5. Purchase Flow (Escrow Pilot)

**Goal:** Provide a secure way to transact.

*   **Step 1: Buy Now**
    *   **Annotation:** On the listing page, a "Buy Now" button.
*   **Step 2: Confirm & Pay**
    *   **Annotation:** Summary of the purchase (item, price, fees). Fields for credit card details (via Stripe Elements). "Pay Now" button.
*   **Step 3: Payment Confirmation**
    *   **Annotation:** Message: "Payment successful! We've notified the seller to ship the item."
*   **Step 4: Awaiting Shipment**
    *   **Annotation:** A status page showing the transaction status.
*   **Step 5: Confirm Receipt**
    *   **Annotation:** When the item is delivered, the buyer gets a notification to confirm receipt. A "Confirm Receipt" button on the transaction status page.
