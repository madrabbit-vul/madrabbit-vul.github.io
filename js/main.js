/* ============================================
   MadRabbit Web Security Vulnerability Lab Platform - Main Script
   滚动动画 / 交互逻辑 / 中英双语 i18n
   ============================================ */

(function () {
  'use strict';

  /* --------------------------------------------
   *  i18n dictionary
   *  默认英文 (en) ；切换到中文 (zh)
   * -------------------------------------------- */
  var I18N = {
    en: {
      'hero.subtitle': 'Master every web vulnerability through realistic business scenarios, understanding from source code level',
      'stat.categories': 'Categories',
      'stat.challenges': 'Challenges',
      'stat.opensource': 'Open Source Project',
      'btn.github': 'GitHub',
      'btn.wiki': 'Wiki',

      'philosophy.intro': 'In an era where Anthropic\u2019s Mythos discovers 10,000+ vulnerabilities in a single month',
      'philosophy.question': 'Does learning the underlying principles of vulnerabilities still matter?',
      'philosophy.answer': 'The answer is simple',
      'philosophy.quote': '\u201cWhen you interview for a security engineer position, those who deeply understand vulnerability principles get hired \u2014 those who only know how to use tools don\u2019t\u201d',
      'philosophy.narrative': 'There\u2019s a narrative on the internet:',
      'philosophy.narrative.quote': '\u201cAI is so powerful, no need to learn languages, no need to learn programming, no need to learn writing\u2026\u201d',
      'philosophy.narrative.response': 'If you believe that, you\u2019ll not only be someone who <span class="wavy-word" data-tooltip="You will become more and more superficial in increasingly powerful LLMs, until you know nothing at all and can only pay to chat with the strongest model to comfort yourself that you still know how to use AI">falls behind</span> in the AI era, but also a little fool~',
      'philosophy.core1': 'Who you are',
      'philosophy.core2': 'determines how you do things',
      'philosophy.closing': 'If you want to become senior, get in the game, stay grounded \u2014 everything works this way.',

      'vuln.title': 'Vulnerability Landscape',
      'vuln.subtitle': 'Covering OWASP Top 10 and beyond, 13 categories of comprehensive coverage',

      'vuln.1.name': 'Authentication & Session',
      'vuln.1.alt': '认证与会话安全',
      'vuln.1.badge': '8 Challenges',
      'vuln.1.desc': 'Brute force attacks, authentication bypass, and session management flaws',
      'vuln.1.t1': 'Brute Force', 'vuln.1.t2': 'JWT Security', 'vuln.1.t3': 'Password Reset',

      'vuln.2.name': 'Cross-Site Scripting',
      'vuln.2.alt': '跨站脚本 XSS',
      'vuln.2.badge': '6 Challenges',
      'vuln.2.desc': 'Exploiting insufficient input filtering on websites',
      'vuln.2.t1': 'DOM XSS', 'vuln.2.t2': 'Reflected XSS', 'vuln.2.t3': 'Stored XSS',

      'vuln.3.name': 'SQL Injection',
      'vuln.3.alt': 'SQL注入',
      'vuln.3.badge': '10 Challenges',
      'vuln.3.desc': 'Injecting malicious SQL code into query statements',
      'vuln.3.t1': 'Login Bypass', 'vuln.3.t2': 'Data Extraction', 'vuln.3.t3': 'MyBatis Injection',

      'vuln.4.name': 'XML External Entity',
      'vuln.4.alt': 'XXE注入',
      'vuln.4.badge': '4 Challenges',
      'vuln.4.desc': 'XML External Entity injection to read server files',
      'vuln.4.t1': 'Basic XXE', 'vuln.4.t2': 'File Read', 'vuln.4.t3': 'OOB', 'vuln.4.t4': 'Content-Type Bypass',

      'vuln.5.name': 'CSRF',
      'vuln.5.alt': '跨站请求伪造',
      'vuln.5.badge': '5 Challenges',
      'vuln.5.desc': 'Tricking users into performing unintended actions on authenticated sites',
      'vuln.5.t1': 'GET Request', 'vuln.5.t2': 'POST Request', 'vuln.5.t3': 'Token Bypass',

      'vuln.6.name': 'SSRF',
      'vuln.6.alt': '服务器端请求伪造',
      'vuln.6.badge': '7 Challenges',
      'vuln.6.desc': 'Inducing servers to make unintended HTTP requests',
      'vuln.6.t1': 'Basic SSRF', 'vuln.6.t2': 'Protocol Abuse', 'vuln.6.t3': 'Bypass', 'vuln.6.t4': 'Redirect',

      'vuln.7.name': 'Remote Code Execution',
      'vuln.7.alt': '远程命令执行',
      'vuln.7.badge': '9 Challenges',
      'vuln.7.desc': 'Executing arbitrary commands on target systems',
      'vuln.7.t1': 'Basic RCE', 'vuln.7.t2': 'Bypass', 'vuln.7.t3': 'Eval Injection',

      'vuln.8.name': 'Access Control',
      'vuln.8.alt': '失效的访问控制',
      'vuln.8.badge': '8 Challenges',
      'vuln.8.desc': 'Failure to properly restrict user access to resources',
      'vuln.8.t1': 'IDOR', 'vuln.8.t2': 'Horizontal Escalation', 'vuln.8.t3': 'Vertical Escalation',

      'vuln.9.name': 'File Operation',
      'vuln.9.alt': '文件操作',
      'vuln.9.badge': '6 Challenges',
      'vuln.9.desc': 'Security vulnerabilities in file upload, download, and inclusion operations',
      'vuln.9.t1': 'File Upload', 'vuln.9.t2': 'Path Traversal', 'vuln.9.t3': 'File Inclusion',

      'vuln.10.name': 'Security Misconfiguration',
      'vuln.10.alt': '安全配置',
      'vuln.10.badge': '5 Challenges',
      'vuln.10.desc': 'Improper security configuration of systems, frameworks, or components',
      'vuln.10.t1': 'Actuator Leak', 'vuln.10.t2': 'Swagger Leak',

      'vuln.11.name': 'Information Disclosure',
      'vuln.11.alt': '敏感信息泄露',
      'vuln.11.badge': '7 Challenges',
      'vuln.11.desc': 'Failure to properly protect sensitive data leading to information exposure',
      'vuln.11.t1': 'Error Leak', 'vuln.11.t2': 'Git Source Leak', 'vuln.11.t3': 'Hardcoded Secret',

      'vuln.12.name': 'Business Logic Flaws',
      'vuln.12.alt': '业务逻辑错误',
      'vuln.12.badge': '8 Challenges',
      'vuln.12.desc': 'Flaws in application business process design or implementation',
      'vuln.12.t1': 'Coupon Abuse', 'vuln.12.t2': 'Price Tamper', 'vuln.12.t3': 'Process Skip',

      'vuln.13.name': 'Insecure Deserialization',
      'vuln.13.alt': '不安全的反序列化',
      'vuln.13.badge': '6 Challenges',
      'vuln.13.desc': 'Lack of sufficient validation during deserialization processes',
      'vuln.13.t1': 'FastJSON RCE', 'vuln.13.t2': 'Log4Shell', 'vuln.13.t3': 'Native Deserialization',

      'footer.contact.label': 'Contact us'
    },

    zh: {
      'hero.subtitle': '在模拟的真实业务场景中，从源代码层完整理解每一个安全漏洞',
      'stat.categories': '漏洞大类',
      'stat.challenges': '实战关卡',
      'stat.opensource': '开源项目',
      'btn.github': 'GitHub',
      'btn.wiki': 'Wiki',
            
      'philosophy.intro': '\u5728 Anthropic \u7684 Mythos \u4e00\u4e2a\u6708\u5b8c\u6210 1\u4e07+ \u6f0f\u6d1e\u53d1\u73b0\u7684\u65f6\u4ee3',
      'philosophy.question': '\u5b66\u4e60\u6f0f\u6d1e\u5e95\u5c42\u7684\u539f\u7406\u8fd8\u6709\u7528\u5417\uff1f',
      'philosophy.answer': '\u7b54\u6848\u5f88\u7b80\u5355',
      'philosophy.quote': '\u201c\u5f53\u4f60\u9762\u8bd5\u4e00\u4e2a\u5b89\u5168\u5de5\u7a0b\u5e08\u5c97\u4f4d\u7684\u65f6\u5019\uff0c\u80fd\u591f\u6df1\u5c42\u6b21\u7406\u89e3\u5b89\u5168\u6f0f\u6d1e\u539f\u7406\u7684\u4eba\u4f1a\u88ab\u9009\u62e9\uff0c\u800c\u53ea\u4f1a\u7528\u5de5\u5177\u7684\u4eba\u4e0d\u4f1a\u201d',
      'philosophy.narrative': '\u4e92\u8054\u7f51\u4e0a\u6709\u4e00\u79cd\u8bba\u8c03\uff1a',
      'philosophy.narrative.quote': '\u201cAI\u592a\u5f3a\u5927\u4e86\uff0c\u4e0d\u7528\u5b66\u5916\u8bed\u4e86\u3001\u4e0d\u7528\u5b66\u7f16\u7a0b\u4e86\u3001\u4e0d\u7528\u5b66\u5199\u4f5c\u4e86\u2026\u201d',
      'philosophy.narrative.response': '如果你相信，那你不仅会是一个在AI时代被<span class="wavy-word" data-tooltip="你会在一代比一代强大的大模型里面变的越来越浮于表面，最后你什么都不会，只能花钱跟最强的模型聊天来安慰自己还会用AI">沦陷</span>的人，而且还是一个小沙雕~',
      'philosophy.core1': '\u4f60\u662f\u8c01',
      'philosophy.core2': '\u51b3\u5b9a\u4e86\u4f60\u600e\u4e48\u505a\u4e8b',
      'philosophy.closing': '如果你想变资深，躬身入局，脚踏实地，所有的事情都是这样。',

      'vuln.title': '漏洞体系全景',
      'vuln.subtitle': '覆盖 OWASP Top 10 及更多，13 大类漏洞全面覆盖',

      'vuln.1.name': '认证与会话安全',
      'vuln.1.alt': 'Authentication & Session',
      'vuln.1.badge': '8 关卡',
      'vuln.1.desc': '暴力破解、认证绕过、会话管理缺陷',
      'vuln.1.t1': '暴力破解', 'vuln.1.t2': 'JWT安全', 'vuln.1.t3': '密码重置',

      'vuln.2.name': '跨站脚本 XSS',
      'vuln.2.alt': 'Cross-Site Scripting',
      'vuln.2.badge': '6 关卡',
      'vuln.2.desc': '利用网站对用户输入过滤不足进行攻击',
      'vuln.2.t1': 'DOM型XSS', 'vuln.2.t2': '反射型XSS', 'vuln.2.t3': '存储型XSS',

      'vuln.3.name': 'SQL注入',
      'vuln.3.alt': 'SQL Injection',
      'vuln.3.badge': '10 关卡',
      'vuln.3.desc': '在查询语句中插入恶意 SQL 代码',
      'vuln.3.t1': '登录绕过', 'vuln.3.t2': '数据提取', 'vuln.3.t3': 'MyBatis注入',

      'vuln.4.name': 'XXE注入',
      'vuln.4.alt': 'XML External Entity',
      'vuln.4.badge': '4 关卡',
      'vuln.4.desc': 'XML 外部实体注入，读取服务器文件',
      'vuln.4.t1': '基础XXE', 'vuln.4.t2': '文件读取', 'vuln.4.t3': '带外通信', 'vuln.4.t4': '内容类型绕过',

      'vuln.5.name': '跨站请求伪造',
      'vuln.5.alt': 'CSRF',
      'vuln.5.badge': '5 关卡',
      'vuln.5.desc': '诱骗用户在认证网站执行非预期操作',
      'vuln.5.t1': 'GET请求', 'vuln.5.t2': 'POST请求', 'vuln.5.t3': 'Token绕过',

      'vuln.6.name': '服务器端请求伪造',
      'vuln.6.alt': 'SSRF',
      'vuln.6.badge': '7 关卡',
      'vuln.6.desc': '诱导服务器发起非预期的 HTTP 请求',
      'vuln.6.t1': '基础SSRF', 'vuln.6.t2': '协议滥用', 'vuln.6.t3': '绕过防护', 'vuln.6.t4': '重定向利用',

      'vuln.7.name': '远程命令执行',
      'vuln.7.alt': 'Remote Code Execution',
      'vuln.7.badge': '9 关卡',
      'vuln.7.desc': '攻击者在目标系统执行任意命令',
      'vuln.7.t1': '基础RCE', 'vuln.7.t2': '绕过防护', 'vuln.7.t3': 'Eval注入',

      'vuln.8.name': '失效的访问控制',
      'vuln.8.alt': 'Access Control',
      'vuln.8.badge': '8 关卡',
      'vuln.8.desc': '未能正确限制用户对资源的访问权限',
      'vuln.8.t1': 'IDOR越权', 'vuln.8.t2': '水平提权', 'vuln.8.t3': '垂直提权',

      'vuln.9.name': '文件操作',
      'vuln.9.alt': 'File Operation',
      'vuln.9.badge': '6 关卡',
      'vuln.9.desc': '文件上传、下载、包含等操作中的安全漏洞',
      'vuln.9.t1': '文件上传', 'vuln.9.t2': '路径穿越', 'vuln.9.t3': '文件包含',

      'vuln.10.name': '安全配置',
      'vuln.10.alt': 'Security Misconfiguration',
      'vuln.10.badge': '5 关卡',
      'vuln.10.desc': '系统、框架或组件的安全配置不当',
      'vuln.10.t1': 'Actuator泄露', 'vuln.10.t2': 'Swagger泄露',

      'vuln.11.name': '敏感信息泄露',
      'vuln.11.alt': 'Information Disclosure',
      'vuln.11.badge': '7 关卡',
      'vuln.11.desc': '未妥善保护敏感数据导致信息泄露',
      'vuln.11.t1': '错误信息泄露', 'vuln.11.t2': 'Git源码泄露', 'vuln.11.t3': '硬编码密钥',

      'vuln.12.name': '业务逻辑错误',
      'vuln.12.alt': 'Business Logic Flaws',
      'vuln.12.badge': '8 关卡',
      'vuln.12.desc': '应用程序业务流程设计或实现中的缺陷',
      'vuln.12.t1': '优惠券滥用', 'vuln.12.t2': '价格篡改', 'vuln.12.t3': '流程跳过',

      'vuln.13.name': '不安全的反序列化',
      'vuln.13.alt': 'Insecure Deserialization',
      'vuln.13.badge': '6 关卡',
      'vuln.13.desc': '反序列化过程中缺乏充分验证',
      'vuln.13.t1': 'FastJSON RCE', 'vuln.13.t2': 'Log4Shell', 'vuln.13.t3': '原生反序列化',

      'footer.contact.label': '联系我们'
    }
  };

  var STORAGE_KEY = 'mr_lang';
  var DEFAULT_LANG = 'en';

  /**
   * 应用语言到所有带 data-i18n 的元素
   */
  function applyLanguage(lang) {
    if (!I18N[lang]) lang = DEFAULT_LANG;
    var dict = I18N[lang];

    // <html lang="..."> for typography hooks & a11y
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = dict[key];
      if (typeof val !== 'string') return;
    
      // 带箭头按钮: 保留尾部箭头
      if (el.hasAttribute('data-i18n-arrow')) {
        el.textContent = val + ' \u2192';
      } else if (val.indexOf('<') !== -1) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    // 更新切换按钮高亮
    var btns = document.querySelectorAll('.lang-btn');
    btns.forEach(function (btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * 初始化语言切换
   */
  function initLangSwitch() {
    // 读取偏好；首次访问默认英文
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    var initial = (stored === 'zh' || stored === 'en') ? stored : DEFAULT_LANG;

    applyLanguage(initial);

    var btns = document.querySelectorAll('.lang-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-lang');
        if (!target || !I18N[target]) return;
        applyLanguage(target);
        try { localStorage.setItem(STORAGE_KEY, target); } catch (e) { /* ignore */ }
      });
    });
  }

  /**
   * Intersection Observer - 滚动淡入
   */
  function initScrollAnimations() {
    var fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * 卡片交错动画延迟
   */
  function initStaggeredAnimations() {
    var vulnCards = document.querySelectorAll('.vuln-card.fade-in');
    vulnCards.forEach(function (card, index) {
      card.style.transitionDelay = (index * 0.05) + 's';
    });
  }

  function init() {
    initLangSwitch();
    initStaggeredAnimations();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
