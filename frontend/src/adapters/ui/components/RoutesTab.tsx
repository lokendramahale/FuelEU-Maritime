import { useEffect, useState } from 'react'
import apiClient from '../../infrastructure/apiClient'
import type { Route } from '../../../core/domain/types'

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const f: Record<string, unknown> = {}
      if (filters.vesselType) f.vesselType = filters.vesselType
      if (filters.fuelType) f.fuelType = filters.fuelType
      if (filters.year) f.year = Number(filters.year)
      const data = await apiClient.getRoutes(f)
      setRoutes(data)
    } catch (err: any) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as any).message : String(err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // initial load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { (async ()=>{ await load() })() }, [])

  async function onSetBaseline(id: number) {
    try {
      await apiClient.setBaseline(id)
      await load()
      alert('Baseline set')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert(msg || 'Failed')
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Routes</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input placeholder="vesselType" className="border p-1" value={filters.vesselType} onChange={e=>setFilters(s=>({...s,vesselType:e.target.value}))} />
        <input placeholder="fuelType" className="border p-1" value={filters.fuelType} onChange={e=>setFilters(s=>({...s,fuelType:e.target.value}))} />
        <input placeholder="year" className="border p-1" value={filters.year} onChange={e=>setFilters(s=>({...s,year:e.target.value}))} />
        <button className="bg-blue-600 text-white px-3 rounded" onClick={load}>Filter</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-auto">
      <table className="min-w-full table-auto border-collapse feu-table">
        <thead>
          <tr>
            <th className="border px-2">routeId</th>
            <th className="border px-2">vesselType</th>
            <th className="border px-2">fuelType</th>
            <th className="border px-2">year</th>
            <th className="border px-2">ghgIntensity (gCO₂e/MJ)</th>
            <th className="border px-2">fuelConsumption (t)</th>
            <th className="border px-2">distance (km)</th>
            <th className="border px-2">totalEmissions (t)</th>
            <th className="border px-2">actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(r=> (
            <tr key={r.routeId}>
              <td className="border px-2">{r.routeId}</td>
              <td className="border px-2">{r.vesselType}</td>
              <td className="border px-2">{r.fuelType}</td>
              <td className="border px-2">{r.year}</td>
              <td className="border px-2">{r.ghgIntensity}</td>
              <td className="border px-2">{r.fuelConsumption ?? '—'}</td>
              <td className="border px-2">{r.distanceKm ?? '—'}</td>
              <td className="border px-2">{r.totalEmissions ?? '—'}</td>
              <td className="border px-2"><button className="bg-green-600 text-white px-2" onClick={()=>onSetBaseline(r.id)}>Set Baseline</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
