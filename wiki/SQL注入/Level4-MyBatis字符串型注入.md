# Level 4 — MyBatis字符串型注入

## 关卡说明

本关模拟通过姓名搜索用户，后端使用 MyBatis 的 `${}` 占位符构造字符串型查询条件。攻击者需要先闭合引号再注入SQL。

**目标**：利用 MyBatis `${}` 字符串型注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

后端代码位于 `MybatisNameController.java`，接口路径：

```
GET /api/challenge/injection/mybatis/name?name=xxx
```

**Mapper SQL**：

```xml
<select id="searchByName" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name = '${name}'
</select>
```

**漏洞点**：`name` 参数被单引号包裹后使用 `${}` 拼接，需要先闭合单引号。

## 通关步骤

### Step 1：正常查询

输入 `张三`，观察返回结果和 SQL 预览。

### Step 2：引号闭合注入

输入 `' OR '1'='1`，闭合引号后注入永真条件。

### Step 3：获取 Flag

当输入包含注入特征（单引号+SQL关键词），响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisNameController.java` | 后端姓名搜索接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`WHERE name = '${name}'` |
| `service/FlagService.java` | Flag 获取与验证 |
