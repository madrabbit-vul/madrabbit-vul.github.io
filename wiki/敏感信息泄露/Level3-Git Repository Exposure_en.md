# Level 3 — .git Directory Exposure

## Challenge Description

This challenge simulates a corporate website where the `.git` directory was not removed during deployment. Progressively probe `.git` paths to reconstruct sensitive configuration from commit history and extract the Flag.

**Objective**: Probe the `.git` directory, reconstruct sensitive configuration from Git history, and extract the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `GitLeakController.java`

```
GET /api/challenge/info-leak/git/page          — Corporate website page
GET /api/challenge/info-leak/git/probe?path=   — Path probing endpoint
```

**Probing paths**:

| Path | Content |
|------|---------|
| `/.git/config` | Git config (remote repo URL, user info) |
| `/.git/HEAD` | Current branch reference |
| `/.git/logs/HEAD` | Commit history (with commit hashes) |
| `/.git/objects/abc123` | Old commit containing sensitive credentials |

**Attack Flow**:

1. Probe `/.git/config` → Get repository info
2. Probe `/.git/HEAD` → Confirm branch is `main`
3. Probe `/.git/logs/HEAD` → Find key commit `abc123f`: "add database config with credentials"
4. Probe `/.git/objects/abc123` → Recover old config file with Flag in `jwt_secret` field

### Source Code Snippet

```java
// Key commit in history
"abc123f deploy-bot commit: add database config with credentials"

// Old config file content containing the Flag
"admin_panel:
" +
"  jwt_secret: " + flag
```

## Walkthrough

### Step 1: Probe .git/config

```
GET /api/challenge/info-leak/git/probe?path=/.git/config
```

### Step 2: Probe .git/HEAD

```
GET /api/challenge/info-leak/git/probe?path=/.git/HEAD
```

### Step 3: View Commit History

```
GET /api/challenge/info-leak/git/probe?path=/.git/logs/HEAD
```

Find commit `abc123f`: "add database config with credentials" (removed in next commit).

### Step 4: Recover Old Commit Content

```
GET /api/challenge/info-leak/git/probe?path=/.git/objects/abc123
```

Find the Flag in the `jwt_secret` field of the old configuration file.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/infoleak/GitLeakController.java` | Backend path probing endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
