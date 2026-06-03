# Remote Command Execution (RCE) — Vulnerability Principles

## What is RCE?

Remote Code Execution / Remote Command Execution (RCE) occurs when an attacker executes arbitrary system commands or code on a server through a vulnerability. This is the most dangerous vulnerability type, potentially leading to complete server compromise.

The core problem: **The application directly or indirectly executes user input as system commands or code without adequate validation and filtering.**

---

## 1. Command Injection

### How It Happens

The application concatenates user input into system commands like `ping`, `nslookup`. Attackers inject additional commands using separators (`;`, `|`, `&&`, `||`, backticks, `$()`).

---

## 2. SpEL Code Injection

### How It Happens

Spring Expression Language (SpEL) supports calling Java classes and methods. When user input is parsed as SpEL expressions, attackers can craft malicious expressions like `T(java.lang.Runtime).getRuntime().exec('id')`.

---

## 3. Filter Bypass

### How It Happens

The server implements command whitelist filtering (only `ls` and `cat`) and filters dangerous characters (`;`, `|`, `&`), but doesn't filter newline `\n`. In Shell, newlines act as command separators.

```
Line 1: ls /tmp/madx-app-logs/    ← Passes whitelist
Line 2: id                         ← Bypasses filter, actually executed
```
