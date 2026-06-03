# Level 2 — Swagger API文档泄露

## 关卡说明

本关模拟生产环境未关闭Swagger API文档的场景。通过 `/v3/api-docs` 发现隐藏的内部管理接口，直接调用获取Flag。

**目标**：通过Swagger文档发现隐藏接口，调用获取Flag。

## 漏洞原理

Swagger/OpenAPI 文档暴露了所有Controller的接口信息，包括标记为"Internal"的隐藏端点：

```
GET /api/challenge/sec-config/swagger/internal/getflag
```

## 通关步骤

### Step 1：访问Swagger文档

访问 `/v3/api-docs` 或 `/swagger-ui.html`。

### Step 2：发现隐藏接口

在文档中搜索"Internal"或"DO NOT EXPOSE"标记的接口。

### Step 3：调用隐藏接口

直接访问 `GET /api/challenge/sec-config/swagger/internal/getflag`。

### Step 4：获取 Flag

接口返回包含Flag的响应。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/securityconfig/SwaggerLeakController.java` | 隐藏的内部接口 |
| `config/OpenApiConfig.java` | Swagger配置 |
| `service/FlagService.java` | Flag 获取与验证 |
