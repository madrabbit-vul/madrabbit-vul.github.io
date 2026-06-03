# Level 2 — 前端硬编码泄露

## 关卡说明

本关模拟管理后台页面，前端JavaScript源码中硬编码了管理员登录凭据。需要通过浏览器开发者工具查看源码，找到硬编码的账号密码并登录。

**目标**：从前端代码中发现硬编码的管理员凭据，登录获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `HardcodedSecretController.java`，相关接口：

```
GET  /api/challenge/info-leak/hardcoded/page    — 获取管理后台页面数据
POST /api/challenge/info-leak/hardcoded/login   — 管理员登录
```

**数据流**：

```
用户访问管理后台页面
    ↓
前端JS加载，源码中包含硬编码凭据
    ↓
攻击者通过浏览器开发者工具查看JS源码
    ↓
找到 admin / S3cur3@dm1n! 凭据
    ↓
调用登录接口，获取Flag
```

**漏洞点**：

1. **凭据硬编码**：管理员账号密码直接写在前端JavaScript中。
2. **无二次验证**：登录接口仅校验凭据是否匹配，无验证码或其他防护。

### 源码关键片段

```java
// HardcodedSecretController.java — 硬编码的管理员凭据
private static final String ADMIN_USERNAME = "admin";
private static final String ADMIN_PASSWORD = "S3cur3@dm1n!";

@PostMapping("/login")
public Map<String, Object> login(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");
    
    if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
        String flag = flagService.getFlag("info-leak", "level2");
        result.put("flag", flag);
    }
}
```

## 通关步骤

### Step 1：访问管理后台

访问管理后台页面，观察页面内容。

### Step 2：查看前端源码

打开浏览器开发者工具（F12），在源码（Sources）中搜索关键词：

- 搜索 `admin`、`password`、`secret`、`credential` 等关键词
- 查看 JavaScript 文件中的变量定义
- 找到硬编码的管理员凭据：`admin` / `S3cur3@dm1n!`

### Step 3：登录获取 Flag

使用找到的凭据调用登录接口：

```json
POST /api/challenge/info-leak/hardcoded/login
{
  "username": "admin",
  "password": "S3cur3@dm1n!"
}
```

响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/infoleak/HardcodedSecretController.java` | 后端登录接口 |
| `static/challenges/info-leak/` | 前端页面（含硬编码凭据） |
| `service/FlagService.java` | Flag 获取与验证 |
