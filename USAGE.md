# 使用说明

## 安装桌面端

1. 从 [pinable.cc/#download](https://pinable.cc/#download) 下载 pinable-desktop
   - macOS：`PinableAgents-mac.dmg`
   - Windows：`PinableAgents-win.exe`
2. 安装并启动应用
3. 在模块管理界面选择需要的工作流模块

## 配置 AI 后端

PinableAgents 通过 codeagent-wrapper 统一调用多种 AI 后端，需至少配置一个：

| 后端 | 说明 |
|------|------|
| Codex | OpenAI Codex CLI |
| Claude | Anthropic Claude Code |
| Gemini | Google Gemini CLI |

在桌面端「设置 → 后端配置」中填入对应的 API Key 或 CLI 路径。

详细参数说明见 [Wiki - 多后端执行](https://pinable.cc/wiki/multi-backend.html)。

## 工作流使用

### do 工作流（推荐）

7 阶段功能交付流程：Discovery → Exploration → Clarification → Architecture → Implementation → Review → Summary。

```bash
# 在 Claude Code 中启动
/do 添加用户认证功能
```

适合常规功能开发，强制澄清需求后再进入实现。

### omo 工作流

风险信号驱动，自动选择最小代理集合。适合 bug 定位与跨模块重构。

```bash
/omo 排查登录超时问题
```

### bmad 工作流

企业级敏捷协作，包含产品经理、架构师、开发、QA、Scrum Master 多角色。

### sparv 工作流

轻量化 Specify → Plan → Act → Review → Vault，适合快速原型。

### requirements 工作流

需求驱动的快速闭环：需求分析 → 技术规格 → 代码实现 → 测试验证。

## 模块管理

在桌面端「模块」页面可安装/卸载模块：

| 场景 | 推荐模块组合 |
|------|-------------|
| 功能交付 | do + essentials |
| Bug 修复 | omo + develop |
| 企业协作 | bmad + sparv |
| 内容生产 | webchat + memorys |

模块配置详情见 [Wiki - 模块与配置](https://pinable.cc/wiki/desktop-modules.html)。

## 本地开发（网站）

如需本地运行官网：

```bash
git clone <repo-url>
cd pinable.cc

# 启动本地服务器
python -m http.server 8000
# 或
npx http-server

# 访问 http://localhost:8000
```

## 故障排除

| 问题 | 排查方向 |
|------|----------|
| 后端 CLI 未找到 | 确认 CLI 已安装并在 PATH 中 |
| 模块安装失败 | 检查网络连接，重试一次 |
| 会话恢复失败 | 检查 codeagent-wrapper 版本是否最新 |
| 桌面端无法启动 | macOS 需在「系统设置 → 安全性」中允许运行 |

更多问题见 [Wiki - 常见问题](https://pinable.cc/wiki/troubleshooting.html)。

## 相关文档

- [README.md](README.md) — 项目总览
- [DEPLOYMENT.md](DEPLOYMENT.md) — 部署指南
- [TESTING.md](TESTING.md) — 测试指南
- [Wiki](https://pinable.cc/wiki.html) — 完整文档
