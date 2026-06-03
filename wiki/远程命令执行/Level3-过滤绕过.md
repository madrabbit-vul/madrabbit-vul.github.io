# Level 3 — 过滤绕过

## 关卡说明

本关模拟日志查看器，白名单只允许 ls/cat 命令，过滤了危险字符但未过滤换行符。

**目标**：利用RCE漏洞执行系统命令，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`POST /api/challenge/rce/bypass/execute`

## 通关步骤

### Step 1：正常使用功能

输入正常参数，观察返回结果。

### Step 2：注入命令

利用换行符注入：`ls /tmp/madx-app-logs/\nid`（换行符后接id命令）

### Step 3：获取 Flag

命令注入成功后，响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/rce/*Controller.java` | 后端命令执行接口 |
| `service/FlagService.java` | Flag 获取与验证 |
