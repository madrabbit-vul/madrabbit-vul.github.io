# Insecure Deserialization — Vulnerability Protection

---

## 1. Java Native Deserialization Protection

### ObjectInputFilter (Java 9+)

```java
ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(decoded));
ois.setObjectInputFilter(filterInfo -> {
    Class<?> clazz = filterInfo.serialClass();
    if (clazz == null) return ObjectInputFilter.Status.ALLOWED;
    String className = clazz.getName();
    if (className.startsWith("java.")) return ObjectInputFilter.Status.ALLOWED;
    if (className.equals("com.madrabbit.entity.SessionData")) return ObjectInputFilter.Status.ALLOWED;
    return ObjectInputFilter.Status.REJECTED;
});
```

### Avoid Deserializing Untrusted Data

Use safe formats like JSON instead of Java serialization for user input.

---

## 2. Fastjson Protection

### Upgrade Fastjson

```xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.40</version>
</dependency>
```

### Disable AutoType

```java
ParserConfig.getGlobalInstance().setAutoTypeSupport(false);
ParserConfig.getGlobalInstance().setSafeMode(true);
```

### Specify Target Class

```java
UserConfig config = JSON.parseObject(rawBody, UserConfig.class);
```

---

## 3. Log4Shell Protection

### Upgrade Log4j2

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.1</version>
</dependency>
```

### Temporary Mitigation

```yaml
logging:
  log4j2:
    formatMsgNoLookups: true
```

```bash
-Dlog4j2.formatMsgNoLookups=true
-Dlog4j2.enableJndiLookup=false
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| Java native deserialization | ObjectInputFilter + avoid untrusted deserialization | `ois.setObjectInputFilter()` + use JSON instead |
| Fastjson deserialization | Upgrade + disable AutoType | `setAutoTypeSupport(false)` + `setSafeMode(true)` |
| Log4Shell | Upgrade Log4j2 + disable JNDI lookup | Upgrade to 2.17.1+ + `formatMsgNoLookups=true` |

**Core Principle**: Never deserialize untrusted data. Use safe data formats (like JSON) and keep dependencies updated.
