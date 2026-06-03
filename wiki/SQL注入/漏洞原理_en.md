# SQL Injection — Vulnerability Principles

## What is SQL Injection?

SQL Injection occurs when an attacker inserts malicious SQL code into an application's query, altering the original SQL logic to perform unauthorized database operations. SQL Injection has long been ranked at the top of the OWASP Top 10 and is one of the most common and dangerous web vulnerabilities.

The core problem: **The application executes user input directly as part of an SQL statement without adequate filtering or parameterization.**

---

## 1. Classic SQL Injection (String Concatenation)

### How It Happens

When an application constructs SQL statements using string concatenation, special characters in user input (such as single quotes `'`, semicolons `;`, comment markers `--`) are interpreted by the database as part of SQL syntax rather than plain data.

Common injection types:

- **Login bypass**: Construct a tautology using `OR '1'='1'`
- **UNION injection**: Merge queries using `UNION SELECT` to access other tables
- **Blind injection**: Extract data character by character using boolean conditions or time delays

### Real-World Case

In 2017, a well-known online education platform had an unparameterized login endpoint. An attacker bypassed password verification using `admin'--` to log in as admin, leading to the exposure of millions of user records.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (mature automated tools) |
| Impact Scope | Extremely High (can read/modify/delete all database data) |
| Exploitation Condition | Requires an input point with concatenated SQL |

---

## 2. MyBatis Framework SQL Injection

### How It Happens

MyBatis provides two parameter placeholders:

- `#{param}`: Precompiled parameterization, safe, uses `PreparedStatement` `?` placeholder
- `${param}`: Direct string replacement, dangerous, equivalent to SQL concatenation

When developers misuse `${}`, SQL injection vulnerabilities can occur even within the MyBatis framework. Common misuse scenarios include:

1. **Numeric injection**: `WHERE age = ${age}` (no quote closure needed)
2. **String injection**: `WHERE name = '${name}'` (quote closure required)
3. **LIKE injection**: `WHERE name LIKE '%${name}%'` (close quotes + percent signs)
4. **Dynamic table name injection**: `FROM logs_${tableName}` (table names cannot be parameterized)
5. **ORDER BY injection**: `ORDER BY ${orderColumn}` (sort columns cannot be parameterized)
6. **IN clause injection**: `AND role IN (${roles})` (IN lists cannot be parameterized)
7. **Blind injection**: Extract data character by character using boolean/time/error conditions

### Real-World Case

In 2020, security audits of multiple enterprise systems using MyBatis discovered `${}` misuse. Attackers exploited ORDER BY injection combined with `IF()` conditions to steal data.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires identifying `${}` injection points) |
| Impact Scope | High (depends on SQL statement permissions) |
| Exploitation Condition | MyBatis Mapper uses `${}` placeholders |
