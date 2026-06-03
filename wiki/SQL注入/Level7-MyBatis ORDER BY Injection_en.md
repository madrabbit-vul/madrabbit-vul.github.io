# Level 7 — MyBatis ORDER BY Injection

## Challenge Description

This challenge simulates a search + sort feature. The search part uses safe `#{}` parameterization, but the sorting part uses unsafe `${}`. This mirrors real-world scenarios with "partially safe, partially unsafe" code.

**Objective**: Exploit the MyBatis ORDER BY injection vulnerability to capture the Flag.

## Vulnerability Analysis

**Mapper SQL**:

```xml
<select id="searchByNameSafeWithOrder" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users 
    WHERE name LIKE CONCAT('%', #{name}, '%')
    ORDER BY ${orderColumn} ${orderDir}
</select>
```

**Vulnerability**: The search condition `name` uses `#{}` (safe), but sort fields `orderColumn` and `orderDir` use `${}` (unsafe).

## Walkthrough

### Step 1: Normal Sorted Query

Use `orderColumn=id&orderDir=ASC` and observe normal results.

### Step 2: ORDER BY Injection

Inject into `orderColumn`: `id IF(1=1,id,name)` or `id;SELECT SLEEP(3)--`

### Step 3: Capture the Flag

Successful injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisOrderController.java` | Backend sort search endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `ORDER BY ${orderColumn} ${orderDir}` |
| `service/FlagService.java` | Flag retrieval and validation |
