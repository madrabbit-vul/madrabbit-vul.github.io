# Level 1 — 文件上传绕过

## 关卡说明

本关模拟头像上传功能，三层校验（扩展名+Content-Type+文件头魔数）。需要构造图片马（合法图片头+恶意代码内容）绕过所有校验。

**目标**：利用文件操作漏洞，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/file-op/upload/avatar`

## 通关步骤

### Step 1：观察正常功能

正常使用文件操作功能，观察校验逻辑。

### Step 2：构造攻击

构造图片马：1. 创建合法图片文件 2. 在图片内容中嵌入恶意代码如 `<%exec(id)%>` 3. 确保扩展名为.jpg/.png/.gif，Content-Type为image/*

### Step 3：获取 Flag

攻击成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/fileoperation/*Controller.java` | 后端文件操作接口 |
| `service/FlagService.java` | Flag 获取与验证 |
