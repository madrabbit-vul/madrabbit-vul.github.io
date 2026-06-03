# XXE External Entity Injection — Vulnerability Protection

---

## 1. Disable External Entities

This is the most fundamental protection:

```java
// ✅ Secure configuration: Disable external entities
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
factory.setXIncludeAware(false);
factory.setExpandEntityReferences(false);
```

---

## 2. Use Safe Parsers / Remove XML Support

```java
// ✅ Only accept JSON
@PostMapping(value = "/update", consumes = "application/json")
```

---

## Protection Summary

| Vulnerability Type | Core Protection | Key Code Change |
|-------------------|----------------|-----------------|
| In-band XXE | Disable external entities | `setFeature("disallow-doctype-decl", true)` |
| Blind XXE | Disable external entities + block outbound | Same + firewall egress rules |
| Content-Type switch XXE | Remove XML support | `consumes = "application/json"` |

**Core Principle**: If XML parsing is required, always disable external entities and DOCTYPE declarations. If XML is not needed, don't accept XML input.
