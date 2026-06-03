# Level 2 — Swagger API Documentation Exposure

## Challenge Description

This challenge simulates a production environment where Swagger API documentation was not disabled. Discover hidden internal endpoints via `/v3/api-docs` and call them to get the Flag.

**Objective**: Discover hidden endpoints through Swagger documentation and capture the Flag.

## Walkthrough

### Step 1: Access Swagger Documentation

Visit `/v3/api-docs` or `/swagger-ui.html`.

### Step 2: Discover Hidden Endpoints

Search for "Internal" or "DO NOT EXPOSE" tagged endpoints.

### Step 3: Call Hidden Endpoint

Access `GET /api/challenge/sec-config/swagger/internal/getflag`.

### Step 4: Capture the Flag

The endpoint returns a response containing the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/securityconfig/SwaggerLeakController.java` | Hidden internal endpoint |
| `config/OpenApiConfig.java` | Swagger configuration |
| `service/FlagService.java` | Flag retrieval and validation |
