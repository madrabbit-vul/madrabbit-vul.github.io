# Level 7 — MyBatis ORDER BY注入

## 关卡说明

本关模拟搜索+排序功能，搜索部分使用了安全的 `#{}` 参数化，但排序部分使用了不安全的 `${}`。这模拟了真实场景中"部分安全、部分不安全"的代码。

**目标**：利用 MyBatis ORDER BY 注入漏洞，获取当前关卡的 Flag。

## 漏洞原理

**Mapper SQL**：

```xml
<select id="searchByNameSafeWithOrder" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users 
    WHERE name LIKE CONCAT('%', #{name}, '%')
    ORDER BY ${orderColumn} ${orderDir}
</select>
```

**漏洞点**：搜索条件 `name` 使用 `#{}` 是安全的，但排序字段 `orderColumn` 和排序方向 `orderDir` 使用 `${}` 是不安全的。

## 通关步骤

### Step 1：正常排序查询

使用 `orderColumn=id&orderDir=ASC`，观察正常返回。

### Step 2：ORDER BY注入

在 `orderColumn` 中注入：`id IF(1=1,id,name)` 或 `id;SELECT SLEEP(3)--`

### Step 3：获取 Flag

注入成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisOrderController.java` | 后端排序搜索接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`ORDER BY ${orderColumn} ${orderDir}` |
| `service/FlagService.java` | Flag 获取与验证 |
