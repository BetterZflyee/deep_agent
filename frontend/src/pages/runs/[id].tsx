import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getRun } from '../../lib/api'

export default function RunDetail() {
  const router = useRouter()
  const { id } = router.query
  const [run, setRun] = useState<any | null>(null)

  useEffect(() => {
    if (!id || typeof id !== 'string') return
    let mounted = true
    async function poll() {
      const r = await getRun(id)
      if (mounted) setRun(r)
    }
    poll()
    const timer = setInterval(poll, 1500)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [id])

  if (!id) return null
  return (
    <div style={{ maxWidth: 900, margin: '24px auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto' }}>
      <h1>Run {id}</h1>
      {!run ? (
        <div>加载中...</div>
      ) : (
        <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6, overflowX: 'auto' }}>{JSON.stringify(run, null, 2)}</pre>
      )}
    </div>
  )
}
