# Level 2 — Path Traversal

## Challenge Description

本关模拟文件下载功能，用户输入的文件名直接拼接到路径中，无任何过滤。可使用../跳出downloads目录读取secret目录下的敏感文件。

**Objective**: Exploit the file operation vulnerability to capture the Flag.

## Vulnerability Analysis

Endpoint: `GET /api/challenge/file-op/traversal/download?file=xxx`

## Walkthrough

### Step 1: Observe Normal Functionality

Use file operations normally and observe validation logic.

### Step 2: Craft Attack

输入 `../../secret/credentials.txt` 跳出downloads目录读取敏感文件

### Step 3: Capture the Flag

Successful attack returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/fileoperation/*Controller.java` | Backend file operation endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
