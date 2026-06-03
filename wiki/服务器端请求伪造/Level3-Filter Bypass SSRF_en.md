# Level 3 — Filter Bypass SSRF

## Challenge Description

本关有简单的黑名单过滤（禁止127.0.0.1、localhost等），但未覆盖IP混淆表示。攻击者可使用0x7f000001等绕过。

**Objective**: Exploit the SSRF vulnerability to access internal services or read local files and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/ssrf/bypass/request`

## Walkthrough

### Step 1: Normal Usage

Enter a legitimate URL and observe the server's request behavior.

### Step 2: Tamper with URL

Use IP obfuscation to bypass blacklist: `http://0x7f000001:8080/api/challenge/ssrf/bypass/secret-info`

### Step 3: Capture the Flag

When the SSRF request successfully reaches the internal service, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | Backend SSRF endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
