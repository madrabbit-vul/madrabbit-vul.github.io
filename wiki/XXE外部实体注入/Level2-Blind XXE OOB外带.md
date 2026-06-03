# Level 2 — Blind XXE OOB外带

## 关卡说明

本关模拟XML格式校验功能，后端解析XML但不回显解析内容（盲XXE）。攻击者需要使用OOB（Out-of-Band）外带技术将数据发送到外部服务器。

**目标**：构造Blind XXE Payload，通过OOB方式外带虚拟文件内容，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/xxe/level2/validate`

**特点**：接口只返回 `"XML format is valid"` 或错误信息，不回显实体内容。

**虚拟文件**：`/flag/xxe-level2` → 内容为Flag值本身

## 通关步骤

### Step 1：提交正常XML

```xml
<?xml version="1.0"?>
<root>test</root>
```

### Step 2：构造OOB外带Payload

需要搭建外部HTTP服务器接收数据，使用参数化DTD外带文件内容。

### Step 3：获取 Flag

检测到Blind XXE特征后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xxe/XxeLevel2Controller.java` | 后端XML校验接口（不回显） |
| `service/FlagService.java` | Flag 获取与验证 |
