# Level 5 — MyBatis LIKE注入

## 关卡说明

本关模拟姓名模糊搜索，后端使用 MyBatis 的 `${}` 占位符构造 LIKE 查询条件。攻击者需要闭合 `%` 和引号。

**目标**：利用 MyBatis LIKE 注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

接口路径：`GET /api/challenge/injection/mybatis/like?name=xxx`

**Mapper SQL**：

```xml
<select id="searchByNameLike" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name LIKE '%${name}%'
</select>
```

**漏洞点**：LIKE 语句中 `${name}` 被包裹在 `'%...%'` 中，需要闭合 `%` 和引号。

## 通关步骤

### Step 1：正常模糊搜索

输入 `张`，观察返回结果。

### Step 2：闭合 LIKE 注入

输入 `%' OR '1'='1'%` 或 `' UNION SELECT--` 闭合 LIKE 语句。

### Step 3：获取 Flag

注入成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisLikeController.java` | 后端模糊搜索接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`LIKE '%${name}%'` |
| `service/FlagService.java` | Flag 获取与验证 |
