
# Analytics Metrics

This document defines the key liquidity and trust metrics for the platform.

## Liquidity KPIs

*   **Search-to-Fill:** The percentage of searches that result in a successful transaction.
    *   **Formula:** `(Number of successful transactions / Number of searches) * 100`

*   **Purchase Rate:** The percentage of listing views that result in a purchase.
    *   **Formula:** `(Number of successful transactions / Number of listing views) * 100`

*   **Sell-Through Rate:** The percentage of listings that are sold within a specific timeframe (e.g., 30 days).
    *   **Formula:** `(Number of sold listings / Number of total listings) * 100`

*   **Time-to-First-Response:** The median time it takes for a seller to respond to a buyer's first message.

*   **Repeat Buyer/Seller Rate:** The percentage of users who complete more than one transaction in a 90-day period.

*   **Response-Quality Score:** A user-rated score (1-5) on the quality of communication with the other party.

## Weekly Targets (First 8 Weeks)

| Week | Search-to-Fill | Sell-Through Rate (30d) | Time-to-First-Response |
|---|---|---|---|
| 1 | 1% | 5% | < 48 hours |
| 2 | 2% | 10% | < 36 hours |
| 3 | 3% | 15% | < 36 hours |
| 4 | 4% | 20% | < 24 hours |
| 5 | 5% | 25% | < 24 hours |
| 6 | 6% | 30% | < 12 hours |
| 7 | 8% | 35% | < 12 hours |
| 8 | 10% | 40% | < 8 hours |

## Dashboard Wireframes

### Liquidity Dashboard

*   **Top-line Metrics:** Search-to-Fill, Sell-Through Rate, Time-to-First-Response.
*   **Charts:**
    *   Weekly trend of each KPI.
    *   Breakdown of Sell-Through Rate by category.
    *   Breakdown of Time-to-First-Response by locality.

### Trust & Safety Dashboard

*   **Top-line Metrics:** KYC Completion Rate, Dispute Rate, Resolution Time.
*   **Charts:**
    *   Weekly trend of each KPI.
    *   Breakdown of Dispute Rate by category.
