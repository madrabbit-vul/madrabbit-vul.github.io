# Level 1 — Actuator端点泄露

## 关卡说明

本关模拟Spring Boot Actuator未正确配置的场景，`/actuator/env` 端点暴露了包含Flag的应用配置属性。

**目标**：通过访问Actuator端点获取环境变量中的Flag。

## 漏洞原理

Actuator的 `/actuator/env` 端点会显示所有Spring Environment属性，包括：

```properties
app.secret-flag=flag{...}
app.internal-api-key=ak-7f8e9d0c1b2a3456
```

## 通关步骤

### Step 1：探测Actuator端点

访问 `/actuator` 查看可用端点列表。

### Step 2：访问env端点

访问 `/actuator/env`，搜索 `app.secret-flag` 或 `flag` 相关属性。

### Step 3：获取 Flag

从环境变量中提取Flag值。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `config/ActuatorFlagConfig.java` | 将Flag注入Spring Environment |
| `service/FlagService.java` | Flag 获取与验证 |
