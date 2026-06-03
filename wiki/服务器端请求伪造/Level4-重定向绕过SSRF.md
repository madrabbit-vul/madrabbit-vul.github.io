# Level 4 — 重定向绕过SSRF

## 关卡说明

本关对域名做DNS解析检查，拒绝内网IP，但未关闭HTTP重定向跟随。攻击者需搭建恶意重定向服务器。

**目标**：利用SSRF漏洞访问内网服务或读取本地文件，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/ssrf/redirect/detect`

**数据流**：

```
用户输入 domain 参数
    ↓
服务端发起请求到 domain 指定的地址
    ↓
请求到达内网服务/读取本地文件
    ↓
返回内网服务的响应内容
```

## 通关步骤

### Step 1：正常使用功能

输入合法的URL，观察服务端请求的行为。

### Step 2：篡改URL指向内网

搭建外部重定向服务器，域名解析到外网IP但302重定向到内网地址。

### Step 3：获取 Flag

SSRF请求成功到达内网服务后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | 后端SSRF相关接口 |
| `service/FlagService.java` | Flag 获取与验证 |
