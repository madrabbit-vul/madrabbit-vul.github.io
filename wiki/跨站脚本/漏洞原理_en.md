# Cross-Site Scripting (XSS) — Vulnerability Principles

## What is XSS?

Cross-Site Scripting (XSS) occurs when an attacker injects malicious scripts into a web page, and the scripts execute in other users' browsers when they visit the page. XSS is one of the most common web security vulnerabilities, potentially leading to cookie theft, session hijacking, and page defacement.

The core problem: **The application embeds user input directly into HTML pages without adequate escaping.**

---

## 1. Reflected XSS

### How It Happens

User input is submitted to the server via URL parameters or forms, and the server "reflects" it back into the page. If the input is not HTML-escaped, attackers can craft malicious URLs containing `<script>` tags to trick victims into clicking.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires tricking users into clicking a malicious link) |
| Impact Scope | Medium (only affects users who click the link) |
| Exploitation Condition | Requires social engineering |

---

## 2. Stored XSS

### How It Happens

Attackers submit malicious scripts to the server for persistent storage (e.g., database, files). When other users visit pages containing the data, the scripts execute automatically. This is the most dangerous XSS type because no special link clicks are needed.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (one submission, all visitors affected) |
| Impact Scope | High (all users who browse the page) |
| Exploitation Condition | Only need to submit malicious content |

---

## 3. DOM-based XSS

### How It Happens

The vulnerability exists entirely in frontend JavaScript code. Data returned by the server is rendered directly into the page using dangerous APIs like `innerHTML` or `document.write()` without escaping. Unlike reflected XSS, DOM-based XSS does not involve server-side processing of the malicious data.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires understanding frontend DOM operations) |
| Impact Scope | Medium (depends on frontend rendering logic) |
| Exploitation Condition | Frontend has unsafe DOM operations |
