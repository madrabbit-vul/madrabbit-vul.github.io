# Security Misconfiguration — Vulnerability Principles

## What is Security Misconfiguration?

Security Misconfiguration occurs when applications, servers, or frameworks expose sensitive information or allow unauthorized access due to improper configuration.

---

## 1. Actuator Endpoint Exposure

Spring Boot Actuator provides monitoring endpoints like `/actuator/env` that display all environment variables. Without proper access control in production, attackers can obtain database passwords, API keys, etc.

---

## 2. Swagger API Documentation Exposure

OpenAPI/Swagger provides API documentation during development. When not disabled in production, attackers can discover hidden internal management endpoints.
