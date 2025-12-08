import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface CozeChatProps {
  botId: string
  token: string
  title?: string
}

export default function CozeChat({ botId, token, title = 'Coze' }: CozeChatProps) {
  const clientRef = useRef<any>(null)

  const initCoze = () => {
    if (clientRef.current) return
    if (!(window as any).CozeWebSDK) return

    const CozeWebSDK = (window as any).CozeWebSDK
    
    try {
      clientRef.current = new CozeWebSDK.WebChatClient({
        config: {
          bot_id: botId,
          isIframe: false,
        },
        // componentProps removed to match official example strictly
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: async () => token
        },
        ui: {
          asstBtn: {
            isNeed: true,
          },
        },
      })
      console.log('Coze SDK initialized')
    } catch (e) {
      console.error('Failed to initialize Coze SDK:', e)
    }
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        console.log('Cleaning up Coze SDK...')
        if (typeof clientRef.current.destroy === 'function') {
          clientRef.current.destroy()
        } else if (typeof clientRef.current.dispose === 'function') {
          clientRef.current.dispose()
        }
        clientRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%', 
      color: '#666' 
    }}>
      <Script 
        src="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js"
        onLoad={initCoze}
      />
      <div>
        <p>市场 Agent 已加载</p>
        <p style={{ fontSize: '0.8em', marginTop: '10px' }}>请点击页面右下角的悬浮球开始对话</p>
        <p style={{ fontSize: '0.8em', color: '#999', marginTop: '5px' }}>
          如果遇到连接问题，请确认已在 Coze 控制台配置安全域名
        </p>
      </div>
    </div>
  )
}
