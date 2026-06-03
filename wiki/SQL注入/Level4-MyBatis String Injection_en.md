# Level 4 — MyBatis String Injection

## Challenge Description

This challenge simulates searching users by name, where the backend uses MyBatis `${}` placeholder for string query conditions. Attackers must close the quotes before injecting SQL.

**Objective**: Exploit the MyBatis `${}` string injection vulnerability to capture the Flag.

## Vulnerability Analysis

### Code Logic

The backend code is located in `MybatisNameController.java`. The endpoint:

```
GET /api/challenge/injection/mybatis/name?name=xxx
```

**Mapper SQL**:

```xml
<select id="searchByName" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name = '${name}'
</select>
```

**Vulnerability**: The `name` parameter is wrapped in single quotes and uses `${}` concatenation. Must close the single quote first.

## Walkthrough

### Step 1: Normal Query

Enter `Alice` and observe the results and SQL preview.

### Step 2: Quote Closure Injection

Enter `' OR '1'='1` to close the quote and inject a tautology.

### Step 3: Capture the Flag

When the input contains injection patterns (quote + SQL keyword), the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisNameController.java` | Backend name search endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `WHERE name = '${name}'` |
| `service/FlagService.java` | Flag retrieval and validation |
