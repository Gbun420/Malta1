# Monetization Integration Plan

This document outlines the integration plan for our hybrid monetization model.

## 1. 90-Day Experiment Plan & Telemetry

*   **Days 1-30: Free for All**
    *   **Goal:** Drive initial adoption and gather baseline data.
    *   **Telemetry:** Track `create_listing` and `view_listing` events to understand user engagement.

*   **Days 31-60: Introduce Paid Listings & Placements**
    *   **Goal:** Test the take-rate of paid features.
    *   **A/B Cells:**
        *   **Cell A (Control):** Current pricing (€5 Plus, €10 Premium, €3 Bump).
        *   **Cell B (Discount):** 50% off all paid features.
    *   **Telemetry:** Track `purchase_feature` events with `feature_name` and `price` parameters.

*   **Days 61-90: Introduce Commission & Test Cannibalization**
    *   **Goal:** Measure the impact of the commission on the take-rate of paid listings.
    *   **A/B Cells:**
        *   **Cell A (Commission Only):** 5% commission, no paid listing tiers.
        *   **Cell B (Hybrid):** 5% commission + paid listing tiers.
    *   **Telemetry:** Track `capture_transaction` events with `commission_amount` and `listing_tier` parameters.

## 2. Cannibalization Checks

We will monitor the following to check for cannibalization between listing fees and commission revenue:

*   **Revenue per Listing:** Does the total revenue per listing (listing fee + commission) increase or decrease in the hybrid model?
*   **Seller Behavior:** Do sellers who pay for a premium listing generate more or less in commission revenue?

## 3. Price Points & Success Criteria

| Feature | Price Point | Success Criteria (90 days) |
|---|---|---|
| **Plus Listing** | €5 | 5% of new listings choose this tier. |
| **Premium Listing** | €10 | 2% of new listings choose this tier. |
| **Featured Placement** | €3 | 10% of sellers use this feature at least once. |
| **Commission** | 5% | 50% of transactions are completed using the escrow service. |