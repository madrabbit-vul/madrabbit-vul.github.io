# Level 3 — IDOR越权

## 关卡说明

本关模拟商家订单管理（仅脱敏展示），但前端源码中泄露了隐藏的解密接口。该接口未校验订单归属。

**目标**：利用访问控制漏洞越权操作，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/access/idor/order/detail`

## 通关步骤

1. 查看前端源码发现隐藏接口 2. 使用其他商家的订单号调用隐藏接口 3. 获取明文数据

### 获取 Flag

越权操作成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/accesscontrol/*Controller.java` | 后端访问控制相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
