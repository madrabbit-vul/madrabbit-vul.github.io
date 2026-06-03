# Level 1 — 命令注入

## 关卡说明

本关模拟Ping网络诊断功能，后端直接将用户输入拼接到系统命令中执行。

**目标**：利用RCE漏洞执行系统命令，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/rce/cmd/ping`

## 通关步骤

### Step 1：正常使用功能

输入正常参数，观察返回结果。

### Step 2：注入命令

在 `host` 参数中注入：`127.0.0.1; id` 或 `127.0.0.1 | whoami` 或 `` `id` ``

### Step 3：获取 Flag

命令注入成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/rce/*Controller.java` | 后端命令执行接口 |
| `service/FlagService.java` | Flag 获取与验证 |
