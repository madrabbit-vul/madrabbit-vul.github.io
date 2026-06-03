# Level 1 — 错误信息泄露

## 关卡说明

本关模拟用户查询接口，当输入异常值时会触发详细的错误信息，泄露数据库类型、SQL语句、内部路径等敏感信息。Flag隐藏在错误响应的 `debug_trace` 字段中。

**目标**：通过构造异常输入触发错误信息，从泄露的信息中提取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `ErrorLeakController.java`，接口路径：

```
GET /api/challenge/info-leak/error/user?id={id}
```

**入参**：

| 输入 | 触发场景 | 泄露信息 |
|------|---------|---------|
| 非数字字符串 | SQL解析错误 | SQL语句、数据库类型、JDBC URL、堆栈跟踪、服务器信息 |
| 0或负数 | 数组越界错误 | 内部路径、Redis地址、配置文件路径 |
| 超大数(>99999) | 连接超时错误 | 数据库连接池信息、用户名 |

**数据流**：

```
用户输入 id 参数
    ↓
ErrorLeakController.getUser()
    ↓
非数字 → buildSqlParseError() → 泄露SQL语句+数据库信息
0或负数 → buildArrayIndexError() → 泄露内部路径+Redis信息
超大数 → buildTimeoutError() → 泄露数据库连接池配置
    ↓
Flag 隐藏在 detail.debug_trace 字段中
```

**漏洞点**：

1. **错误详情直接返回客户端**：`buildSqlParseError()` 方法将数据库类型、JDBC URL、SQL语句等全部放入响应。
2. **堆栈跟踪泄露**：完整的Java堆栈信息暴露了内部包结构和框架版本。
3. **服务器信息泄露**：操作系统、Java版本、应用路径等运维敏感信息。
4. **Flag隐藏在调试字段**：`debug_trace` 字段包含TraceID和Flag拼接值。

### 源码关键片段

```java
// ErrorLeakController.java — 构造SQL解析错误
private Map<String, Object> buildSqlParseError(String input) {
    Map<String, Object> detail = new LinkedHashMap<>();
    detail.put("exception", "com.mysql.cj.jdbc.exceptions.SQLSyntaxErrorException");
    detail.put("message", "You have an error in your SQL syntax... near '" + input + "'");
    detail.put("sql_statement", "SELECT id, name, email FROM tbl_users WHERE id = " + input);
    detail.put("database", "MySQL 8.0.32");
    detail.put("datasource_url", "jdbc:mysql://192.168.1.100:3306/madx_prod");
    // ... 堆栈跟踪和服务器信息
    detail.put("debug_trace", "TraceID: a3f8c2e1-9b47-4d6a-b5c0-" + flag);
    return result;
}
```

## 通关步骤

### Step 1：正常查询

输入正常ID（如1-5），观察返回的用户数据结构。

### Step 2：触发错误信息

在 `id` 参数中输入非数字字符串（如 `abc`），触发SQL解析错误：

```
GET /api/challenge/info-leak/error/user?id=abc
```

响应中会返回包含 `detail` 字段的错误信息。

### Step 3：提取 Flag

在错误响应中找到 `detail.debug_trace` 字段，Flag拼接在TraceID后面：

```json
{
  "detail": {
    "debug_trace": "TraceID: a3f8c2e1-9b47-4d6a-b5c0-flag{...}"
  }
}
```

也可以尝试输入负数或超大数触发不同类型的错误，Flag同样在 `debug_trace` 字段中。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/infoleak/ErrorLeakController.java` | 后端用户查询接口 |
| `service/FlagService.java` | Flag 获取与验证 |
