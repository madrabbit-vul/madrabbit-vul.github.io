# Level 3 — 过滤绕过SSRF

## 关卡说明

本关有简单的黑名单过滤（禁止127.0.0.1、localhost等），但未覆盖IP混淆表示。攻击者可使用0x7f000001等绕过。

**目标**：利用SSRF漏洞访问内网服务或读取本地文件，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/ssrf/bypass/request`

**数据流**：

```
用户输入 url 参数
    ↓
服务端发起请求到 url 指定的地址
    ↓
请求到达内网服务/读取本地文件
    ↓
返回内网服务的响应内容
```

## 通关步骤

### Step 1：正常使用功能

输入合法的URL，观察服务端请求的行为。

### Step 2：篡改URL指向内网

使用IP混淆绕过黑名单：`http://0x7f000001:8080/api/challenge/ssrf/bypass/secret-info`

### Step 3：获取 Flag

SSRF请求成功到达内网服务后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | 后端SSRF相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
