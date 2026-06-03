# Level 3 — .git 信息泄露

## 关卡说明

本关模拟企业官网，Web服务器部署时未删除 `.git` 目录。需要逐步探测 `.git` 路径，从提交历史中还原出包含敏感凭据的旧配置文件，提取Flag。

**目标**：通过探测 `.git` 目录，从Git历史中还原敏感配置信息，提取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `GitLeakController.java`，模拟 `.git` 目录探测接口：

```
GET /api/challenge/info-leak/git/page          — 企业官网页面
GET /api/challenge/info-leak/git/probe?path=   — 路径探测接口
```

**可探测的路径**：

| 路径 | 返回内容 |
|------|---------|
| `/.git/config` | Git配置信息（远程仓库地址、用户信息） |
| `/.git/HEAD` | 当前分支引用 |
| `/.git/logs/HEAD` | 提交历史（含commit hash） |
| `/.git/objects/abc123` | 包含敏感凭据的旧提交内容 |

**数据流**：

```
探测 /.git/config → 获取仓库信息
    ↓
探测 /.git/HEAD → 确认当前分支为 main
    ↓
探测 /.git/logs/HEAD → 发现提交历史
    ↓
关键提交：abc123f "add database config with credentials"
    ↓（下个提交删除了该配置）
探测 /.git/objects/abc123 → 还原旧配置文件
    ↓
在 jwt_secret 字段中找到 Flag
```

**漏洞点**：

1. **.git目录未删除**：Web服务器部署时保留了 `.git` 目录。
2. **Git历史不可变**：即使敏感文件在后续提交中被删除，Git对象中仍保留历史内容。
3. **Flag位置**：在旧提交的 `database.yml` 配置文件的 `jwt_secret` 字段中。

### 源码关键片段

```java
// GitLeakController.java — 提交历史中的关键信息
"abc123f deploy-bot commit: add database config with credentials
" +
"5d9e8b2 deploy-bot commit: remove database password from config - security fix
"

// /.git/objects/abc123 — 包含Flag的旧配置
"admin_panel:
" +
"  secret_key: sk-technova-9f8e7d6c5b4a3210
" +
"  jwt_secret: " + flag + "
"
```

## 通关步骤

### Step 1：探测 .git/config

```
GET /api/challenge/info-leak/git/probe?path=/.git/config
```

返回Git配置信息，确认 `.git` 目录可访问，发现远程仓库地址 `git@gitlab.technova-internal.com`。

### Step 2：探测 .git/HEAD

```
GET /api/challenge/info-leak/git/probe?path=/.git/HEAD
```

确认当前分支为 `main`，提示查看 `logs/HEAD`。

### Step 3：查看提交历史

```
GET /api/challenge/info-leak/git/probe?path=/.git/logs/HEAD
```

在提交历史中发现关键提交 `abc123f`："add database config with credentials"，该提交在下一次提交中被删除（security fix）。

### Step 4：还原旧提交内容

```
GET /api/challenge/info-leak/git/probe?path=/.git/objects/abc123
```

从旧配置文件中找到 `jwt_secret` 字段，即为 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/infoleak/GitLeakController.java` | 后端路径探测接口 |
| `service/FlagService.java` | Flag 获取与验证 |
