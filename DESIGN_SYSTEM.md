# Pinable.cc 设计系统 (ListenHub 风格)

本系统参考 [ListenHub.ai](https://listenhub.ai/zh) 的视觉风格，旨在为 PinableAgents 系列产品提供统一、专业、现代的 UI 指引。

## 1. 核心视觉原则
*   **极简主义 (Minimalism):** 移除不必要的装饰，通过留白强调内容。
*   **呼吸感 (Whitespace):** 慷慨的边距和行高，减少认知负担。
*   **智能感 (Intelligence):** 使用细腻的渐变和微动效体现 AI 属性。

## 2. 色彩系统
| 类型 | 颜色值 | 用途 |
| :--- | :--- | :--- |
| **背景 (Primary)** | `#FFFFFF` | 主背景 |
| **背景 (Secondary)** | `#F9FAFB` | 分割区、卡片背景 |
| **文字 (Heading)** | `#111827` | 标题、强调文字 |
| **文字 (Body)** | `#4B5563` | 正文、描述 |
| **强调色 (Accent)** | `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)` | CTA 按钮、图标、关键高亮 |
| **边框 (Border)** | `#E5E7EB` | 分隔线、卡片描边 |

## 3. 排版系统
*   **字体族:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif`
*   **Hero Title:** `font-weight: 800; font-size: 64px; line-height: 1.1; letter-spacing: -0.02em;`
*   **Section Title:** `font-weight: 700; font-size: 36px; line-height: 1.2;`
*   **Body Text:** `font-weight: 400; font-size: 18px; line-height: 1.6; color: #4B5563;`

## 4. UI 组件规范
### 按钮 (Buttons)
*   **主按钮:** 圆角 12px，背景使用 Accent 渐变，文字白色。
*   **次要按钮:** 圆角 12px，背景透明，边框 1px #E5E7EB，悬停时背景淡灰。

### 卡片 (Cards)
*   **样式:** 圆角 20px，背景 #FFFFFF，边框 1px #E5E7EB，柔和阴影。
*   **阴影:** `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);`

## 5. 交互规范
*   **悬停 (Hover):** 所有的卡片和按钮在悬停时应有轻微的 `translateY(-4px)` 位移和阴影加深效果。
*   **过渡 (Transition):** 全局使用 `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`。
