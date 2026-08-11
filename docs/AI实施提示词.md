# AI 实施提示词（Codex + DeepSeek V4 Flash）

> 使用方式：把下方代码块中的内容完整复制给 Codex。
> 运行环境：Codex agent harness，模型 DeepSeek V4 Flash。
> 项目路径：`D:\Projects\memory-site`。

```markdown
# 任务：按需求文档完成 memory-site UI 视觉升级

你是资深前端视觉工程师。项目是纯静态网站，位于 D:\Projects\memory-site。
你的唯一任务：严格按 docs/UI视觉升级需求文档.md 实现 UI 升级，不自行扩大范围。

## 必须步骤

1. 读取 docs/UI视觉升级需求文档.md 和 AGENTS.md。
2. 读取 css/style.css、index.html、about.html、projects.html、diary.html、blog.html、js/main.js。
3. 按需求文档实施：
   - 设计令牌与 60-30-10 配色。
   - 三级玻璃材质 glass-sm / glass-md / glass-lg。
   - .zone 与 .zone-inner 区块结构。
   - 背景精简与 HUD 标签。
   - 纯 CSS 动态故障色。
   - 卡片高光跟随鼠标。
4. 本地运行 python -m http.server 8000，用桌面宽度 1200px 和 1440px 验证 5 个页面。
5. 更新 AGENTS.md 和 docs/变更记录.md，操作手册补一句玻璃分级说明。

## 硬性约束

- 所有新增文案、注释、回复使用中文。
- 不做移动端适配，保留 min-width: 1200px。
- 不改变网站功能、文案、链接、学习日记数据。
- 不引入框架、构建工具、CDN、新图片、新字体。
- 不删除或覆盖用户未提交的改动；如果冲突，先询问用户。
- 沿用现有代码风格：原生 JavaScript、var、无构建。
- 不实现真实折射，玻璃质感使用 CSS 组合实现。

## 完成标准

- 每页最多 2 个强调色。
- 区块色带 12%-18%，顶部光弧和 SYS HUD 标签可见。
- 卡片有清透玻璃质感：blur + tint + 细边框 + 顶部高光 + sheen。
- 故障色只出现在关键标题和卡片悬停。
- 浏览器控制台无报错，CSS、JS、图片、字体请求全部 200。
- prefers-reduced-motion 和 prefers-reduced-transparency 下正常降级。

## 输出格式

完成时输出：

- 修改文件清单。
- 每个页面的验证结果。
- 截图或截图保存路径。
- 未完成项和风险说明。
```
