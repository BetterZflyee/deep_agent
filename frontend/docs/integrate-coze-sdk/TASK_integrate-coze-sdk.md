# 任务分解：集成 Coze SDK

## 1. 配置环境变量
- **输入**: 用户提供的 Bot ID 和 PAT。
- **操作**: 更新 `.env.local`。
- **输出**: 环境变量可用。

## 2. 创建 CozeChat 组件
- **文件**: `src/components/agents/CozeChat.tsx`
- **逻辑**:
  - 加载 SDK 脚本。
  - 初始化 `WebChatClient`。
  - 处理 Token。

## 3. 集成到 Agent 页面
- **文件**: `src/pages/agents/index.tsx`
- **逻辑**:
  - 引入 `CozeChat`。
  - 根据 `mode === 'market'` 切换渲染。

## 4. 验证与测试
- **操作**: 启动服务，访问 `/agents?mode=market`。
- **预期**: 看到 Coze 的聊天窗口，能正常对话。
