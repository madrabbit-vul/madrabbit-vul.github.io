# Level 9 — 盲注

## 关卡说明

本关模拟用户搜索功能，但接口只返回"用户存在"或"用户不存在"的布尔结果，不回显数据。攻击者需要通过布尔盲注、时间盲注或报错盲注逐字符提取数据。

**目标**：利用盲注漏洞，获取当前关卡的 Flag。

## 漏洞原理

**Mapper SQL**：

```xml
<select id="searchByNameBlind" resultType="com.madrabbit.entity.ChallengeUser">
    SELECT * FROM challenge_users WHERE name = '${name}'
</select>
```

**接口返回**：仅返回 `exists: true/false`，不返回具体数据。

### 盲注类型

1. **布尔盲注**：通过 `SUBSTRING()` + `IF()` 逐字符判断
2. **时间盲注**：通过 `SLEEP()` 根据响应时间判断
3. **报错盲注**：通过 `EXTRACTVALUE()` / `UPDATEXML()` 从错误信息中提取数据

## 通关步骤

### Step 1：观察布尔响应

输入存在的用户名 → `exists: true`，输入不存在的 → `exists: false`

### Step 2：构造盲注Payload

输入 `张三' AND SUBSTRING(database(),1,1)='m'--`，通过真/假判断数据

或输入 `张三' AND IF(1=1,SLEEP(3),0)--`，通过响应时间判断

### Step 3：获取 Flag

输入包含盲注特征（`SUBSTRING`/`SLEEP`/`EXTRACTVALUE`等），响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/injection/MybatisBlindController.java` | 后端盲注接口 |
| `repository/ChallengeUserMapper.xml` | MyBatis Mapper，`WHERE name = '${name}'` |
| `service/FlagService.java` | Flag 获取与验证 |
