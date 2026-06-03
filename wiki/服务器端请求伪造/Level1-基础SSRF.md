# Level 1 — 基础SSRF

## 关卡说明

本关模拟NBA球员头像下载功能，服务端根据imageUrl参数发起HTTP请求。攻击者可篡改imageUrl指向内网的secret-info端点。

**目标**：利用SSRF漏洞访问内网服务或读取本地文件，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/ssrf/basic/download`

**数据流**：

```
用户输入 imageUrl 参数
    ↓
服务端发起请求到 imageUrl 指定的地址
    ↓
请求到达内网服务/读取本地文件
    ↓
返回内网服务的响应内容
```

## 通关步骤

### Step 1：正常使用功能

输入合法的URL，观察服务端请求的行为。

### Step 2：篡改URL指向内网

将 `imageUrl` 改为内网地址：`http://127.0.0.1:8080/api/challenge/ssrf/basic/secret-info`

### Step 3：获取 Flag

SSRF请求成功到达内网服务后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | 后端SSRF相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
