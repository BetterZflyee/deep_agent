import styles from '../../styles/create.module.css'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className={styles.cta}>
      <h2>准备好开始了吗？</h2>
      <p>立即创建任务，触发工作流，获取结构化洞察与策略。</p>
      <div className={styles.heroActions}>
        <Link href="/" className={styles.primaryBtn}>立即创建任务</Link>
        <Link href="/runs" className={styles.secondaryBtn}>查看最近运行</Link>
      </div>
    </section>
  )
}
