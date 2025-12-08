import styles from '../../styles/create.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Editor from '../ui/Editor'
import Typewriter from '../ui/Typewriter'

type Mode = 'strategy' | 'market' | 'marketing'

export default function HeroBanner() {
  const router = useRouter()
  const [hasContent, setHasContent] = useState(false)
  const [inputText, setInputText] = useState('')
  const [activeMode, setActiveMode] = useState<Mode>('strategy')

  useEffect(() => {
    const container = document.querySelector(`.${styles.heroImage}`)
    const img = container?.querySelector('img') as HTMLImageElement | undefined
    if (img) {
      try {
        img.onclick = null
        img.onabort = null
        img.onerror = null
        img.onload = null
      } catch {}
      img.remove()
    }
    if (container) {
      const clone = container.cloneNode(false)
      container.replaceWith(clone)
    }
  }, [])

  const handleSend = () => {
    if (!inputText.trim()) return
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    router.push({
      pathname: '/agents',
      query: { id, q: inputText, mode: activeMode }
    })
  }

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.heroSubtitle}>战略、市场、营销</p>
        <h1 className={styles.heroTitle}>Agent 平台·一体化洞察与执行</h1>
        <div className={styles.actionBar}>
          <Link href="/?mode=strategy" className={`${styles.actionCard} ${activeMode==='strategy' ? styles.actionCardActive : ''} ${styles.actionCardPrimary}`} onClick={(e) => { e.preventDefault(); setActiveMode('strategy') }}>
            <span className={styles.actionBadge}></span>
            <span className={styles.actionIcon}><img src="/agents/strategy-poster-1.svg" alt="战略Agent"/></span>
            <span className={styles.actionLabel}>战略Agent</span>
          </Link>
          <Link href="/?mode=market" className={`${styles.actionCard} ${activeMode==='market' ? styles.actionCardActive : ''}`} onClick={(e) => { e.preventDefault(); setActiveMode('market') }}>
            <span className={styles.actionBadge}></span>
            <span className={styles.actionIcon}><img src="/agents/market-poster-1.svg" alt="市场Agent"/></span>
            <span className={styles.actionLabel}>市场Agent</span>
          </Link>
          <Link href="/?mode=marketing" className={`${styles.actionCard} ${activeMode==='marketing' ? styles.actionCardActive : ''}`} onClick={(e) => { e.preventDefault(); setActiveMode('marketing') }}>
            <span className={styles.actionBadge}></span>
            <span className={styles.actionIcon}><img src="/agents/marketing-poster-1.svg" alt="营销Agent"/></span>
            <span className={styles.actionLabel}>营销Agent</span>
          </Link>
        </div>
        <div className={styles.editorWrapper}>
          <div className={styles.inputContainer}>
            <Editor onInput={(e) => {
              const text = e.currentTarget.textContent || '';
              setHasContent(text.trim().length > 0);
              setInputText(text);
            }} />
            {!hasContent && (
              <div className={styles.editorPlaceholder}>
                <Typewriter 
                  words={["deep agent 打造卓有成效的战略、市场、营销报告"]}
                  typeSpeed={100}
                  deleteSpeed={50}
                  delay={2000}
                />
              </div>
            )}
            <button 
              className={styles.sendButton} 
              aria-label="Send" 
              onClick={handleSend}
              disabled={!hasContent}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path fill="#fff" d="M11.293 3.293a1 1 0 0 1 1.414 0l8 8a1 1 0 0 1-1.414 1.414L13 6.414V20a1 1 0 1 1-2 0V6.414l-6.293 6.293a1 1 0 0 1-1.414-1.414z"/>
              </svg>
            </button>
          </div>
          <div className={styles.controlBar} />
        </div>
      </div>
      {/* heroImage removed intentionally */}
    </section>
  )
}
