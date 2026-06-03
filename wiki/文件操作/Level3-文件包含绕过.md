# Level 3 — 文件包含绕过

## 关卡说明

本关模拟文档查看器，对../只做单次替换。可用..../绕过（替换后变为../../），结合文件上传的图片马实现RCE。

**目标**：利用文件操作漏洞，获取当前关卡的 Flag。

## 漏洞原理

接口路径：`GET /api/challenge/file-op/include/page?template=xxx`

## 通关步骤

### Step 1：观察正常功能

正常使用文件操作功能，观察校验逻辑。

### Step 2：构造攻击

输入 `..../..../uploads/avatars/xxx.gif` 绕过单次替换，包含上传的图片马

### Step 3：获取 Flag

攻击成功后响应中包含 Flag。

## 涉及文件

| 文件 | 说明 |
|------|------|
| `controller/challenge/fileoperation/*Controller.java` | 后端文件操作接口 |
| `service/FlagService.java` | Flag 获取与验证 |
