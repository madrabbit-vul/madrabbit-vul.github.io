# Level 1 — Command Injection

## Challenge Description

本关模拟Ping网络诊断功能，后端直接将用户输入拼接到系统命令中执行。

**Objective**: Exploit the RCE vulnerability to execute system commands and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/rce/cmd/ping`

## Walkthrough

### Step 1: Normal Usage

Enter normal parameters and observe results.

### Step 2: Inject Command

在 `host` 参数中注入：`127.0.0.1; id` 或 `127.0.0.1 | whoami` 或 `` `id` ``

### Step 3: Capture the Flag

Successful command injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/rce/*Controller.java` | Backend command execution endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
