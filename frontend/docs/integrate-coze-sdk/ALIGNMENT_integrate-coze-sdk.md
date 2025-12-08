# 集成 Coze Chat SDK 到市场 Agent 对话框

## 1. 项目上下文分析
- **现有架构**: 项目使用 Next.js，前端页面位于 `src/pages`。
- **目标页面**: `src/pages/agents/index.tsx` 是处理 Agent 对话的通用页面。
- **当前实现**: 目前使用自定义的 React 状态 (`messages`) 和 UI (`components/ui/Editor`) 来实现对话。
- **需求**: 针对“市场 Agent” (`mode=market`)，集成 Coze 官方提供的 Web Chat SDK。

## 2. 需求理解确认
- **目标**: 在“市场 Agent”页面使用 Coze Chat SDK 替代现有 UI。
- **SDK**: `https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js`
- **配置**:
  - `bot_id`: '7572396255272665129'
  - `auth.type`: 'token'
  - `token`: 需要配置用户的 PAT
- **交互**: SDK 自带 UI，需要将其挂载到页面合适位置。

## 3. 智能决策策略
- **集成方式**: 创建一个 React 组件 `CozeChat`，封装 SDK 的加载和初始化逻辑。
- **路由控制**: 在 `src/pages/agents/index.tsx` 中，当 `mode === 'market'` 时，渲染 `CozeChat` 组件，否则保持原有逻辑。
- **环境变量**: 将敏感信息 (Token, Bot ID) 移至 `.env.local`，并通过 `NEXT_PUBLIC_` 前缀暴露给前端（注意：PAT 暴露在前端有风险，但在本原型阶段按用户提供的模式进行）。

## 4. 关键决策点
- **Token 安全**: 用户提供的 PAT 将直接用于前端 SDK。为了安全起见，建议后续改为通过后端获取短期 Token，但目前按用户示例直接使用 PAT。
- **SDK 加载**: 使用 `next/script` 或 `useEffect` 动态加载脚本。

## 5. 最终共识 (拟定)
- 修改 `src/pages/agents/index.tsx`。
- 新增组件 `src/components/agents/CozeChat.tsx`。
- 配置 `.env.local`。
