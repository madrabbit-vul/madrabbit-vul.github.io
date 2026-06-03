# Level 6 — MyBatis Dynamic Table Name Injection

## Challenge Description

This challenge simulates a log query feature where the backend uses MyBatis `${}` for dynamic table name concatenation. Since table names cannot be parameterized with precompiled statements, this is a special injection scenario in MyBatis.

**Objective**: Exploit the MyBatis dynamic table name injection vulnerability to capture the Flag.

## Vulnerability Analysis

**Mapper SQL**:

```xml
<select id="searchLogs" resultType="java.util.Map">
    SELECT * FROM logs_${tableName} LIMIT 20
</select>
```

**Vulnerability**: `tableName` is concatenated directly into the table name position, cannot use `#{}` parameterization. Attackers can inject UNION SELECT or other SQL.

## Walkthrough

### Step 1: Normal Query

Enter `access` to query the `logs_access` table.

### Step 2: Injection Test

Enter `access UNION SELECT 1,2,3,4--` to inject a UNION query after the table name.

### Step 3: Capture the Flag

Successful injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisTableController.java` | Backend log query endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `FROM logs_${tableName}` |
| `service/FlagService.java` | Flag retrieval and validation |
