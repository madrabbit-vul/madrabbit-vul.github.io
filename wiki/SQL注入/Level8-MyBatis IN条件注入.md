# Level 8 — MyBatis IN条件注入

## 关卡说明

本关模拟搜索+角色筛选功能，搜索部分安全，角色筛选部分使用了 `${}` 构造 IN 条件。

**目标**：利用 MyBatis IN 条件注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

**Mapper SQL**：

```xml
<select id="searchByNameSafeWithRoles" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users 
    WHERE name LIKE CONCAT('%', #{name}, '%')
    <if test="roles != null and roles != ''">
        AND role IN (${roles})
    </if>
</select>
```

**漏洞点**：`roles` 参数使用 `${}` 直接拼接到 IN 条件中，攻击者可以注入SQL。

## 通关步骤

### Step 1：正常查询

使用 `roles='user','admin'`，观察正常返回。

### Step 2：IN条件注入

在 `roles` 中注入：`'user') UNION SELECT 1,2,3,4,5,6--` 或 `'user') OR 1=1--`

### Step 3：获取 Flag

注入成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisInController.java` | 后端角色筛选接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`AND role IN (${roles})` |
| `service/FlagService.java` | Flag 获取与验证 |
