import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createRun, listRuns } from '../lib/api'

type Mode = 'strategy' | 'market' | 'marketing'

export default function Home() {
  const [mode, setMode] = useState<Mode>('strategy')
  const [agentId, setAgentId] = useState('strategy-agent')
  const router = useRouter()
  const [company, setCompany] = useState('Acme')
  const [goal, setGoal] = useState('行业/竞品/趋势洞察')
  const [loading, setLoading] = useState(false)
  const [runs, setRuns] = useState<any[]>([])

  async function refresh() {
    const r = await listRuns()
    setRuns(r)
  }

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const q = router.query?.mode
    if (typeof q === 'string') {
      const m = q as Mode
      if (m === 'strategy' || m === 'market' || m === 'marketing') {
        setMode(m)
        setAgentId(m === 'strategy' ? 'strategy-agent' : m === 'market' ? 'market-agent' : 'marketing-agent')
      }
    }
  }, [router.query])

  async function submit() {
    setLoading(true)
    try {
      const input = { company, goal }
      await createRun(agentId, mode, input)
      await refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto' }}>
      <h1>Agent 平台（最小可运行）</h1>
      <p>后端：触发工作流 → 轮询状态 → 结果展示</p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <label>
          Agent 模式
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} style={{ display: 'block', width: '100%', padding: 8 }}>
            <option value="strategy">战略 Agent</option>
            <option value="market">市场 Agent</option>
            <option value="marketing">营销 Agent</option>
          </select>
        </label>
        <label>
          Agent ID
          <input value={agentId} onChange={(e) => setAgentId(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <label>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
        <label>
          目标
          <input value={goal} onChange={(e) => setGoal(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>
      </div>

      <button onClick={submit} disabled={loading} style={{ marginTop: 12, padding: '8px 16px' }}>
        {loading ? '提交中...' : '触发工作流'}
      </button>

      <h2 style={{ marginTop: 24 }}>最近运行</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {runs.map((r) => (
          <div key={r.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{r.agentMode}</strong>
              <span>{r.status}</span>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>id: {r.id}</div>
            {r.output && (
              <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6, overflowX: 'auto' }}>{JSON.stringify(r.output, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
