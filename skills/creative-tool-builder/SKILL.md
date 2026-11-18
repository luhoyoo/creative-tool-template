---
name: creative-tool-builder
description: Build or adapt small creative production tools with editable fields, design-based previews, image upload, localization, and PNG or ZIP export. Use when creating a reusable poster, banner, popup, or similar marketing asset generator from a description or Figma design. Do not use for one-off static artwork or unrelated websites.
---

# 创意工具制作

把设计稿和运营需求实现为可运行、可验收的小工具。用户指定的技术栈、现有项目、品牌规范、数据规则和发布范围优先；不要把示例中的股票海报、MEXC 品牌、19 种语言或固定尺寸当成新工具的需求。

## 工作流程

1. **明确范围并检查现状。** 识别工具的使用人、输入字段、实时预览、目标画板、尺寸、语言、导出格式和命名；先读取已有项目和约定。缺失细节能合理推断时先继续，影响最终结果的关键缺口及时询问。需要需求清单时读取 [references/brief.md](references/brief.md)。
2. **确定起点。** 已有项目优先沿用其技术栈、组件和样式，不要覆盖文件。空目录或用户明确要求新建 React 工具时，可把 `assets/starter/` 复制到用户指定的空目录作为起点；这是可运行的股票海报示例，不是通用成品。无论是否使用示例，都要根据需求实现，而非只替换标题。
3. **读取设计并实现。** 提供 Figma 节点时，使用可用的 Figma 设计转代码工作流；核对尺寸、图层、素材、文本、语言及 RTL。使用独立的可编辑元素和本地可用素材，不把整张设计截图用作输出。用户有既定设计时以其为准；没有时做清晰、简洁的工具界面。
4. **打通完整功能。** 设置、预览和导出使用同一份状态；按需求实现表单校验、图片上传裁切、单张或批量导出、多语言、长文本与错误反馈。涉及海报和图片导出时读取 [references/asset-generators.md](references/asset-generators.md)。
5. **验证交付。** 运行项目要求的构建与检查，实际操作相关功能并检查下载文件，不只确认页面能打开；验收范围参考 [references/acceptance.md](references/acceptance.md)。告知本地预览方式、已验证内容、缺失条件和实际限制。

## 起始工程说明

`assets/starter/` 使用 React + Vite、`html-to-image` 和 JSZip，包含深色编辑面板、响应式预览、圆形图标裁切、折叠文案和 1200×1200 PNG/多语言 ZIP 的示例。`src/config/tool.js` 与 `src/config/copy.js` 是示例配置；`src/Stock.jsx`、`src/stock.css` 和 `public/assets/stock/` 包含具体示例画布、交互和素材。新增字段、调整尺寸或替换版式时还需要修改组件与样式。示例素材、文案和品牌使用前须确认适用及授权。

仓库私有不等于部署后网站私有；示例仅在浏览器本地处理数据，不提供登录、数据持久化或访问控制。不要提交密钥或用户上传文件。创建仓库、修改权限、连接外部服务或发布时遵循用户明确的请求和既有授权，不擅自扩大公开范围。
