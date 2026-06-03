# Level 1 — 水平越权

## 关卡说明

本关模拟商家订单管理，解密接口未验证订单归属，可查看其他商家的订单明文。

**目标**：利用访问控制漏洞越权操作，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/access/hor/order/decrypt`

## 通关步骤

1. 获取自己的订单列表 2. 修改orderNo为其他商家的订单号 3. 调用解密接口查看明文

### 获取 Flag

越权操作成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/accesscontrol/*Controller.java` | 后端访问控制相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
