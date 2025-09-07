
# UX Copy

This document contains the UX copy for key user interactions, tuned for a Malta audience.

## Verification Prompts

*   **Initial Prompt:**
    *   **Headline:** "Verify your identity to start selling."
    *   **Body:** "Biex tibda tbigħ, jeħtieġ li nivverifikaw l-identità tiegħek. Huwa proċess ta' malajr u jgħin biex inżommu l-pjattaforma sigura għal kulħadd." (To start selling, we need to verify your identity. It's a quick process and helps keep the platform safe for everyone.)
    *   **Button:** "Start Verification"

*   **Success Message:**
    *   **Headline:** "You're verified!"
    *   **Body:** "Prosit! Issa tista' tibda tbigħ. (Congratulations! You can now start selling.)"

## Listing Form Labels

*   **Title:** "What are you selling?" (e.g., iPhone 14 Pro)
*   **Category:** "Category" (pre-filled with "Electronics")
*   **Brand:** "Brand" (e.g., Apple, Samsung)
*   **Model:** "Model" (e.g., iPhone 14 Pro, Galaxy S23)
*   **Condition:** "Condition" (New, Like New, Used)
*   **Price:** "Price (€)"

## Safety Warnings

*   **In Messaging:**
    *   "**Safety Tip:** Never agree to pay or communicate outside of our platform. Jekk jogħġbok, la taqbilx li tħallas jew tikkomunika barra mill-pjattaforma tagħna." (Please do not agree to pay or communicate outside our platform.)

*   **Before Payment:**
    *   "You are paying securely through our escrow system. We will hold your payment until you confirm you have received the item."

## Dispute Status Updates

*   **Dispute Opened:**
    *   "We've received your dispute. We are now reviewing the case and will contact you within 24 hours."
*   **Awaiting Seller Response:**
    *   "We have notified the seller of the dispute and are awaiting their response."
*   **In Review:**
    *   "Our team is now actively reviewing your case. We appreciate your patience."
*   **Resolved:**
    *   "Your dispute has been resolved. Please check your email for the final decision."

## Accessibility & Validation

*   **Accessibility:** All form fields will have clear labels and ARIA attributes for screen readers. All images will have descriptive alt text.
*   **Validation Rules:**
    *   **Price:** Must be a positive number.
        *   **Error:** "Please enter a valid price."
    *   **Email:** Must be a valid email format.
        *   **Error:** "Please enter a valid email address."
    *   **Password:** Must be at least 8 characters long.
        *   **Error:** "Password must be at least 8 characters long."
*   **Remediation Tips:** Error messages will be displayed inline and will clearly explain how to fix the issue.
