import styles from '../../styles/create.module.css'

const posters = [
  { id: 'strategy', title: '战略 Agent', img: '/agents/strategy-poster-1.svg', desc: '行业/竞品/趋势洞察、XSWOT分析、战略目标与举措' },
  { id: 'market', title: '市场 Agent', img: '/agents/market-poster-1.svg', desc: '投标文件拆解、招标竞对人员资质模型分析' },
  { id: 'marketing', title: '营销 Agent', img: '/agents/marketing-poster-1.svg', desc: '数据驱动策略、预算管理、专业文档输出' }
]

export default function AgentPosterGrid() {
  return (
    <section id="posters" className={styles.posterSection}>
      <h2 className={styles.sectionTitle}>核心 Agent 海报</h2>
      <div className={styles.posterGrid}>
        {posters.map(p => (
          <div key={p.id} className={styles.posterCard}>
            <img src={p.img} alt={p.title} />
            <div className={styles.posterInfo}>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
