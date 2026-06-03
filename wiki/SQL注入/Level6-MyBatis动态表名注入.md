# Level 6 — MyBatis动态表名注入

## 关卡说明

本关模拟日志查询功能，后端使用 MyBatis 的 `${}` 拼接动态表名。由于表名无法使用预编译参数化，这是 MyBatis 中一类特殊的注入场景。

**目标**：利用 MyBatis 动态表名注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

**Mapper SQL**：

```xml
<select id="searchLogs" resultType="java.util.Map">
    SELECT * FROM logs_${tableName} LIMIT 20
</select>
```

**漏洞点**：`tableName` 直接拼接到表名位置，无法使用 `#{}` 参数化，攻击者可注入 UNION SELECT 或其他SQL。

## 通关步骤

### Step 1：正常查询

输入 `access`，查询 `logs_access` 表。

### Step 2：注入测试

输入 `access UNION SELECT 1,2,3,4--`，在表名后注入UNION查询。

### Step 3：获取 Flag

注入成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisTableController.java` | 后端日志查询接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`FROM logs_${tableName}` |
| `service/FlagService.java` | Flag 获取与验证 |
