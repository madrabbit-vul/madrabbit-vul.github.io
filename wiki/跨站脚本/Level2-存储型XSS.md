# Level 2 — 存储型XSS

## 关卡说明

本关模拟留言板功能，用户提交的留言内容不做任何过滤和转义直接存储，前端使用 `innerHTML` 渲染。

**目标**：在留言中插入XSS Payload，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

```
POST /api/challenge/xss/stored/comment
Body: { "author": "用户名", "content": "留言内容" }
```

**漏洞点**：留言内容直接存储，不做任何过滤和转义。

```java
// 【漏洞核心】直接存储用户输入，不做任何过滤和转义
comment.put("content", content);  // 直接存储，含XSS payload
```

## 通关步骤

### Step 1：查看现有留言

访问留言板，观察留言的展示方式。

### Step 2：提交恶意留言

在留言内容中输入 `<script>alert('XSS')</script>` 或 `<img src=x onerror=alert(1)>`

### Step 3：获取 Flag

当检测到XSS Payload时，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xss/StoredXssController.java` | 后端留言接口，无输入过滤 |
| `service/FlagService.java` | Flag 获取与验证 |
