- [Introduction](项目简介_en.md)
- [Deployment Guide](如何部署_en.md)

---

**SQL Injection**
- [Principle](SQL注入/漏洞原理_en.md)
- [Prevention](SQL注入/漏洞防护_en.md)
- [Level1 - SQL Login Bypass](SQL注入/Level1-SQL%20Login%20Bypass_en.md)
- [Level2 - UNION Data Leakage](SQL注入/Level2-UNION%20Data%20Leakage_en.md)
- [Level3 - MyBatis Numeric Injection](SQL注入/Level3-MyBatis%20Numeric%20Injection_en.md)
- [Level4 - MyBatis String Injection](SQL注入/Level4-MyBatis%20String%20Injection_en.md)
- [Level5 - MyBatis LIKE Injection](SQL注入/Level5-MyBatis%20LIKE%20Injection_en.md)
- [Level6 - MyBatis Dynamic Table Name](SQL注入/Level6-MyBatis%20Dynamic%20Table%20Name%20Injection_en.md)
- [Level7 - MyBatis ORDER BY Injection](SQL注入/Level7-MyBatis%20ORDER%20BY%20Injection_en.md)
- [Level8 - MyBatis IN Clause Injection](SQL注入/Level8-MyBatis%20IN%20Clause%20Injection_en.md)
- [Level9 - Blind SQL Injection](SQL注入/Level9-Blind%20SQL%20Injection_en.md)

**Cross-Site Scripting (XSS)**
- [Principle](跨站脚本/漏洞原理_en.md)
- [Prevention](跨站脚本/漏洞防护_en.md)
- [Level1 - Reflected XSS](跨站脚本/Level1-Reflected%20XSS_en.md)
- [Level2 - Stored XSS](跨站脚本/Level2-Stored%20XSS_en.md)
- [Level3 - DOM-based XSS](跨站脚本/Level3-DOM-based%20XSS_en.md)

**XXE Injection**
- [Principle](XXE外部实体注入/漏洞原理_en.md)
- [Prevention](XXE外部实体注入/漏洞防护_en.md)
- [Level1 - In-band XXE File Read](XXE外部实体注入/Level1-In-band%20XXE%20File%20Read_en.md)
- [Level2 - Blind XXE OOB Exfiltration](XXE外部实体注入/Level2-Blind%20XXE%20OOB%20Exfiltration_en.md)
- [Level3 - Content-Type Switch XXE](XXE外部实体注入/Level3-Content-Type%20Switch%20XXE_en.md)

**CSRF**
- [Principle](跨站请求伪造/漏洞原理_en.md)
- [Prevention](跨站请求伪造/漏洞防护_en.md)
- [Level1 - GET-based CSRF](跨站请求伪造/Level1-GET-based%20CSRF_en.md)
- [Level2 - POST-based CSRF](跨站请求伪造/Level2-POST-based%20CSRF_en.md)
- [Level3 - Ineffective CSRF Token](跨站请求伪造/Level3-Ineffective%20CSRF%20Token_en.md)

**SSRF**
- [Principle](服务器端请求伪造/漏洞原理_en.md)
- [Prevention](服务器端请求伪造/漏洞防护_en.md)
- [Level1 - Basic SSRF](服务器端请求伪造/Level1-Basic%20SSRF_en.md)
- [Level2 - Protocol Exploitation](服务器端请求伪造/Level2-Protocol%20Exploitation%20SSRF_en.md)
- [Level3 - Filter Bypass](服务器端请求伪造/Level3-Filter%20Bypass%20SSRF_en.md)
- [Level4 - Redirect Bypass](服务器端请求伪造/Level4-Redirect%20Bypass%20SSRF_en.md)

**Remote Code Execution**
- [Principle](远程命令执行/漏洞原理_en.md)
- [Prevention](远程命令执行/漏洞防护_en.md)
- [Level1 - Command Injection](远程命令执行/Level1-Command%20Injection_en.md)
- [Level2 - SpEL Code Injection](远程命令执行/Level2-SpEL%20Code%20Injection_en.md)
- [Level3 - Filter Bypass](远程命令执行/Level3-Filter%20Bypass_en.md)

**Access Control**
- [Principle](失效的访问控制/漏洞原理_en.md)
- [Prevention](失效的访问控制/漏洞防护_en.md)
- [Level1 - Horizontal Escalation](失效的访问控制/Level1-Horizontal%20Escalation_en.md)
- [Level2 - Vertical Escalation](失效的访问控制/Level2-Vertical%20Escalation_en.md)
- [Level3 - IDOR](失效的访问控制/Level3-IDOR_en.md)

**File Operation**
- [Principle](文件操作/漏洞原理_en.md)
- [Prevention](文件操作/漏洞防护_en.md)
- [Level1 - File Upload Bypass](文件操作/Level1-File%20Upload%20Bypass_en.md)
- [Level2 - Path Traversal](文件操作/Level2-Path%20Traversal_en.md)
- [Level3 - File Inclusion Bypass](文件操作/Level3-File%20Inclusion%20Bypass_en.md)

**Security Misconfiguration**
- [Principle](安全配置/漏洞原理_en.md)
- [Prevention](安全配置/漏洞防护_en.md)
- [Level1 - Actuator Endpoint Exposure](安全配置/Level1-Actuator%20Endpoint%20Exposure_en.md)
- [Level2 - Swagger API Doc Exposure](安全配置/Level2-Swagger%20API%20Doc%20Exposure_en.md)

**Information Disclosure**
- [Principle](敏感信息泄露/漏洞原理_en.md)
- [Prevention](敏感信息泄露/漏洞防护_en.md)
- [Level1 - Error Message Disclosure](敏感信息泄露/Level1-Error%20Message%20Disclosure_en.md)
- [Level2 - Frontend Hardcoded Secrets](敏感信息泄露/Level2-Frontend%20Hardcoded%20Secrets_en.md)
- [Level3 - Git Repository Exposure](敏感信息泄露/Level3-Git%20Repository%20Exposure_en.md)

**Authentication & Session**
- [Principle](认证与会话安全/漏洞原理_en.md)
- [Prevention](认证与会话安全/漏洞防护_en.md)
- [Level1 - Brute Force](认证与会话安全/Level1-弱密码破解_en.md)
- [Level2 - Password Reset Bypass](认证与会话安全/Level2-任意密码重置_en.md)
- [Level3 - JWT Token Security](认证与会话安全/Level3-JWT令牌安全_en.md)

**Business Logic Flaws**
- [Principle](业务逻辑/漏洞原理_en.md)
- [Prevention](业务逻辑/漏洞防护_en.md)
- [Level1 - Price Tampering](业务逻辑/Level1-Price%20Tampering_en.md)
- [Level2 - Coupon Abuse](业务逻辑/Level2-Coupon%20Abuse_en.md)
- [Level3 - Process Skip](业务逻辑/Level3-Process%20Skip_en.md)

**Insecure Deserialization**
- [Principle](不安全的反序列化/漏洞原理_en.md)
- [Prevention](不安全的反序列化/漏洞防护_en.md)
- [Level1 - Java Native Deserialization](不安全的反序列化/Level1-Java%20Native%20Deserialization_en.md)
- [Level2 - Fastjson Deserialization](不安全的反序列化/Level2-Fastjson%20Deserialization_en.md)
- [Level3 - Log4Shell](不安全的反序列化/Level3-Log4Shell_en.md)
