# Level 2 — Vertical Escalation

## Challenge Description

本关模拟订单编辑/删除功能（仅ADMIN），但UserController.updateUser()未校验角色修改权限，普通用户可提权为ADMIN。

**Objective**: Exploit the access control vulnerability to perform unauthorized operations and capture the Flag.

## Vulnerability Analysis

Endpoint: `PUT /api/challenge/access/ver/order/{orderNo}`

## Walkthrough

1. 以普通用户登录 2. 通过用户更新接口将角色改为ADMIN 3. 用管理员权限编辑/删除订单

### Capture the Flag

Successful unauthorized operation returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/accesscontrol/*Controller.java` | Backend access control endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
