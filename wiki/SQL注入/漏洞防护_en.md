# SQL Injection — Vulnerability Protection

This document provides code-level fixes and protection recommendations for the various types of vulnerabilities covered in the "SQL Injection" module.

---

## 1. Classic SQL Injection Protection

### 1.1 Use Parameterized Queries (Prepared Statements)

This is the most fundamental protection:

```java
// ❌ Vulnerable code: String concatenation
String sql = "SELECT * FROM users WHERE username='" + username + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);

// ✅ Secure code: Parameterized query
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);
ResultSet rs = pstmt.executeQuery();
```

### 1.2 Input Validation and Whitelisting

For scenarios that cannot be parameterized (such as table names, column names), use whitelist validation:

```java
// Sort column whitelist
private static final Set<String> ALLOWED_ORDER_COLUMNS = Set.of("id", "name", "age", "created_at");

public String validateOrderColumn(String input) {
    if (!ALLOWED_ORDER_COLUMNS.contains(input.toLowerCase())) {
        throw new IllegalArgumentException("Invalid order column");
    }
    return input;
}
```

---

## 2. MyBatis Injection Protection

### 2.1 Use #{} Instead of ${}

```xml
<!-- ❌ Vulnerable code -->
<select id="searchByName" resultType="User">
    SELECT * FROM users WHERE name = '${name}'
</select>

<!-- ✅ Secure code -->
<select id="searchByName" resultType="User">
    SELECT * FROM users WHERE name = #{name}
</select>
```

### 2.2 Special Scenario Solutions

#### Dynamic Table Names

Use whitelist validation in the Controller before passing to MyBatis.

#### ORDER BY

Validate `orderColumn` and `orderDir` against a whitelist in Java code.

#### IN Clause

```xml
<!-- ✅ Secure: Use <foreach> -->
AND role IN
<foreach collection="roleList" item="role" open="(" separator="," close=")">
    #{role}
</foreach>
```

#### LIKE Queries

```xml
<!-- ✅ Secure: Use CONCAT + #{} -->
WHERE name LIKE CONCAT('%', #{name}, '%')
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Classic concatenated SQL | Parameterized queries (PreparedStatement) | Replace string concatenation with `?` placeholder |
| MyBatis `${}` misuse | Replace with `#{}` | `${name}` → `#{name}` |
| Dynamic table/ORDER BY | Whitelist validation | Validate input against allowed list |
| IN clause | Use `<foreach>` | `${roles}` → `#{role}` loop |
| LIKE queries | Use CONCAT + #{} | `'%${name}%'` → `CONCAT('%', #{name}, '%')` |
| Blind injection | Parameterization + least privilege | Use `#{}` + restrict database user permissions |

**Core Principle**: Never concatenate user input directly into SQL statements. All user input must be passed through parameterized queries.
