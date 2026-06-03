# XXE External Entity Injection — Vulnerability Principles

## What is XXE?

XXE (XML External Entity Injection) occurs when an attacker defines external entities in an XML document, causing the XML parser to access external resources (such as local files or internal network services) during parsing, thereby reading sensitive data or initiating internal network requests.

The core problem: **The XML parser has external entity resolution enabled and does not impose security restrictions on user-submitted XML content.**

---

## 1. In-band XXE (Classic File Read)

### How It Happens

When the XML parser is configured to allow external entities, attackers can declare an entity pointing to a local file. After parsing, the entity content replaces the reference in the XML document and is returned in the response.

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>
```

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Low (fixed payloads, easy to construct) |
| Impact Scope | High (can read any server file) |
| Exploitation Condition | Requires an endpoint that accepts XML input |

---

## 2. Blind XXE (OOB Exfiltration)

### How It Happens

When XML parsing results are not echoed in the response, attackers cannot directly see entity content. OOB (Out-of-Band) techniques can exfiltrate data by sending entity content as URL parameters to an attacker-controlled server.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | High (requires external server and DTD construction) |
| Impact Scope | High (can read any file) |
| Exploitation Condition | Server must be able to access the internet |

---

## 3. Content-Type Switch XXE

### How It Happens

Some endpoints support both JSON and XML Content-Types. The frontend only uses JSON, but the backend also accepts XML. If the XML parsing path has an XXE vulnerability, attackers simply change the Content-Type from `application/json` to `application/xml` and submit malicious XML.

### Risk Rating

| Dimension | Rating |
|-----------|--------|
| Attack Difficulty | Medium (requires discovering hidden XML support) |
| Impact Scope | High (same as other XXE) |
| Exploitation Condition | Endpoint supports both JSON and XML |
