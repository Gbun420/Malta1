# Trust, Safety, and Logistics Rails

This document outlines the trust, safety, and logistics mechanisms for the platform, with a focus on regulatory compliance and user protection.

## 1. Identity Verification (KYC)

We will implement a tiered KYC system to balance user friction with regulatory requirements.

*   **Tier 1 (Basic KYC):** Required for all sellers.
    *   **Collection:** Full name, date of birth, and address. ID document scan (e.g., Maltese ID card, passport) and a liveness check (selfie).
    *   **Purpose:** To comply with basic customer due diligence (CDD) requirements.

*   **Tier 2 (Enhanced KYC):** Required for sellers who meet certain risk or value thresholds.
    *   **Triggers:** Selling items over €1,000 in a single transaction, or a total of €2,000 in a 30-day period. Also triggered by suspicious activity flags.
    *   **Collection:** Proof of address (e.g., utility bill) and source of funds declaration.
    *   **Purpose:** To comply with enhanced due diligence (EDD) requirements under AML/CFT regulations.

## 2. Listing Verification (High-Value Electronics)

*   **Process:** All listings for high-value electronics will undergo a manual review, which includes:
    *   Verifying proof of purchase.
    *   Checking the serial number against a database of stolen goods.
    *   Reviewing a short video of the item to verify its condition.
*   **SLA:** All new listings will be reviewed within 12 hours.

## 3. On-Platform Messaging

*   **Functionality:** All communication must be on-platform. The system will include a `POST /v1/messages/{id}/report` endpoint to allow users to flag suspicious messages.
*   **Moderation:** Reports will be reviewed by the ops team within 24 hours.

## 4. Escrow & Payments (PSD2/SCA Compliant)

Our on-platform payment system will be fully compliant with PSD2 and Strong Customer Authentication (SCA).

*   **3D Secure 2 (3DS2):** All card payments will be processed using 3DS2, which provides a layer of security for online card transactions.
*   **Step-up Authentication:** If a transaction is deemed high-risk by the card issuer, the user will be prompted to complete a "step-up" authentication (e.g., a one-time code sent to their phone).
*   **Dispute Resolution SLAs:**
    *   **Initial Response:** All disputes will receive an initial response from our team within 24 hours.
    *   **Evidence Collection:** Both parties will have 72 hours to submit evidence.
    *   **Resolution:** A final decision will be made within 7 days of the dispute being raised.

## 5. GDPR & Data Minimization

We are committed to protecting our users' data and complying with GDPR.

*   **Data Minimization:** We will only collect the data that is strictly necessary for the functioning of the platform.
*   **Retention Windows:**
    *   Verification artifacts (ID scans, selfies) will be deleted within 30 days of the verification being completed.
    *   Transaction data will be retained for 5 years to comply with AML regulations.
*   **DPIA Triggers:** A Data Protection Impact Assessment (DPIA) will be conducted before implementing any new features that involve the processing of sensitive personal data.
*   **Deletion Routines:** Users can request the deletion of their data at any time, and we will have a documented process for handling these requests.

## 6. AML/CFT Compliance

We will implement a risk-based approach to Anti-Money Laundering and Countering the Financing of Terrorism.

*   **Customer Due Diligence (CDD):** Basic CDD will be performed on all sellers (see Tier 1 KYC).
*   **Enhanced Due Diligence (EDD):** EDD will be performed on high-risk sellers (see Tier 2 KYC).
*   **Suspicious Activity Reporting:** All suspicious activity will be reported to the Financial Intelligence Analysis Unit (FIAU) in Malta.
*   **Progressive Rollout:** We will start with a manual CDD/EDD process and progressively automate it as the platform grows.