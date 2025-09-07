# Mobile-First UI Components and Accessibility Notes

This document describes the core UI components for the mobile-first experience, with a focus on WCAG 2.2 mobile guidance.

## 1. Onboarding

### Welcome Screen

*   **Description:** Full-screen splash with logo, tagline, and primary call-to-action buttons.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Clear, concise text for buttons (e.g., "Sign Up", "Log In").
    *   **Target Size:** Buttons will have a minimum touch target of 44x44 CSS pixels.
    *   **Focus Order:** Logical tab order for screen readers.

### Sign Up/Log In Forms

*   **Description:** Standard input fields for email, password, etc.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Always visible labels for input fields (not just placeholders).
    *   **Input Purpose:** Use `autocomplete` attributes (e.g., `autocomplete="email"`) for appropriate fields.
    *   **Error States:** Inline error messages that are clearly visible and programmatically associated with the input field (e.g., using `aria-describedby`).
    *   **Focus Order:** Logical tab order.

## 2. Listing Creation

### Listing Form

*   **Description:** Multi-step form for creating a listing, including text inputs, number inputs, and image/video uploads.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Clear, persistent labels for all form fields.
    *   **Input Purpose:** Use appropriate `type` attributes for number inputs (`type="number"`).
    *   **Error States:** Real-time inline validation with clear error messages.
    *   **Focus Order:** Logical flow through the form.
    *   **Image Upload:** Provide clear instructions for image upload. Ensure `alt` text is available for uploaded images.

## 3. Search & Detail

### Search Bar & Filters

*   **Description:** Prominent search bar with a filter icon.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Clear `aria-label` for the search input.
    *   **Target Size:** Filter icon/button will have a minimum touch target of 44x44 CSS pixels.
    *   **Focus Order:** Search bar is easily accessible.

### Listing Detail Page

*   **Description:** Displays all details of a listing, including images, description, price, and seller information.
*   **WCAG 2.2 Notes:**
    *   **Image Carousel:** Ensure images are navigable and have descriptive `alt` text.
    *   **Text Contrast:** Sufficient color contrast for all text elements.
    *   **Headings:** Use semantic headings (h1, h2, etc.) for proper document structure.

## 4. Messaging

### Chat Interface

*   **Description:** Displays message history and an input field for new messages.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Clear label for the message input field.
    *   **Focus Order:** Input field is easily accessible.
    *   **Live Regions:** Use `aria-live` regions for new messages to be announced by screen readers.

## 5. Checkout

### Payment Form

*   **Description:** Secure form for entering payment details.
*   **WCAG 2.2 Notes:**
    *   **Labels:** Persistent labels for all payment fields.
    *   **Input Purpose:** Use `autocomplete` for credit card fields (e.g., `cc-number`, `cc-exp`).
    *   **Error States:** Clear, inline error messages for invalid input.
    *   **Early Cost Clarity:** Clearly display the total price, including all fees, before the user commits to payment.
    *   **Form Resilience:** Ensure form data is preserved across keyboard interactions and screen rotations.

## 6. Empty & Error States

*   **Description:** Visuals and text displayed when there's no content or an error occurs.
*   **WCAG 2.2 Notes:**
    *   **Clear Next Actions:** Provide actionable buttons or links (e.g., "List an Item", "Try Again").
    *   **Error Identification:** Error messages are clearly visible and provide remediation tips.
    *   **Programmatic Association:** Errors are programmatically associated with the relevant context.

## 7. Payouts UX (Feature Flagged)

*   **Description:** UI for sellers to manage their payouts and connect their bank accounts (if `PAYOUTS_ENABLED` is true).
*   **WCAG 2.2 Notes:**
    *   **Conditional Visibility:** Ensure the entire section is hidden if the feature flag is off, and only visible when enabled.
    *   **Stripe Embedded Components:** If using Stripe Connect embedded components, ensure they adhere to accessibility standards.