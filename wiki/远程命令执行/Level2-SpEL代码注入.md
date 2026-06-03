# Level 2 — SpEL代码注入

## 关卡说明

本关模拟消息模板渲染功能，后端使用SpEL解析消息中的 `#{...}` 表达式。

**目标**：利用RCE漏洞执行系统命令，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/rce/spel/render`

## 通关步骤

### Step 1：正常使用功能

输入正常参数，观察返回结果。

### Step 2：注入命令

在模板中注入：`#{T(java.lang.Runtime).getRuntime().exec('id')}`

### Step 3：获取 Flag

命令注入成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/rce/*Controller.java` | 后端命令执行接口 |
| `service/FlagService.java` | Flag 获取与验证 |
