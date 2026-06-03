# Level 2 — SpEL Code Injection

## Challenge Description

本关模拟消息模板渲染功能，后端使用SpEL解析消息中的 `#{...}` 表达式。

**Objective**: Exploit the RCE vulnerability to execute system commands and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/rce/spel/render`

## Walkthrough

### Step 1: Normal Usage

Enter normal parameters and observe results.

### Step 2: Inject Command

在模板中注入：`#{T(java.lang.Runtime).getRuntime().exec('id')}`

### Step 3: Capture the Flag

Successful command injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/rce/*Controller.java` | Backend command execution endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
