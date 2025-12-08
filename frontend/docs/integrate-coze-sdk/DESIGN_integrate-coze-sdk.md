# Coze SDK 集成架构设计

## 1. 整体架构
- **前端组件**: 新增 `CozeChat` 组件，负责加载和初始化 SDK。
- **页面逻辑**: `AgentPage` 根据 `mode` 参数决定渲染原生聊天界面还是 Coze SDK 界面。

## 2. 模块设计

### 2.1 CozeChat 组件 (`src/components/agents/CozeChat.tsx`)
- **Props**:
  - `botId`: string
  - `token`: string
  - `title`: string
- **State**:
  - `sdkLoaded`: boolean
- **Logic**:
  - 动态加载 SDK 脚本 `https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js`。
  - 脚本加载成功后，调用 `new CozeWebSDK.WebChatClient`。
  - 尝试将 SDK 挂载到特定容器（如果支持），或者允许其以默认方式（通常是浮窗或全屏）运行。
  - *注*: 考虑到用户体验，如果 SDK 是全屏覆盖，可能不需要保留原有的 Header 和 Layout，或者需要调整 Layout。

### 2.2 AgentPage (`src/pages/agents/index.tsx`)
- **逻辑修改**:
  - 获取 `mode`。
  - 如果 `mode === 'market'`：
    - 渲染 `<CozeChat />`。
  - 否则：
    - 渲染原有的 `Editor` 和 `MessageList`。

## 3. 接口契约
- **环境变量**:
  - `NEXT_PUBLIC_COZE_MARKET_BOT_ID`
  - `NEXT_PUBLIC_COZE_PAT`

## 4. 异常处理
- 如果 SDK 加载失败，显示错误信息。
- 如果 Token 无效，SDK 内部会处理，或者我们在 `onRefreshToken` 中处理。
