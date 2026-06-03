# Level 1 — Actuator Endpoint Exposure

## Challenge Description

This challenge simulates a Spring Boot Actuator misconfiguration where `/actuator/env` exposes application configuration containing the Flag.

**Objective**: Access the Actuator endpoint to obtain the Flag from environment variables.

## Walkthrough

### Step 1: Discover Actuator Endpoints

Visit `/actuator` to see available endpoints.

### Step 2: Access env Endpoint

Visit `/actuator/env` and search for `app.secret-flag` or `flag` related properties.

### Step 3: Capture the Flag

Extract the Flag value from environment variables.

## Related Files

| File | Description |
|------|-------------|
| `config/ActuatorFlagConfig.java` | Injects Flag into Spring Environment |
| `service/FlagService.java` | Flag retrieval and validation |
