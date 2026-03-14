# ListenHub 风格视觉规范

本规范定义了如何将现代 AI 极简主义风格应用于网页和应用界面。

## 1. 色彩与材质 (Color & Material)
*   **主背景:** `#FFFFFF` (极简、专业)
*   **次要背景:** `#F9FAFB` (浅灰，用于区块区分)
*   **标题文字:** `#111827` (深灰黑，非纯黑以提升质感)
*   **正文文字:** `#4B5563` (灰，降低阅读疲劳)
*   **强调色:** `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)` (蓝紫渐变，体现 AI 流动感)
*   **毛玻璃效果:** `backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.8);` (用于 Header)

## 2. 排版 (Typography)
*   **字体栈:** `Inter, -apple-system, system-ui, "PingFang SC", sans-serif`
*   **层级:**
    *   **Hero Title:** 64px, ExtraBold, Tracking -0.02em
    *   **Section Title:** 36px, Bold
    *   **Body:** 18px, Regular, Line-height 1.6

## 3. 组件风格 (UI Components)
*   **按钮:** 圆角 12px, 渐变背景, 柔和外发光阴影。
*   **卡片:** 圆角 20px, 1px #E5E7EB 描边, 极细阴影 `0 4px 6px -1px rgba(0, 0, 0, 0.05)`。
*   **容器:** 大留白 (Desktop: 80px-120px padding)。

## 4. 交互 (Interaction)
*   **悬停:** `translateY(-4px)`, `box-shadow` 加深。
*   **进入动画:** 元素随滚动淡入并上移。
