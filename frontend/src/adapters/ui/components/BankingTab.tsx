import { useEffect, useState } from 'react'
import apiClient from '../../infrastructure/apiClient'

export default function BankingTab(){
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [shipId, setShipId] = useState<string>('')
  const [cb, setCb] = useState<number | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [kpis, setKpis] = useState<{cb_before:number, applied:number, cb_after:number} | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  async function load(){
    setLoading(true); setError(null)
    try{
      if (!shipId) {
        setCb(null)
        setError('Enter shipId to load CB')
        return
      }
      const res = await apiClient.getCb(shipId, year)
      setCb(res.cb)
    }catch(err: unknown){ setError(err instanceof Error ? err.message : String(err)) }
    finally{ setLoading(false) }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ load() }, [year, shipId])

  async function doBank(){
    if (!amount) return
    try{
      const num = Number(amount)
      if (!shipId) { setError('shipId required'); return }
      const result = await apiClient.bank(shipId, year, num)
      setKpis(result)
      setCb(result.cb_after)
    }catch(err: unknown){ setError(err instanceof Error ? err.message : String(err)) }
  }

  async function doApply(){
    if (!amount) return
    try{
      const num = Number(amount)
      if (!shipId) { setError('shipId required'); return }
      const result = await apiClient.apply(shipId, year, num)
      setKpis(result)
      setCb(result.cb_after)
    }catch(err: unknown){ setError(err instanceof Error ? err.message : String(err)) }
  }

  const canAct = (cb ?? 0) > 0

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Banking (Article 20)</h2>
    <div className="mb-3 flex flex-col md:flex-row gap-3 items-start">
      <label className="mr-2">Ship Id: <input className="border p-1 ml-2" value={shipId} onChange={e=>setShipId(e.target.value)} aria-label="shipId" /></label>
      <label>Year: <input className="border p-1 ml-2" value={year} onChange={e=>setYear(Number(e.target.value))} aria-label="year" /></label>
    </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="mb-3">Current CB: <strong>{cb ?? '—'}</strong></div>

      <div className="flex gap-2 items-center">
        <input placeholder="amount" className="border p-1" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button className="bg-green-600 text-white px-3 rounded" onClick={doBank} disabled={!canAct}>Bank</button>
        <button className="bg-indigo-600 text-white px-3 rounded" onClick={doApply} disabled={!canAct}>Apply</button>
      </div>

      {kpis && (
        <div className="mt-4 border p-3 rounded bg-gray-50">
          <div>cb_before: {kpis.cb_before}</div>
          <div>applied: {kpis.applied}</div>
          <div>cb_after: {kpis.cb_after}</div>
        </div>
      )}
    </div>
  )
}
