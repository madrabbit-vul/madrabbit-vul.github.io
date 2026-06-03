# Level 3 — File Inclusion Bypass

## Challenge Description

本关模拟文档查看器，对../只做单次替换。可用..../绕过（替换后变为../../），结合文件上传的图片马实现RCE。

**Objective**: Exploit the file operation vulnerability to capture the Flag.

## Vulnerability Analysis

Endpoint: `GET /api/challenge/file-op/include/page?template=xxx`

## Walkthrough

### Step 1: Observe Normal Functionality

Use file operations normally and observe validation logic.

### Step 2: Craft Attack

输入 `..../..../uploads/avatars/xxx.gif` 绕过单次替换，包含上传的图片马

### Step 3: Capture the Flag

Successful attack returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/fileoperation/*Controller.java` | Backend file operation endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
