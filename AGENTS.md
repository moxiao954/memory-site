# AGENTS.md

> 本文件是项目根目录的 AI 项目提示词。每次修改网站前，先读本文件和 `docs/` 下的相关文档。

## 项目定位

- 个人 AI 学习分享静态网站，全中文，桌面优先。
- 技术栈：HTML + CSS + 原生 JavaScript。无框架、无构建工具、无后端、无外部 CDN 依赖。
- 线上主站：Netlify `https://memory-site-903.netlify.app/`
- 代码仓库：GitHub `https://github.com/moxiao954/memory-site`
- GitHub Pages 备用地址：`https://moxiao954.github.io/memory-site/`

## 目录结构

```text
memory-site/
├── AGENTS.md                      # 本文件，AI 项目提示词
├── README.md                      # 对外说明
├── index.html                     # 首页
├── about.html                     # 关于我
├── projects.html                  # 项目作品集
├── diary.html                     # 学习日记
├── css/style.css                  # 全站样式
├── js/main.js                     # 学习日记数据 + 全局动效
├── images/                        # 图片资源
├── fonts/                         # 本地字体
└── docs/
    ├── 更新操作手册.md
    ├── 变更记录.md
    ├── UI视觉升级需求文档.md
    └── AI实施提示词.md
```

## 维护规则

### 语言与内容

- 所有面向用户的回复、页面文案、文档均使用中文。
- 技术名词首次出现时保留英文原文，例如：静态网站 static website。
- 内容必须真实、客观，不编造学习记录、项目、文章或数据。

### 技术约束

- 不引入框架、构建工具、后端或外部 CDN，除非用户明确要求。
- 全站样式集中在 `css/style.css`，颜色、圆角、阴影等设计令牌集中在 `:root`。
- 学习日记数据只放在 `js/main.js` 的 `timelineData` 数组中，按时间升序排列。
- 4 个页面共享同一套导航、页脚、背景层和脚本引用；改动一个页面时，保持其余页面一致。

### 文档现状

- 当前有效文档为 `docs/更新操作手册.md`、`docs/变更记录.md`、`docs/UI视觉升级需求文档.md` 与 `docs/AI实施提示词.md`。
- 已执行的需求文档 v2.0、UI 设计说明，以及未采用的 EdgeOne 方案，已于 2026-08-11 清理删除。
- 如文档与代码冲突，以实际代码为准，并在 `docs/变更记录.md` 中记录差异。

### UI 视觉升级

- 实现 UI 视觉升级前，先读 `docs/UI视觉升级需求文档.md`。
- 需要可复制的执行提示词时，使用 `docs/AI实施提示词.md`。
- 全站玻璃分三级：`glass-sm`（角标、筛选按钮）、`glass-md`（卡片、时间线卡片）、`glass-lg`（导航、CTA、放大弹层）。
- 全站统一使用深色底 + 暖金单高光（`#E3B36D` / `#F2D394`），不再按页面切换青紫霓虹强调色。
- 本地得意黑 `fonts/SmileySans-Oblique.ttf.woff2` 仅用于关键标题（`.hero-title`、`.page-title`、`.section-title`、`.cta-section h2`、`.tl-title`），正文保持 Inter 与微软雅黑。
- 分区使用纵向骨架线 + 留白，不新增横向光弧或扫光；不引入 `.glitch-title` 故障效果与随机刷字。
- 学习日记数据项不包含 `link` 字段，点击卡片在站内放大查看。

### 改动纪律

- 不要删除或覆盖用户未提交的改动；如果冲突，先向用户确认。
- 不修改 `.netlify/`、`.claude/`、`.git/` 等本地或版本目录。
- 敏感信息（token、密码、授权凭据）不得写入文档或代码。
- 改完必须本地验证：打开页面、检查控制台、确认图片与字体正常，再声称完成。

### 部署

- Netlify 是当前线上托管，GitHub 是代码仓库。
- 当前 Netlify 部署为手动上传，未发现关联 GitHub 自动部署。
- 接入自动部署的方法见 `docs/更新操作手册.md`。
