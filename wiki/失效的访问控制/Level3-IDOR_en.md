# Level 3 — IDOR

## Challenge Description

本关模拟商家订单管理（仅脱敏展示），但前端源码中泄露了隐藏的解密接口。该接口未校验订单归属。

**Objective**: Exploit the access control vulnerability to perform unauthorized operations and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/access/idor/order/detail`

## Walkthrough

1. 查看前端源码发现隐藏接口 2. 使用其他商家的订单号调用隐藏接口 3. 获取明文数据

### Capture the Flag

Successful unauthorized operation returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/accesscontrol/*Controller.java` | Backend access control endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
