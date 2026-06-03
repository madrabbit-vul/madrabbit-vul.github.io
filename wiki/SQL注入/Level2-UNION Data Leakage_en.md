# Level 2 — UNION Data Leakage

## Challenge Overview

This level simulates a user search feature with string concatenation in LIKE queries. Attackers can use UNION injection to access hidden sensitive data.

**Objective**: Use UNION injection to access hidden table data and obtain the Flag.

## Vulnerability Principle

### Code Logic Analysis

Backend code: `SqlDataController.java`, endpoint:

```
GET /api/challenge/injection/data/search?keyword=xxx
```

**Vulnerability**: Search keyword is directly concatenated into the SQL LIKE condition. Attackers can close the query and append UNION SELECT statements.

## Walkthrough

1. Normal search, observe data structure and SQL preview
2. Input `' UNION SELECT 1,2,3,4--` to detect column count
3. Input `' UNION SELECT id,name,email,role FROM secrets--` to access hidden data
4. Obtain the Flag and submit

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/injection/SqlDataController.java` | Backend search endpoint |
| `service/FlagService.java` | Flag retrieval and validation |
