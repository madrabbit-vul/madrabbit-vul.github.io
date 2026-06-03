# Level 2 — 协议利用SSRF

## 关卡说明

本关模拟文件导入功能，服务端使用java.net.URL处理用户输入，支持file://和http://协议。攻击者可利用file://读取本地文件。

**目标**：利用SSRF漏洞访问内网服务或读取本地文件，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/ssrf/protocol/import`

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

使用 `file://` 协议读取本地文件：`file:///path/to/internal-config.properties`
或使用 `http://` 访问内网：`http://127.0.0.1:8080/api/challenge/ssrf/protocol/secret-info`

### Step 3：获取 Flag

SSRF请求成功到达内网服务后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | 后端SSRF相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
