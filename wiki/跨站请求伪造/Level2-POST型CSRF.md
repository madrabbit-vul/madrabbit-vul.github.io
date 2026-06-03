# Level 2 — POST型CSRF

## 关卡说明

本关模拟无CSRF Token验证的密码修改功能，使用POST请求。攻击者可以通过构造自动提交的表单发起CSRF攻击。

**目标**：利用POST型CSRF漏洞修改密码，获取当前关卡的 Flag。

## 漏洞原理

接口路径：

```
POST /api/challenge/csrf/post/change-password
Content-Type: application/x-www-form-urlencoded
```

**漏洞点**：无CSRF Token验证，表单提交的请求会被服务器直接处理。

## 通关步骤

### Step 1：观察正常请求

通过页面正常修改密码，观察请求方式（JSON）。

### Step 2：构造表单提交

构造一个 `application/x-www-form-urlencoded` 类型的POST请求提交新密码。

### Step 3：获取 Flag

表单提交方式修改密码成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/csrf/CsrfPostController.java` | 后端密码修改接口，POST型CSRF |
| `service/FlagService.java` | Flag 获取与验证 |
