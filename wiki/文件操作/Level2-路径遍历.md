# Level 2 — 路径遍历

## 关卡说明

本关模拟文件下载功能，用户输入的文件名直接拼接到路径中，无任何过滤。可使用../跳出downloads目录读取secret目录下的敏感文件。

**目标**：利用文件操作漏洞，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`GET /api/challenge/file-op/traversal/download?file=xxx`

## 通关步骤

### Step 1：观察正常功能

正常使用文件操作功能，观察校验逻辑。

### Step 2：构造攻击

输入 `../../secret/credentials.txt` 跳出downloads目录读取敏感文件

### Step 3：获取 Flag

攻击成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/fileoperation/*Controller.java` | 后端文件操作接口 |
| `service/FlagService.java` | Flag 获取与验证 |
