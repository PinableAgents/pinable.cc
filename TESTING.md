# 测试指南

本文档提供 PinableAgents 官网的测试清单。

## 页面功能测试

### 通用检查（所有页面）

- [ ] 页面正常加载，无控制台报错
- [ ] 字体正确渲染（Noto Sans SC / ZCOOL XiaoWei / JetBrains Mono）
- [ ] 导航链接正确跳转
- [ ] Footer 社交链接（Twitter / YouTube / Instagram）可点击
- [ ] HTTPS 正常，无混合内容警告

### 主页（index.html）

- [ ] Hero 区域标题与描述显示正确
- [ ] 功能要点、工作流、模块与场景各区块内容完整
- [ ] Wiki 文档卡片链接正确
- [ ] 核心架构区块显示正确
- [ ] 下载按钮链接有效（macOS / Windows）
- [ ] 锚点导航（#overview, #points, #workflows 等）定位准确

### Wiki（wiki.html + wiki/）

- [ ] Wiki 入口页面正常加载
- [ ] 各子页面链接有效
- [ ] 文档内容与当前功能一致

### 其他页面

- [ ] about.html — 内容展示正常
- [ ] contact.html — 联系方式正确显示
- [ ] privacy.html — 隐私政策内容完整

## 响应式测试

| 尺寸 | 检查项 |
|------|--------|
| 手机（< 640px） | 单列布局，卡片自适应，导航可用 |
| 平板（641-1024px） | 双列布局，元素对齐 |
| 桌面（> 1024px） | 多列布局，hover 效果正常 |

## 浏览器兼容性

- [ ] Chrome（最新）
- [ ] Firefox（最新）
- [ ] Safari（最新）
- [ ] Edge（最新）
- [ ] iOS Safari
- [ ] Chrome Mobile

## 性能指标

目标（Lighthouse）：

| 指标 | 目标值 |
|------|--------|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |

## SEO 检查

- [ ] 各页面 `<title>` 和 `<meta description>` 准确
- [ ] Open Graph / Twitter Card 标签完整
- [ ] `robots.txt` 和 `sitemap.xml` 可访问且内容正确
- [ ] JSON-LD 结构化数据通过 Google 验证

## 无障碍检查

- [ ] 键盘 Tab 导航顺畅
- [ ] 图片有 alt 属性
- [ ] 文字对比度 >= 4.5:1
- [ ] 语义化 HTML 标签使用正确

## 本地测试方法

```bash
# 启动本地服务器
python -m http.server 8000

# Lighthouse 检测
lighthouse http://localhost:8000 --view
```

## 部署前最终检查

- [ ] 所有页面功能正常
- [ ] 响应式各断点无异常
- [ ] 无控制台错误或警告
- [ ] 所有链接有效
- [ ] Lighthouse 各项 > 90
