# Level 2 — 垂直越权

## 关卡说明

本关模拟订单编辑/删除功能（仅ADMIN），但UserController.updateUser()未校验角色修改权限，普通用户可提权为ADMIN。

**目标**：利用访问控制漏洞越权操作，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`PUT /api/challenge/access/ver/order/{orderNo}`

## 通关步骤

1. 以普通用户登录 2. 通过用户更新接口将角色改为ADMIN 3. 用管理员权限编辑/删除订单

### 获取 Flag

越权操作成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/accesscontrol/*Controller.java` | 后端访问控制相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
