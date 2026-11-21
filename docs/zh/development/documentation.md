# 文档维护

公开配置、类型、默认值、事件、插槽、可观察行为和示例路由改变时，在同一次变更更新对应的中文文档、API 与可运行示例。删除或重命名 API 时，搜索旧名称以排查残留用法。纯内部调整在交付说明中记录文档影响判断。

1. 用 `pnpm docs:check` 查看相对链接检查和本地差异对应的章节；检查分支或 PR 时用 `pnpm docs:check --base <git-ref>` 与共同祖先比较。
2. 从[Agent 索引](../agent-index.md)找对应 API 和用法，核对公开入口、实现、测试与 Admin 实际调用。
3. API 页写清类型、默认值、回调时机和插槽上下文。用法页给出前置条件、最小示例、预期结果和运行路由。
4. 新增、移动页面时，检查首页入口、VitePress 侧栏、Agent 索引和 `docs/doc-impact.json`。
5. 运行 `pnpm docs:check`、`pnpm docs:build` 和受影响的类型检查或聚焦测试。PR 写明更新的文档或无需更新的依据。

源码路径映射用于提示可能受影响的页面。AI 负责结合改动判断语义并更新文档，CI 校验结构与站点构建。

## 打包到 Skill

后续打包 `fn-crud-dev` 时，将 `docs/zh` 按原目录复制到 `references/docs/zh`，记录所用源码 commit。让 `SKILL.md` 先引导到 `references/docs/zh/agent-index.md`，再按任务打开 API 与示例。Markdown 相对链接应在复制后继续可用。
