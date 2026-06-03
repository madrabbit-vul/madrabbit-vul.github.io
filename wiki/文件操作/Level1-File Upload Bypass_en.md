# Level 1 — File Upload Bypass

## Challenge Description

本关模拟头像上传功能，三层校验（扩展名+Content-Type+文件头魔数）。需要构造图片马（合法图片头+恶意代码内容）绕过所有校验。

**Objective**: Exploit the file operation vulnerability to capture the Flag.

## Vulnerability Analysis

Endpoint: `POST /api/challenge/file-op/upload/avatar`

## Walkthrough

### Step 1: Observe Normal Functionality

Use file operations normally and observe validation logic.

### Step 2: Craft Attack

构造图片马：1. 创建合法图片文件 2. 在图片内容中嵌入恶意代码如 `<%exec(id)%>` 3. 确保扩展名为.jpg/.png/.gif，Content-Type为image/*

### Step 3: Capture the Flag

Successful attack returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/fileoperation/*Controller.java` | Backend file operation endpoints |
| `service/FlagService.java` | Flag retrieval and validation |
