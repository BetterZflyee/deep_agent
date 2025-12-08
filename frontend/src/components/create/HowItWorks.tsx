import styles from '../../styles/create.module.css'

const steps = [
  { title: '选择 Agent 模式', desc: '在平台中选择战略/市场/营销 Agent。' },
  { title: '填写参数并触发', desc: '输入公司、目标等参数，发起一次运行。' },
  { title: '查看运行状态', desc: '后端轮询，前端订阅，状态可视化。' },
  { title: '导出结构化结果', desc: 'JSON Schema/文档双轨输出，便于复盘。' }
]

export default function HowItWorks() {
  return (
    <section className={styles.how}>
      <h2 className={styles.sectionTitle}>使用流程</h2>
      <ol className={styles.howGrid}>
        {steps.map((s, i) => (
          <li key={i} className={styles.howItem}>
            <div className={styles.howIndex}>{i + 1}</div>
            <div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
