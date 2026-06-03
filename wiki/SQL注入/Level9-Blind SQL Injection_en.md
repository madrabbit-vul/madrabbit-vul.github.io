# Level 9 — Blind SQL Injection

## Challenge Description

This challenge simulates a user search feature where the endpoint only returns a boolean result ("user exists" or "user does not exist") without echoing data. Attackers must extract data character by character using boolean-based, time-based, or error-based blind injection.

**Objective**: Exploit the blind injection vulnerability to capture the Flag.

## Vulnerability Analysis

**Mapper SQL**:

```xml
<select id="searchByNameBlind" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name = '${name}'
</select>
```

**Response**: Only returns `exists: true/false`, no data echoed.

### Blind Injection Types

1. **Boolean-based**: Use `SUBSTRING()` + `IF()` to judge character by character
2. **Time-based**: Use `SLEEP()` to judge by response time
3. **Error-based**: Use `EXTRACTVALUE()` / `UPDATEXML()` to extract data from error messages

## Walkthrough

### Step 1: Observe Boolean Response

Enter an existing username → `exists: true`, enter a non-existing one → `exists: false`

### Step 2: Construct Blind Injection Payload

Enter `Alice' AND SUBSTRING(database(),1,1)='m'--` to judge data via true/false

Or enter `Alice' AND IF(1=1,SLEEP(3),0)--` to judge by response time

### Step 3: Capture the Flag

When input contains blind injection patterns (`SUBSTRING`/`SLEEP`/`EXTRACTVALUE` etc.), the response includes the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/MybatisBlindController.java` | Backend blind injection endpoint |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper, `WHERE name = '${name}'` |
| `service/FlagService.java` | Flag retrieval and validation |
