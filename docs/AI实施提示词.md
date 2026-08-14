# AI 实施提示词（Codex + DeepSeek V4 Flash）

> 使用方式：把下方代码块中的内容完整复制给 Codex。
> 运行环境：Codex agent harness，模型 DeepSeek V4 Flash。
> 项目路径：`D:\Projects\memory-site`。

```markdown
# 任务：按需求文档 v2.0 完成 memory-site UI 视觉升级

你是资深前端视觉工程师。项目是纯静态网站，位于 D:\Projects\memory-site。
你的唯一任务：严格按 docs/UI视觉升级需求文档.md v2.0 实现 UI 升级，不自行扩大范围。

## 必须步骤

1. 读取 docs/UI视觉升级需求文档.md 和 AGENTS.md。
2. 读取 css/style.css、index.html、about.html、projects.html、diary.html、js/main.js。
3. 下载得意黑 `SmileySans-Oblique.ttf.woff2` 到 fonts/，保留 SIL OFL-1.1 许可说明。
4. 按需求文档实施：
   - 深色底 + 暖色单高光设计令牌。
   - 三级玻璃材质 glass-sm / glass-md / glass-lg。
   - 纵向骨架布局，删除横向光弧与扫光。
   - hero 去方框背景，统计区改为连续数据行。
   - 得意黑仅用于关键标题。
   - 卡片悬停改为低透明度暖色光标高光。
   - 学习日记删除“了解更多”和外部链接。
   - 日记滑条增加显眼轨道、滑块、左右箭头和进度同步。
   - 时间线放大改为 FLIP/transform 连贯动画。
   - 删除 `.glitch-title`、`data-text`、故障 keyframes 与相关 HTML/CSS/JS。
5. 本地运行 python -m http.server 8000，用桌面宽度 1200px 和 1440px 验证 4 个页面。
6. 更新 AGENTS.md 和 docs/变更记录.md，操作手册补一句玻璃分级和字体说明。

## 硬性约束

- 所有新增文案、注释、回复使用中文。
- 不做移动端适配，保留 min-width: 1200px。
- 不改变网站功能、文案、学习日记数据。
- 不引入框架、构建工具、CDN、新图片。
- 除本地得意黑外，不新增其他字体文件。
- 不保留“了解更多”、外部链接、动态故障色和随机刷字。
- 不删除或覆盖用户未提交的改动；如果冲突，先询问用户。
- 沿用现有代码风格：原生 JavaScript、var、无构建。
- 不实现真实折射，玻璃质感使用 CSS 组合实现。

## 完成标准

- 全站统一为深色底 + 暖色单高光，不再出现青紫霓虹。
- 页面中不存在 `.tl-link`，不存在 `glitch-title` 相关结构或样式。
- `fonts/SmileySans-Oblique.ttf.woff2` 存在且请求 200，关键标题使用得意黑。
- 区块使用纵向骨架，不再出现横向光弧和横向扫光。
- 日记滑条轨道、滑块、箭头和进度可见可用。
- 时间线点击放大和关闭动画连贯。
- 浏览器控制台无报错，CSS、JS、图片、字体请求全部 200。
- prefers-reduced-motion 和 prefers-reduced-transparency 下正常降级。

## 输出格式

完成时输出：

- 修改文件清单。
- 每个页面的验证结果。
- 截图或截图保存路径。
- 未完成项和风险说明。
```
