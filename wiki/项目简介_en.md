# MadRabbit - Web Vulnerability Lab

## Overview

MadRabbit is an open-source vulnerability lab designed for Web security education and hands-on practice. It covers 13 categories of common Web security vulnerabilities from the OWASP Top 10, each with multiple progressive challenge levels that help learners master security skills through an "attack - understand - fix" loop.

Unlike traditional CTF platforms, every challenge in MadRabbit is built on **real-world business scenarios** — login authentication, order queries, file uploads, password resets... every vulnerability you encounter here could exist in a production environment. The system provides complete source code, allowing learners to trace the root cause of vulnerabilities in the code and practice fixes at the code level.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | JDK | 17 |
| Backend Framework | Spring Boot | 2.7.17 |
| ORM Framework | MyBatis | 2.3.1 |
| Database | MySQL | 8.0+ |
| API Documentation | SpringDoc OpenAPI (Swagger UI) | 1.7.0 |
| Authentication | JWT (JJWT) | 0.11.5 |
| Build Tool | Maven | 3.6+ |
| Frontend | Vanilla HTML / CSS / JS (Spring Boot static hosting) | - |

The system uses a **monolithic architecture**: the backend provides RESTful APIs, while frontend pages are served directly through Spring Boot's embedded static resource handler — no separate Node.js frontend build required.

## Vulnerability Categories

The system covers the following 13 categories of Web security vulnerabilities, with 50+ challenge levels in total:

| Vulnerability Type | Identifier | Levels | Difficulty |
|-------------------|-----------|--------|-----------|
| Authentication & Session | auth-session | 5 | Beginner → Advanced |
| SQL Injection | injection | 11 | Beginner → Advanced |
| Cross-Site Scripting (XSS) | xss | 5 | Beginner → Advanced |
| XXE External Entity Injection | xxe | 5 | Beginner → Advanced |
| Cross-Site Request Forgery (CSRF) | csrf | 5 | Beginner → Advanced |
| Server-Side Request Forgery (SSRF) | ssrf | 6 | Beginner → Advanced |
| Remote Code Execution (RCE) | rce | 5 | Beginner → Advanced |
| Broken Access Control | access-control | 5 | Beginner → Advanced |
| File Operations | file-operation | 5 | Beginner → Advanced |
| Security Misconfiguration | security-config | 4 | Beginner → Advanced |
| Sensitive Information Leakage | info-leak | 5 | Beginner → Advanced |
| Business Logic Errors | business-logic | 5 | Beginner → Advanced |
| Insecure Deserialization | deserialization | 5 | Beginner → Advanced |

## Challenge Structure

Each vulnerability type follows a consistent challenge structure:

```
Playbook (Level 0)     : Principles, causes, and risk overview (built-in docs, no separate walkthrough needed)
Hands-on (Level 1~N)  : Progressive attack challenges, each requiring a Flag to complete
Finale (Level N+1)     : Comprehensive summary, review of learning path and protection points (built-in docs, no separate walkthrough needed)
```

> **Wiki Note**: The "Playbook" and "Finale" levels are embedded in the system and do not require separate Wiki documentation. The Wiki only provides detailed walkthroughs for the hands-on challenge levels.

**Progress Tracking**: The system automatically tracks the completion status of each level (Not Started → In Progress → Completed). Users can view overall progress on the homepage and level list.

## Core Features

- **Hands-on Attacks**: Each level provides a real attack scenario where learners craft malicious requests to capture Flags
- **Code Tracing**: Complete source code is available for learners to understand vulnerability causes and trigger conditions
- **Flag Validation**: Each level has a unique Flag value; submitting the correct Flag marks the level as completed
- **Internationalization**: Supports Chinese and English language switching
- **Swagger Docs**: Integrated OpenAPI documentation for easy API viewing and debugging

## Risk Warning

> **MadRabbit contains intentionally planted security vulnerabilities and is intended solely for security education and authorized testing.**
>
> - Do NOT deploy this system to the public internet
> - Do NOT use this system for unauthorized penetration testing
> - Use only in an isolated local environment
