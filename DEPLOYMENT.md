# 部署指南

本文档说明 PinableAgents 官网（pinable.cc）的部署流程。

## 部署方式

官网为纯静态站，通过 GitHub Pages 部署，推送 `main` 分支即自动发布。

## 部署前检查

- [ ] `index.html` 及各页面内容已更新
- [ ] `sitemap.xml` 包含所有页面
- [ ] `CNAME` 文件内容为 `pinable.cc`
- [ ] 桌面端安装包已放入 `assets/downloads/`
- [ ] Wiki 文档与功能保持一致

## GitHub Pages 配置

### 仓库设置

1. Settings → Pages
2. Source：`main` 分支，根目录 `/`
3. 勾选 Enforce HTTPS

### 自定义域名 DNS

**A 记录（根域名）：**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME 记录（www）：**

```
www → <username>.github.io
```

## 推送部署

```bash
git add .
git commit -m "update: 描述本次变更"
git push origin main
```

推送后 GitHub Pages 自动构建，通常 1-2 分钟生效。

## 桌面端打包

```bash
# macOS / Windows 打包脚本
bash scripts/package-pinable-desktop.sh
```

打包产物放入 `assets/downloads/`，然后推送。

## 文件结构要点

```
pinable.cc/
├── index.html          # 主页
├── about.html          # 关于
├── contact.html        # 联系
├── privacy.html        # 隐私政策
├── wiki.html           # Wiki 入口
├── wiki/               # Wiki 文档（HTML）
├── assets/
│   ├── css/            # 样式
│   ├── images/         # 图片
│   └── downloads/      # 桌面端安装包
├── CNAME
├── robots.txt
└── sitemap.xml
```

## SEO 配置

- `robots.txt` — 已配置，允许全站抓取
- `sitemap.xml` — 列出所有页面，新增页面时需同步更新
- Open Graph / Twitter Card — 在各页面 `<head>` 中已配置
- JSON-LD 结构化数据 — `index.html` 中已包含

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| 域名 404 | 检查 CNAME 文件和 DNS 记录 |
| HTTPS 不生效 | 在 Pages 设置中勾选 Enforce HTTPS |
| 样式未更新 | 清除浏览器缓存或硬刷新 |
| 部署延迟 | GitHub Pages 通常 1-2 分钟，偶尔最多 10 分钟 |

## 联系

部署问题可联系：wowniuwowniu@gmail.com

---

最后更新：2026-02-25
