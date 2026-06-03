# Broken Access Control — Vulnerability Principles

## What is Broken Access Control?

Broken Access Control occurs when an application does not properly enforce permission checks, allowing users to perform operations beyond their authorized scope. This is the #1 security risk in the OWASP Top 10.

The core problem: **The server does not verify whether the user is authorized to perform the requested operation or access the requested resource.**

---

## 1. Horizontal Privilege Escalation (IDOR)

Same-level user A can access user B's resources. The server only checks if the user is logged in, not if the resource belongs to them.

---

## 2. Vertical Privilege Escalation

Low-privilege users can perform high-privilege operations, such as promoting themselves to admin by modifying role fields in requests.

---

## 3. IDOR (Insecure Direct Object Reference)

A special case of horizontal escalation where interfaces reference objects by ID without verifying ownership. Hidden endpoints (not visible in frontend but existing in backend) are common attack surfaces.
