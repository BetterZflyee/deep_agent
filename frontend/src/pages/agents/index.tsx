import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/common/Header'
import Editor from '../../components/ui/Editor'
import CozeChat from '../../components/agents/CozeChat'
import styles from '../../styles/agents.module.css'
import { callAgent, callStrategyWorkflow } from '../../lib/coze'

type Message = {
  role: 'user' | 'agent'
  content: string
  error?: boolean
}

export default function AgentPage() {
  const router = useRouter()
  const { id, q, mode } = router.query
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const hasInitialized = useRef(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeMode = (mode as string) || 'strategy'

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const trigger = async (text: string) => {
    setLoading(true)
    console.log('[AgentPage] Triggering agent:', { text, id, activeMode })

    // Add user message
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])

    try {
      const payload = { 
        input: text, 
        // Pass conversation_id if available (using id from router as session)
        conversation_id: id,
        // Send previous messages as history to ensure context
        history: messages.map(m => ({
          role: m.role,
          content: m.content,
          content_type: 'text'
        }))
      }
      const json = activeMode === 'strategy' 
        ? await callStrategyWorkflow(payload)
        : await callAgent(activeMode as any, { ...payload, conversation_id: id })
      
      if (!json.ok) {
        throw new Error(json.error?.message || '调用失败')
      }

      // Add agent message
      // If we have events (from strategy workflow), try to format them nicely? 
      // For now keep raw JSON to match requirement "like HeroBanner output" but inside a bubble.
      // But user wants "dialog box", so maybe just the text content if available?
      // The current strategy returns { events: string[], nodes: any[] }
      // If events has content, use that.
      
      let content = ''
      if (json.data && json.data.events && Array.isArray(json.data.events) && json.data.events.length > 0) {
         content = json.data.events.join('\n\n')
      } else {
         content = JSON.stringify(json.data, null, 2)
      }

      const agentMsg: Message = { role: 'agent', content: content }
      setMessages(prev => [...prev, agentMsg])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'agent', content: `Error: ${e.message}`, error: true }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    if (hasInitialized.current) return
    
    // Skip auto-trigger for market agent using Coze SDK
    if (activeMode === 'market') return

    if (q && typeof q === 'string') {
        hasInitialized.current = true
        // Only trigger if we haven't already (in case of strict mode double invoke)
        // But useRef handles that.
        trigger(q)
    }
  }, [router.isReady, q])

  const handleSend = () => {
    if (!inputText.trim() || loading) return
    const text = inputText
    if (editorRef.current) editorRef.current.textContent = ''
    setInputText('')
    trigger(text)
  }

  if (activeMode === 'market') {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main} style={{ position: 'relative', overflow: 'hidden' }}>
           <CozeChat 
             botId={process.env.NEXT_PUBLIC_COZE_MARKET_BOT_ID || ''}
             token={process.env.NEXT_PUBLIC_COZE_PAT || ''}
             title="市场 Agent"
           />
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.chatContainer} ref={scrollRef}>
            {messages.length === 0 && !loading && (
                <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
                    开始与 {activeMode} Agent 对话...
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAgent}`}>
                    <div className={styles.avatar}>
                        {msg.role === 'user' ? 'U' : 'A'}
                    </div>
                    <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAgent}`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {loading && (
                <div className={`${styles.message} ${styles.messageAgent}`}>
                    <div className={styles.avatar}>A</div>
                    <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        <div className={styles.loading}>Thinking...</div>
                    </div>
                </div>
            )}
        </div>
        
        <div className={styles.inputWrapper}>
            <div className={styles.inputInner}>
                <div className={styles.inputContainer}>
                    <Editor 
                        ref={editorRef}
                        onInput={(e) => setInputText(e.currentTarget.textContent || '')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        style={{ minHeight: '24px', outline: 'none' }}
                    />
                    <button className={styles.sendButton} onClick={handleSend} disabled={loading}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path fill="#fff" d="M11.293 3.293a1 1 0 0 1 1.414 0l8 8a1 1 0 0 1-1.414 1.414L13 6.414V20a1 1 0 1 1-2 0V6.414l-6.293 6.293a1 1 0 0 1-1.414-1.414z"/>
                      </svg>
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
