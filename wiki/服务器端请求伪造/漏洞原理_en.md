# Server-Side Request Forgery (SSRF) — Vulnerability Principles

## What is SSRF?

Server-Side Request Forgery (SSRF) occurs when an attacker leverages a server's request-making functionality to have the server access attacker-specified addresses, thereby reading internal services, local files, and other protected resources.

The core problem: **The server initiates network requests based on user input without adequate validation and restriction of the target address.**

---

## 1. Basic SSRF

### How It Happens

The application provides URL input functionality (e.g., image download, web preview), and the server makes HTTP requests based on the user-provided URL. Attackers can tamper with the URL to point to internal services.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (modify URL parameter directly) |
| Impact Scope | High (can access internal services) |
| Exploitation Condition | URL input point exists |

---

## 2. Protocol Exploitation SSRF

### How It Happens

When the server uses classes like `java.net.URL` that support multiple protocols, attackers can exploit the `file://` protocol to read local files in addition to HTTP.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires protocol knowledge) |
| Impact Scope | High (can read local files + access internal network) |
| Exploitation Condition | Server uses multi-protocol URL handler |

---

## 3. Filter Bypass SSRF

### How It Happens

The server implements simple blacklist filtering (e.g., blocking `127.0.0.1`, `localhost`) but doesn't cover IP obfuscation techniques. Attackers use hex IP, decimal IP, octal IP, etc.

### Bypass Techniques

| Technique | Example | Equivalent |
|-----------|---------|-----------|
| Hex IP | `0x7f000001` | 127.0.0.1 |
| Decimal IP | `2130706433` | 127.0.0.1 |
| Octal IP | `0177.0.0.1` | 127.0.0.1 |
| IPv6 | `[::1]` | 127.0.0.1 |
| Short IP | `127.1` | 127.0.0.1 |

---

## 4. Redirect Bypass SSRF

### How It Happens

The server performs DNS resolution checks on user-input domains, rejecting those resolving to internal IPs. However, the HTTP client's automatic redirect following is not disabled. Attackers set up a malicious server whose domain resolves to an external IP (passing the check) but returns a 302 redirect to an internal address.
