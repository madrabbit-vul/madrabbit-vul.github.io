# Level 3 — Filter Bypass

## Challenge Description

本关模拟日志查看器，白名单只允许 ls/cat 命令，过滤了危险字符但未过滤换行符。

**Objective**: Exploit the RCE vulnerability to execute system commands and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/rce/bypass/execute`

## Walkthrough

### Step 1: Normal Usage

Enter normal parameters and observe results.

### Step 2: Inject Command

利用换行符注入：`ls /tmp/madx-app-logs/\nid`（换行符后接id命令）

### Step 3: Capture the Flag

Successful command injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/rce/*Controller.java` | Backend command execution endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
