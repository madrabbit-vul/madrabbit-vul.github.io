# Level 3 — DOM型XSS

## 关卡说明

本关模拟欢迎页面，服务端正常返回用户输入的名称，漏洞在前端使用 `innerHTML` 直接渲染URL参数中的 `name` 值。

**目标**：通过构造包含XSS Payload的URL参数，触发前端DOM型XSS，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

```
GET /api/challenge/xss/dom/greeting?name=xxx
```

**服务端行为**：将 `name` 参数原样返回：`result.put("name", name);`

**前端漏洞**：前端代码用 `innerHTML` 直接渲染 `name` 值，未经转义。

## 通关步骤

### Step 1：正常访问

访问 `?name=Guest`，观察欢迎信息展示。

### Step 2：构造DOM型XSS

访问 `?name=<img src=x onerror=alert(1)>`，前端 `innerHTML` 会解析并执行恶意标签。

### Step 3：获取 Flag

当 `name` 参数包含XSS特征时，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xss/DomXssController.java` | 后端欢迎接口，原样返回 |
| `static/challenges/xss/dom-xss.html` | 前端页面，innerHTML渲染 |
| `service/FlagService.java` | Flag 获取与验证 |
