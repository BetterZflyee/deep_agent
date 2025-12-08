import styles from '../../styles/create.module.css'

const items = [
  { title: '行业/竞品/趋势洞察', desc: '战略 Agent 聚焦高层决策支持，结构化输出洞察与建议。' },
  { title: '投标拆解与资质分析', desc: '市场 Agent 面向招投标场景，标准化拆解与对比。' },
  { title: '数据驱动营销策略', desc: '营销 Agent 产出策略、预算、目标与专业文档。' }
]

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <h2 className={styles.sectionTitle}>能力亮点</h2>
      <div className={styles.highlightGrid}>
        {items.map((it, i) => (
          <div key={i} className={styles.highlightItem}>
            <strong>{it.title}</strong>
            <p>{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
