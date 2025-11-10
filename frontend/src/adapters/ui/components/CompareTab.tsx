import { useEffect, useState } from 'react'
import apiClient from '../../infrastructure/apiClient'
import type { ComparisonRow } from '../../../core/domain/types'

const TARGET = 89.3368

export default function CompareTab(){
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string| null>(null)

  useEffect(()=>{ (async ()=>{
    setLoading(true)
    try{
      const data = await apiClient.getComparison()
      setRows(data)
    }catch(err){
      setError(err instanceof Error ? err.message : String(err))
    }finally{setLoading(false)}
  })() }, [])

  function percentDiff(baseline: number, comparison: number){
    if (!baseline) return 0
    return ((comparison / baseline) - 1) * 100
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Compare</h2>
      <div className="mb-4">Target: <strong>{TARGET} gCO₂e/MJ</strong></div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

  <div className="overflow-auto">
  <table className="min-w-full table-auto border-collapse feu-table">
        <thead>
          <tr>
            <th className="border px-2">routeId</th>
            <th className="border px-2">baseline (g/MJ)</th>
            <th className="border px-2">comparison (g/MJ)</th>
            <th className="border px-2">% diff</th>
            <th className="border px-2">compliant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>{
            const pd = percentDiff(r.baselineGhg, r.comparisonGhg)
            const compliant = r.comparisonGhg <= TARGET
            return (
              <tr key={r.routeId}>
                <td className="border px-2">{r.routeId}</td>
                <td className="border px-2">{r.baselineGhg.toFixed(2)}</td>
                <td className="border px-2">{r.comparisonGhg.toFixed(2)}</td>
                <td className="border px-2">{pd.toFixed(2)}%</td>
                <td className="border px-2">{compliant ? '✅' : '❌'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>

      {/* Simple inline bar chart */}
      <div className="mt-6">
        <h3 className="font-medium">Ghg Intensity chart</h3>
        <div className="mt-2 space-y-3">
          {rows.map(r=>{
            const max = Math.max(r.baselineGhg, r.comparisonGhg, TARGET)
            const bw = Math.max(1, Math.round((r.baselineGhg / max) * 200))
            const cw = Math.max(1, Math.round((r.comparisonGhg / max) * 200))
            return (
              <div key={r.routeId} className="flex items-center gap-3">
                <div className="w-32 text-sm">{r.routeId}</div>
                <div className="h-4 bg-blue-300" style={{ width: bw }} title={`baseline ${r.baselineGhg}`} />
                <div className="h-4 bg-green-300" style={{ width: cw }} title={`comparison ${r.comparisonGhg}`} />
                <div className="text-xs ml-2">{r.baselineGhg.toFixed(2)} / {r.comparisonGhg.toFixed(2)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
