# Launch Checklist

This document outlines the checklist, readiness gates, and rollback plan for the v0.1 launch.

## 1. Readiness Gates

| Area | Owner | SLA | Status | Sign-off Timestamp |
|---|---|---|---|---|
| **Product** | Product Manager | - | Not Started | - |
| **QA** | QA Lead | All P0/P1 bugs resolved | Not Started | - |
| **Ops** | Ops Lead | Moderation & dispute playbooks ready | Not Started | - |
| **Marketing** | Marketing Lead | Launch communications ready | Not Started | - |
| **Data** | Data Analyst | Analytics dashboards live | Not Started | - |
| **Billing** | Engineering Lead | Payment provider integration complete | Not Started | - |

## 2. Soft-Launch Plan

*   **Feature Flags:**
    *   `VERIFICATION_ENABLED`: Controls access to identity verification.
    *   `PURCHASE_ENABLED`: Controls access to the purchase flow.
    *   `PAYOUTS_ENABLED`: Controls access to seller payouts.
*   **Canary Cohort:**
    *   **Phase 1 (Week 1):** Canary release to 10% of new users in Sliema, with `VERIFICATION_ENABLED` and `PURCHASE_ENABLED` flags enabled.
        *   **Success Threshold:** 5% sell-through rate, time-to-first-response < 48 hours.
        *   **Rollback Trigger:** Dispute rate > 10% or any P0 bugs.
    *   **Phase 2 (Week 2):** Expand to 50% of new users in Malta, with `PAYOUTS_ENABLED` flag enabled for a subset of verified sellers.
        *   **Success Threshold:** 10% sell-through rate, time-to-first-response < 36 hours.
        *   **Rollback Trigger:** Dispute rate > 7%.
    *   **Phase 3 (Week 3):** Full launch to 100% of users.
        *   **Success Threshold:** Meet the 8-week success metrics defined in the PRD.
*   **Rollback Switch:** Each feature flag will have a kill switch to immediately disable the feature if critical issues arise.

## 3. Incident Response

*   **On-call Schedule:** A primary and secondary on-call engineer will be scheduled for the first 4 weeks of launch.
*   **Communication Channels:** A dedicated Slack channel (#launch-war-room) will be used for all launch-related communication.
*   **Blameless Postmortem Template:**
    *   **Title:** Postmortem for [Incident]
    *   **Date:**
    *   **Authors:**
    *   **Summary:**
    *   **Impact:**
    *   **Root Cause(s):**
    *   **Action Items:**
    *   **Lessons Learned:**

## 4. Go/No-Go Meeting Agenda

1.  **Review Readiness Gates:** Confirm all gates are green.
2.  **Review Launch Metrics:** Review the latest analytics from `analytics/metrics.md`.
3.  **Final Decision:** A formal go/no-go decision is made by the project lead.

**Links:**
*   [Analytics Dashboard](link-to-dashboard)
*   [Session Log](logs/session.md)