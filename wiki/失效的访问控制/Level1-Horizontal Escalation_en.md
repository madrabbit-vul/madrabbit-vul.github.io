# Level 1 — Horizontal Escalation

## Challenge Description

本关模拟商家订单管理，解密接口未验证订单归属，可查看其他商家的订单明文。

**Objective**: Exploit the access control vulnerability to perform unauthorized operations and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/access/hor/order/decrypt`

## Walkthrough

1. 获取自己的订单列表 2. 修改orderNo为其他商家的订单号 3. 调用解密接口查看明文

### Capture the Flag

Successful unauthorized operation returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/accesscontrol/*Controller.java` | Backend access control endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
