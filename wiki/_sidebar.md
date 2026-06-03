- [项目简介](项目简介.md) | [Intro](项目简介_en.md)
- [如何部署](如何部署.md) | [Deploy](如何部署_en.md)

---

**SQL注入**
- [漏洞原理](SQL注入/漏洞原理.md) | [EN](SQL注入/漏洞原理_en.md)
- [漏洞防护](SQL注入/漏洞防护.md) | [EN](SQL注入/漏洞防护_en.md)
- [Level1 - SQL登录绕过](SQL注入/Level1-SQL登录绕过.md) | [EN](SQL注入/Level1-SQL%20Login%20Bypass_en.md)
- [Level2 - UNION数据泄露](SQL注入/Level2-UNION数据泄露.md) | [EN](SQL注入/Level2-UNION%20Data%20Leakage_en.md)
- [Level3 - MyBatis数字型注入](SQL注入/Level3-MyBatis数字型注入.md) | [EN](SQL注入/Level3-MyBatis%20Numeric%20Injection_en.md)
- [Level4 - MyBatis字符串型注入](SQL注入/Level4-MyBatis字符串型注入.md) | [EN](SQL注入/Level4-MyBatis%20String%20Injection_en.md)
- [Level5 - MyBatis LIKE注入](SQL注入/Level5-MyBatis%20LIKE注入.md) | [EN](SQL注入/Level5-MyBatis%20LIKE%20Injection_en.md)
- [Level6 - MyBatis动态表名注入](SQL注入/Level6-MyBatis动态表名注入.md) | [EN](SQL注入/Level6-MyBatis%20Dynamic%20Table%20Name%20Injection_en.md)
- [Level7 - MyBatis ORDER BY注入](SQL注入/Level7-MyBatis%20ORDER%20BY注入.md) | [EN](SQL注入/Level7-MyBatis%20ORDER%20BY%20Injection_en.md)
- [Level8 - MyBatis IN条件注入](SQL注入/Level8-MyBatis%20IN条件注入.md) | [EN](SQL注入/Level8-MyBatis%20IN%20Clause%20Injection_en.md)
- [Level9 - 盲注](SQL注入/Level9-盲注.md) | [EN](SQL注入/Level9-Blind%20SQL%20Injection_en.md)

**跨站脚本 XSS**
- [漏洞原理](跨站脚本/漏洞原理.md) | [EN](跨站脚本/漏洞原理_en.md)
- [漏洞防护](跨站脚本/漏洞防护.md) | [EN](跨站脚本/漏洞防护_en.md)
- [Level1 - 反射型XSS](跨站脚本/Level1-反射型XSS.md) | [EN](跨站脚本/Level1-Reflected%20XSS_en.md)
- [Level2 - 存储型XSS](跨站脚本/Level2-存储型XSS.md) | [EN](跨站脚本/Level2-Stored%20XSS_en.md)
- [Level3 - DOM型XSS](跨站脚本/Level3-DOM型XSS.md) | [EN](跨站脚本/Level3-DOM-based%20XSS_en.md)

**XXE外部实体注入**
- [漏洞原理](XXE外部实体注入/漏洞原理.md) | [EN](XXE外部实体注入/漏洞原理_en.md)
- [漏洞防护](XXE外部实体注入/漏洞防护.md) | [EN](XXE外部实体注入/漏洞防护_en.md)
- [Level1 - 有回显XXE文件读取](XXE外部实体注入/Level1-有回显XXE文件读取.md) | [EN](XXE外部实体注入/Level1-In-band%20XXE%20File%20Read_en.md)
- [Level2 - Blind XXE OOB外带](XXE外部实体注入/Level2-Blind%20XXE%20OOB外带.md) | [EN](XXE外部实体注入/Level2-Blind%20XXE%20OOB%20Exfiltration_en.md)
- [Level3 - Content-Type切换XXE](XXE外部实体注入/Level3-Content-Type切换XXE.md) | [EN](XXE外部实体注入/Level3-Content-Type%20Switch%20XXE_en.md)

**CSRF 跨站请求伪造**
- [漏洞原理](跨站请求伪造/漏洞原理.md) | [EN](跨站请求伪造/漏洞原理_en.md)
- [漏洞防护](跨站请求伪造/漏洞防护.md) | [EN](跨站请求伪造/漏洞防护_en.md)
- [Level1 - GET型CSRF](跨站请求伪造/Level1-GET型CSRF.md) | [EN](跨站请求伪造/Level1-GET-based%20CSRF_en.md)
- [Level2 - POST型CSRF](跨站请求伪造/Level2-POST型CSRF.md) | [EN](跨站请求伪造/Level2-POST-based%20CSRF_en.md)
- [Level3 - 无效CSRF Token](跨站请求伪造/Level3-无效CSRF%20Token.md) | [EN](跨站请求伪造/Level3-Ineffective%20CSRF%20Token_en.md)

**SSRF 服务器端请求伪造**
- [漏洞原理](服务器端请求伪造/漏洞原理.md) | [EN](服务器端请求伪造/漏洞原理_en.md)
- [漏洞防护](服务器端请求伪造/漏洞防护.md) | [EN](服务器端请求伪造/漏洞防护_en.md)
- [Level1 - 基础SSRF](服务器端请求伪造/Level1-基础SSRF.md) | [EN](服务器端请求伪造/Level1-Basic%20SSRF_en.md)
- [Level2 - 协议利用SSRF](服务器端请求伪造/Level2-协议利用SSRF.md) | [EN](服务器端请求伪造/Level2-Protocol%20Exploitation%20SSRF_en.md)
- [Level3 - 过滤绕过SSRF](服务器端请求伪造/Level3-过滤绕过SSRF.md) | [EN](服务器端请求伪造/Level3-Filter%20Bypass%20SSRF_en.md)
- [Level4 - 重定向绕过SSRF](服务器端请求伪造/Level4-重定向绕过SSRF.md) | [EN](服务器端请求伪造/Level4-Redirect%20Bypass%20SSRF_en.md)

**远程命令执行 RCE**
- [漏洞原理](远程命令执行/漏洞原理.md) | [EN](远程命令执行/漏洞原理_en.md)
- [漏洞防护](远程命令执行/漏洞防护.md) | [EN](远程命令执行/漏洞防护_en.md)
- [Level1 - 命令注入](远程命令执行/Level1-命令注入.md) | [EN](远程命令执行/Level1-Command%20Injection_en.md)
- [Level2 - SpEL代码注入](远程命令执行/Level2-SpEL代码注入.md) | [EN](远程命令执行/Level2-SpEL%20Code%20Injection_en.md)
- [Level3 - 过滤绕过](远程命令执行/Level3-过滤绕过.md) | [EN](远程命令执行/Level3-Filter%20Bypass_en.md)

**失效的访问控制**
- [漏洞原理](失效的访问控制/漏洞原理.md) | [EN](失效的访问控制/漏洞原理_en.md)
- [漏洞防护](失效的访问控制/漏洞防护.md) | [EN](失效的访问控制/漏洞防护_en.md)
- [Level1 - 水平越权](失效的访问控制/Level1-水平越权.md) | [EN](失效的访问控制/Level1-Horizontal%20Escalation_en.md)
- [Level2 - 垂直越权](失效的访问控制/Level2-垂直越权.md) | [EN](失效的访问控制/Level2-Vertical%20Escalation_en.md)
- [Level3 - IDOR越权](失效的访问控制/Level3-IDOR越权.md) | [EN](失效的访问控制/Level3-IDOR_en.md)

**文件操作**
- [漏洞原理](文件操作/漏洞原理.md) | [EN](文件操作/漏洞原理_en.md)
- [漏洞防护](文件操作/漏洞防护.md) | [EN](文件操作/漏洞防护_en.md)
- [Level1 - 文件上传绕过](文件操作/Level1-文件上传绕过.md) | [EN](文件操作/Level1-File%20Upload%20Bypass_en.md)
- [Level2 - 路径遍历](文件操作/Level2-路径遍历.md) | [EN](文件操作/Level2-Path%20Traversal_en.md)
- [Level3 - 文件包含绕过](文件操作/Level3-文件包含绕过.md) | [EN](文件操作/Level3-File%20Inclusion%20Bypass_en.md)

**安全配置**
- [漏洞原理](安全配置/漏洞原理.md) | [EN](安全配置/漏洞原理_en.md)
- [漏洞防护](安全配置/漏洞防护.md) | [EN](安全配置/漏洞防护_en.md)
- [Level1 - Actuator端点泄露](安全配置/Level1-Actuator端点泄露.md) | [EN](安全配置/Level1-Actuator%20Endpoint%20Exposure_en.md)
- [Level2 - Swagger API文档泄露](安全配置/Level2-Swagger%20API文档泄露.md) | [EN](安全配置/Level2-Swagger%20API%20Doc%20Exposure_en.md)

**敏感信息泄露**
- [漏洞原理](敏感信息泄露/漏洞原理.md) | [EN](敏感信息泄露/漏洞原理_en.md)
- [漏洞防护](敏感信息泄露/漏洞防护.md) | [EN](敏感信息泄露/漏洞防护_en.md)
- [Level1 - 错误信息泄露](敏感信息泄露/Level1-错误信息泄露.md) | [EN](敏感信息泄露/Level1-Error%20Message%20Disclosure_en.md)
- [Level2 - 前端硬编码泄露](敏感信息泄露/Level2-前端硬编码泄露.md) | [EN](敏感信息泄露/Level2-Frontend%20Hardcoded%20Secrets_en.md)
- [Level3 - Git信息泄露](敏感信息泄露/Level3-Git信息泄露.md) | [EN](敏感信息泄露/Level3-Git%20Repository%20Exposure_en.md)

**认证与会话安全**
- [漏洞原理](认证与会话安全/漏洞原理.md) | [EN](认证与会话安全/漏洞原理_en.md)
- [漏洞防护](认证与会话安全/漏洞防护.md) | [EN](认证与会话安全/漏洞防护_en.md)
- [Level1 - 弱密码破解](认证与会话安全/Level1-弱密码破解.md) | [EN](认证与会话安全/Level1-弱密码破解_en.md)
- [Level2 - 任意密码重置](认证与会话安全/Level2-任意密码重置.md) | [EN](认证与会话安全/Level2-任意密码重置_en.md)
- [Level3 - JWT令牌安全](认证与会话安全/Level3-JWT令牌安全.md) | [EN](认证与会话安全/Level3-JWT令牌安全_en.md)

**业务逻辑**
- [漏洞原理](业务逻辑/漏洞原理.md) | [EN](业务逻辑/漏洞原理_en.md)
- [漏洞防护](业务逻辑/漏洞防护.md) | [EN](业务逻辑/漏洞防护_en.md)
- [Level1 - 价格篡改](业务逻辑/Level1-价格篡改.md) | [EN](业务逻辑/Level1-Price%20Tampering_en.md)
- [Level2 - 优惠券滥用](业务逻辑/Level2-优惠券滥用.md) | [EN](业务逻辑/Level2-Coupon%20Abuse_en.md)
- [Level3 - 流程跳过](业务逻辑/Level3-流程跳过.md) | [EN](业务逻辑/Level3-Process%20Skip_en.md)

**不安全的反序列化**
- [漏洞原理](不安全的反序列化/漏洞原理.md) | [EN](不安全的反序列化/漏洞原理_en.md)
- [漏洞防护](不安全的反序列化/漏洞防护.md) | [EN](不安全的反序列化/漏洞防护_en.md)
- [Level1 - Java原生反序列化](不安全的反序列化/Level1-Java原生反序列化.md) | [EN](不安全的反序列化/Level1-Java%20Native%20Deserialization_en.md)
- [Level2 - Fastjson反序列化](不安全的反序列化/Level2-Fastjson反序列化.md) | [EN](不安全的反序列化/Level2-Fastjson%20Deserialization_en.md)
- [Level3 - Log4Shell](不安全的反序列化/Level3-Log4Shell.md) | [EN](不安全的反序列化/Level3-Log4Shell_en.md)
