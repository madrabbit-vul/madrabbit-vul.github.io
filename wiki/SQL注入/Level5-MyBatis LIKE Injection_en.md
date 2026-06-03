# Level 5 — MyBatis LIKE Injection

## Challenge Description

This challenge simulates name fuzzy search, where the backend uses MyBatis `${}` placeholder for LIKE query conditions. Attackers must close the `%` and quotes.

**Objective**: Exploit the MyBatis LIKE injection vulnerability to capture the Flag.

## Vulnerability Analysis

**Mapper SQL**:

```xml
<select id="searchByNameLike" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name LIKE '%${name}%'
</select>
```

**Vulnerability**: In the LIKE statement, `${name}` is wrapped in `'%...%'`. Must close the `%` and quotes.

## Walkthrough

### Step 1: Normal Fuzzy Search

Enter a partial name and observe results.

### Step 2: Close LIKE Statement

Enter `%' OR '1'='1'%` or `' UNION SELECT--` to close the LIKE pattern.

### Step 3: Capture the Flag

Successful injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisLikeController.java` | Backend fuzzy search endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `LIKE '%${name}%'` |
| `service/FlagService.java` | Flag retrieval and validation |
