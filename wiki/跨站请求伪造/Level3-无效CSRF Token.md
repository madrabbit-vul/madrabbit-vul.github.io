# Level 3 — 无效CSRF Token

## 关卡说明

本关模拟有CSRF Token但Token未与用户绑定的场景。服务端只验证Token是否有效，不验证Token是否属于当前用户。攻击者可以使用自己的Token伪造请求。

**目标**：利用CSRF Token未绑定用户的漏洞，使用其他用户的Token发起请求，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`GET/POST /api/challenge/csrf/token/change-email?email=xxx&csrf_token=xxx`

**漏洞代码**：

```java
// 只检查Token是否在有效Token列表中
String tokenOwner = validTokens.get(csrf_token);
if (tokenOwner == null) {
    return "无效的CSRF Token";
}
// ❌ 漏洞：没有验证 tokenOwner 是否等于 username
// 攻击者可以使用自己的有效Token冒充其他用户
```

## 通关步骤

### Step 1：获取自己的CSRF Token

访问 `/api/challenge/csrf/token/csrf-token` 获取当前用户的Token。

### Step 2：使用自己的Token修改他人邮箱

用自己获取的Token，构造修改邮箱请求。由于Token未绑定用户，服务器会接受该请求。

### Step 3：获取 Flag

当检测到Token不属于当前用户时，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/csrf/CsrfTokenController.java` | 后端Token验证接口，Token未绑定用户 |
| `service/FlagService.java` | Flag 获取与验证 |
