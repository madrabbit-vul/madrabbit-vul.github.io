# Business Logic Vulnerabilities — Vulnerability Protection

---

## 1. Price Tampering Protection

### Server-side Price Validation

```java
// Use database price, ignore frontend price parameter
Product product = productRepository.findById(productId);
Double actualPrice = product.getPrice();
Double totalPrice = actualPrice * quantity;
```

---

## 2. Coupon Abuse Protection

### Deduplication and Quantity Limits

```java
Set<String> uniqueCoupons = new HashSet<>(couponCodes);
if (uniqueCoupons.size() > MAX_COUPONS_PER_ORDER) {
    throw new BusinessException("Too many coupons");
}
```

### Minimum Amount Limit

```java
if (finalPrice.compareTo(MIN_PAYMENT_AMOUNT) < 0) {
    throw new BusinessException("Final price cannot be less than minimum");
}
```

---

## 3. Process Skip Protection

### Payment Status Validation

```java
@PostMapping("/confirm")
public Map<String, Object> confirmOrder(@RequestBody Map<String, Object> request) {
    Boolean isPaid = (Boolean) order.get("paid");
    if (!isPaid) {
        throw new BusinessException("Order must be paid before confirmation");
    }
}
```

### State Machine Constraints

```java
public enum OrderStatus {
    PENDING_PAYMENT, PAID, CONFIRMED, CANCELLED;
    public boolean canTransitTo(OrderStatus target) {
        return switch (this) {
            case PENDING_PAYMENT -> target == PAID || target == CANCELLED;
            case PAID -> target == CONFIRMED || target == CANCELLED;
            default -> false;
        };
    }
}
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Price tampering | Server-side price validation | Use database price, ignore frontend price |
| Coupon abuse | Dedup + limit + minimum amount | `Set<String> uniqueCoupons` + quantity limit |
| Process skip | Status check + state machine | `if (!isPaid) throw` + state transition check |

**Core Principle**: Never trust business parameters from the client. The server must perform consistency validation on critical business rules.
