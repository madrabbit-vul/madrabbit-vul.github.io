# Level 4 — Redirect Bypass SSRF

## Challenge Description

本关对域名做DNS解析检查，拒绝内网IP，但未关闭HTTP重定向跟随。攻击者需搭建恶意重定向服务器。

**Objective**: Exploit the SSRF vulnerability to access internal services or read local files and capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/ssrf/redirect/detect`

## Walkthrough

### Step 1: Normal Usage

Enter a legitimate URL and observe the server's request behavior.

### Step 2: Tamper with URL

Set up an external redirect server that resolves to an external IP but 302 redirects to an internal address.

### Step 3: Capture the Flag

When the SSRF request successfully reaches the internal service, the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/ssrf/Ssrf*Controller.java` | Backend SSRF endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
