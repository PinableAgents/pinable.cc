---
name: ui-ux-modernizer
description: 为网站和应用提供基于 ListenHub.ai 风格的现代 AI 极简主义设计重构。适用于 UI 审查、CSS 重写、HTML 结构优化以及设计方案输出。
---

# UI/UX Modernizer (ListenHub Style)

本 Skill 旨在将现有的网页或应用界面重构为极简、专业且具科技感的 ListenHub 风格。

## 核心工作流

### 1. 视觉分析与重构 (Review & Redesign)
当用户要求“重构我的界面”或“改版网站”时，请执行以下步骤：
1.  **分析现有结构:** 识别 Header, Hero, Features, Footer 等核心组件。
2.  **应用设计系统:** 参考 [listenhub_style.md](references/listenhub_style.md) 中的配色、排版和组件规范。
3.  **制定方案:** 输出包含视觉原则、核心组件重构方案的文档。

### 2. CSS 实现 (Styling)
*   **全局样式:** 设置 CSS 变量 (`--primary`, `--accent`, `--font-main` 等)。
*   **组件重塑:** 
    *   为容器添加大 Padding。
    *   为卡片添加 1px 描边、20px 圆角和微阴影。
    *   为按钮添加渐变背景和 Hover 动效。
*   **响应式:** 确保在移动端自动切换为单列布局，并保持适当的点击区域。

### 3. HTML 结构优化 (Structure)
*   **语义化:** 使用 `<header>`, `<main>`, `<section>`, `<footer>`。
*   **简洁化:** 移除冗余的嵌套，保持 HTML 结构清晰。
*   **交互点:** 为需要动效的元素添加 `fade-in-up` 等辅助类名。

## 使用提示
*   **极简原则:** 如果一个元素不提供价值，建议移除它。
*   **留白优先:** 当界面拥挤时，首选增加间距而非缩小字体。
*   **对比度:** 确保文字与背景之间有足够的对比度，同时避免使用纯黑色。
