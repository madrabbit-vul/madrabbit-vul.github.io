# Business Logic Vulnerabilities — Vulnerability Principles

## What are Business Logic Vulnerabilities?

Business Logic Vulnerabilities occur when an application's business process design has flaws, allowing attackers to achieve unintended results through legitimate operation combinations or parameter tampering. Unlike traditional technical vulnerabilities, business logic flaws exploit business rule gaps rather than injection or bypass techniques.

The core problem: **The server trusts business parameters from the client without performing consistency validation against business rules server-side.**

---

## 1. Price Tampering

The order API accepts the product price as a request parameter from the frontend. The server uses the submitted price directly without validating it against the database price. Attackers can intercept requests and modify the price field.

---

## 2. Coupon Abuse

The coupon checkout API accepts an array of coupon codes but does not deduplicate or limit the quantity. Attackers can submit the same coupon multiple times (e.g., `["VIP50", "VIP50", "VIP50", "VIP50", "VIP50", "VIP50"]`) to accumulate discounts beyond the original price.

---

## 3. Process Skip

The order confirmation API does not validate the payment status. Attackers can skip the payment step and directly call the confirmation API. The normal flow should be: Create → Pay → Confirm, but since confirmation doesn't check the `paid` field, attackers can: Create → Confirm (skip payment).
