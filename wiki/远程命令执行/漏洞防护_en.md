# Remote Command Execution (RCE) — Vulnerability Protection

---

## 1. Avoid Command Concatenation

Use ProcessBuilder with separate arguments instead of string concatenation.

---

## 2. Input Whitelist Validation

Strict regex validation for all user inputs before use in commands.

---

## 3. SpEL Security Configuration

Use `SimpleEvaluationContext` instead of `StandardEvaluationContext` to limit SpEL capabilities.

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Command injection | Avoid command concatenation | ProcessBuilder parameterization |
| SpEL injection | Limit expression capabilities | SimpleEvaluationContext |
| Filter bypass | Complete filtering rules | Filter newlines and all separators |

**Core Principle**: Never concatenate user input directly into system commands or code expressions.
