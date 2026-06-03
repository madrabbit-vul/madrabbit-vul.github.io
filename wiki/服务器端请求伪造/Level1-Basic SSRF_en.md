# Level 1 — Basic SSRF

## Challenge Description

本关模拟NBA球员头像下载功能，服务端根据imageUrl参数发起HTTP请求。攻击者可篡改imageUrl指向内网的secret-info端点。

**Objective**: Exploit the SSRF vulnerability to access internal services or read local files and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/ssrf/basic/download`

## Walkthrough

### Step 1: Normal Usage

Enter a legitimate URL and observe the server's request behavior.

### Step 2: Tamper with URL

Change `imageUrl` to an internal address: `http://127.0.0.1:8080/api/challenge/ssrf/basic/secret-info`

### Step 3: Capture the Flag

When the SSRF request successfully reaches the internal service, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | Backend SSRF endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
