# Level 3 — MyBatis数字型注入

## 关卡说明

本关模拟用户搜索功能，后端使用 MyBatis 的 `${}` 占位符构造数字型查询条件。攻击者可以通过注入SQL片段获取未授权数据。

**目标**：利用 MyBatis `${}` 数字型注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

### 代码逻辑分析

后端代码位于 `MybatisAgeController.java`，接口路径：

```
GET /api/challenge/injection/mybatis/age?age=25
```

**数据流**：

```
用户输入 age 参数
    ↓
MyBatis Mapper: SELECT * FROM challenge_users WHERE age = ${age}
    ↓
${age} 被直接替换为用户输入值
    ↓
数字型注入不需要引号闭合，直接注入即可
```

### 源码关键片段

```xml
<!-- ChallengeUserMapper.xml — 数字型 ${} 注入 -->
<select id="searchByAge" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE age = ${age}
</select>
```

```java
// MybatisAgeController.java
List<ChallengeUser> data = challengeUserMapper.searchByAge(age);
if (containsInjection(age)) {
    String flag = flagService.getFlag("injection", "level3");  // 返回当前关卡 Flag
    result.put("flag", flag);
}
```

**漏洞点**：`age` 参数使用 `${}` 直接拼接到SQL中，无需引号闭合，是最简单的数字型注入。

## 通关步骤

### Step 1：正常查询

输入 `25`，观察返回的数据和 SQL 预览。

### Step 2：注入测试

输入 `25 OR 1=1`，观察是否返回了所有用户数据。

### Step 3：获取 Flag

当输入包含注入特征时，响应中包含 Flag，将获得的 Flag 提交通关。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisAgeController.java` | 后端年龄搜索接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`WHERE age = ${age}` |
| `service/FlagService.java` | Flag 获取与验证 |
