# Level 1 — GET型CSRF

## 关卡说明

本关模拟无CSRF保护的邮箱修改功能，敏感操作通过GET请求完成。攻击者可以构造一个包含图片标签的恶意页面来伪造请求。

**目标**：利用GET型CSRF漏洞修改邮箱，获取当前关卡的 Flag。

## 漏洞原理

接口路径：

```
GET /api/challenge/csrf/get/change-email?email=xxx
```

**漏洞点**：

1. 敏感操作（修改邮箱）使用GET方法
2. 无CSRF Token验证
3. 仅依赖Cookie/Session识别用户身份

## 通关步骤

### Step 1：正常修改邮箱

通过页面正常修改邮箱，观察请求方式。

### Step 2：构造CSRF攻击

使用GET请求直接修改邮箱，构造如下URL：

```
GET /api/challenge/csrf/get/change-email?email=attacker@evil.com
```

### Step 3：获取 Flag

GET请求修改邮箱成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/csrf/CsrfGetController.java` | 后端邮箱修改接口，GET型CSRF |
| `service/FlagService.java` | Flag 获取与验证 |
