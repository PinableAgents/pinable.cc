# PinableAgents

> 多智能体开发工作流系统 — 统一编排、多后端执行、可复用流程

[![Website](https://img.shields.io/badge/Website-pinable.cc-teal)](https://pinable.cc)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 简介

PinableAgents 面向研发团队，将复杂开发任务拆解为可验证的阶段，通过标准化工作流 + 多后端 AI 执行，降低跨角色协作成本。

**在线文档：** [https://pinable.cc](https://pinable.cc) · [Wiki](https://pinable.cc/wiki.html)

## 核心架构

```
┌─────────────────────────────┐
│   编排层：Claude Code        │  规划、上下文收集、验证
├─────────────────────────────┤
│   执行层：pinable  │  统一 CLI → Codex / Claude / Gemini
├─────────────────────────────┤
│   桌面端：pinable-desktop    │  模块安装、配置编辑、执行监控
└─────────────────────────────┘
```

## 工作流

| 工作流 | 定位 | 适用场景 |
|--------|------|----------|
| **do**（推荐） | 7 阶段功能交付 | 常规需求开发，强制澄清 + 评审闭环 |
| **omo** | 风险信号驱动路由 | 未知 bug 定位、跨模块重构 |
| **bmad** | 企业级敏捷协作 | 多角色（产品/架构/开发/测试）协作 |
| **sparv** | 轻量 Specify→Plan→Act→Review→Vault | 快速原型与小型任务 |
| **requirements** | 需求到代码闭环 | 需求驱动的快速实现 |

## 模块与场景

- **功能交付** — do + essentials
- **Bug 修复** — omo + develop
- **企业协作** — bmad + sparv
- **内容生产** — webchat + memorys

## 快速开始

1. 下载 [pinable-desktop](https://pinable.cc/#download)（macOS / Windows）
2. 安装所需模块
3. 配置 AI 后端（Codex / Claude / Gemini）
4. 执行第一个 `do` 工作流

详细步骤见 [Wiki - 快速开始](https://pinable.cc/wiki/getting-started.html)。

## 项目结构

```
pinable.cc/
├── index.html                # 主页
├── about.html                # 关于
├── contact.html              # 联系
├── privacy.html              # 隐私政策
├── wiki.html                 # Wiki 入口
├── wiki/                     # Wiki 文档
│   ├── getting-started.html
│   ├── workflow-do.html
│   ├── workflow-omo.html
│   ├── workflow-bmad.html
│   ├── workflow-sparv.html
│   ├── multi-backend.html
│   ├── skill-system.html
│   ├── desktop-overview.html
│   ├── troubleshooting.html
│   └── ...
├── assets/
│   ├── css/                  # 样式
│   └── images/               # 图片资源
├── scripts/
│   └── package-pinable-desktop.sh
├── CNAME                     # 域名配置
├── robots.txt
├── sitemap.xml
├── USAGE.md                  # 使用说明
├── TESTING.md                # 测试指南
└── DEPLOYMENT.md             # 部署指南
```

## 技术栈

- **前端：** HTML5 + CSS3（静态站，无框架）
- **字体：** Noto Sans SC / ZCOOL XiaoWei / JetBrains Mono
- **部署：** GitHub Pages
- **域名：** pinable.cc

## 联系

- **邮箱：** wowniuwowniu@gmail.com
- **Twitter：** [@PinableLab](https://twitter.com/PinableLab)
- **YouTube：** [@PinableLab](https://youtube.com/@PinableLab)
- **Instagram：** [@pinablelab](https://instagram.com/pinablelab)

## 相关文档

- [使用说明](USAGE.md)
- [部署指南](DEPLOYMENT.md)
- [测试指南](TESTING.md)
- [Wiki 文档](https://pinable.cc/wiki.html)

## 许可证

MIT License

---

PinableLab · Workflows / Orchestration / Execution
