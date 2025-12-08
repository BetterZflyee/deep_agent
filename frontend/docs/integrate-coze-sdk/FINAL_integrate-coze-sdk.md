# 项目总结：集成 Coze SDK

## 完成的工作
1.  **架构调整**: 引入 `CozeChat` 组件作为专门的第三方 SDK 容器。
2.  **功能实现**:
    - 在 `src/components/agents/CozeChat.tsx` 中封装了 Coze Web Chat SDK 的加载与初始化。
    - 修改 `src/pages/agents/index.tsx`，实现了针对 `mode=market` 的条件渲染。
3.  **配置**: 在 `.env.local` 中添加了 Bot ID 和 PAT 的配置项。

## 待办事项 (User Action Required)
1.  **替换 Token**: 请在 `.env.local` 文件中，将 `NEXT_PUBLIC_COZE_PAT` 的值替换为您真实的 Personal Access Token。
2.  **验证**: 访问 `http://localhost:3000/agents?mode=market` 查看效果。
