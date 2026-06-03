# Level 3 — MyBatis Numeric Injection

## Challenge Description

This challenge simulates a user search feature where the backend uses MyBatis `${}` placeholder for numeric query conditions. Attackers can inject SQL fragments to access unauthorized data.

**Objective**: Exploit the MyBatis `${}` numeric injection vulnerability to capture the Flag.

## Vulnerability Analysis

### Code Logic

The backend code is located in `MybatisAgeController.java`. The endpoint:

```
GET /api/challenge/injection/mybatis/age?age=25
```

**Data Flow**:

```
User inputs age parameter
    ↓
MyBatis Mapper: SELECT * FROM challenge_users WHERE age = ${age}
    ↓
${age} is directly replaced with the user input value
    ↓
Numeric injection requires no quote closure — direct injection works
```

### Key Source Code

```xml
<!-- ChallengeUserMapper.xml — Numeric ${} injection -->
<select id="searchByAge" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE age = ${age}
</select>
```

```java
// MybatisAgeController.java
List<ChallengeUser> data = challengeUserMapper.searchByAge(age);
if (containsInjection(age)) {
    String flag = flagService.getFlag("injection", "level3");  // Returns Flag
    result.put("flag", flag);
}
```

**Vulnerability**: The `age` parameter uses `${}` for direct SQL concatenation. No quote closure needed — simplest numeric injection.

## Walkthrough

### Step 1: Normal Query

Enter `25` and observe the returned data and SQL preview.

### Step 2: Injection Test

Enter `25 OR 1=1` and check if all user data is returned.

### Step 3: Capture the Flag

When the input contains injection patterns, the response includes the Flag. Submit it to complete the challenge.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisAgeController.java` | Backend age search endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `WHERE age = ${age}` |
| `service/FlagService.java` | Flag retrieval and validation |
