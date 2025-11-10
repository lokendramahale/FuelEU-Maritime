import type { RoutesPort, BankingPort, PoolingPort } from '../../core/ports/outbound'
import type { Route, ComparisonRow, BankingKPIs, PoolMember, Pool } from '../../core/domain/types'

// Use Vite env var VITE_API_BASE or default to backend dev URL
const base = ((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_API_BASE ?? 'http://localhost:4000'

async function handleResp(res: Response) {
    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
    }
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return res.json()
    return null
}

export const apiClient: RoutesPort & BankingPort & PoolingPort = {
    async getRoutes(filters) {
        const params = new URLSearchParams()
        if (filters?.vesselType) params.set('vesselType', filters.vesselType)
        if (filters?.fuelType) params.set('fuelType', filters.fuelType)
        if (filters?.year) params.set('year', String(filters.year))
        const url = `${base}/routes${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url)
        const data = await handleResp(res)
        return (data as Route[] | null) ?? []
    },

    async setBaseline(id: number) {
        const res = await fetch(`${base}/routes/${encodeURIComponent(String(id))}/baseline`, {
            method: 'POST'
        })
        await handleResp(res)
    },

    async getComparison() {
        const res = await fetch(`${base}/routes/comparison`)
        const data = await handleResp(res)
        // backend returns { baseline, comparisons: [{ route, percentDiff, compliant, target, compliantToTarget }] }
        if (!data) return []
        try {
            const payload = data as Record<string, unknown>
            const baselineRaw = payload['baseline']
            const compsRaw = Array.isArray(payload['comparisons']) ? payload['comparisons'] as unknown[] : []

            const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
            const baselineRoute = isObj(baselineRaw) ? baselineRaw as Record<string, unknown> : undefined

            const baselineGhg = isObj(baselineRoute) && typeof baselineRoute['ghgIntensity'] === 'number' ? baselineRoute['ghgIntensity'] as number : 0

            const rows: ComparisonRow[] = compsRaw.map((item) => {
                const cObj = isObj(item) ? item as Record<string, unknown> : {}
                const routeObj = isObj(cObj['route']) ? cObj['route'] as Record<string, unknown> : undefined
                const comparisonGhg = routeObj && typeof routeObj['ghgIntensity'] === 'number' ? routeObj['ghgIntensity'] as number : (typeof cObj['ghgIntensity'] === 'number' ? cObj['ghgIntensity'] as number : 0)
                const percentDiff = typeof cObj['percentDiff'] === 'number' ? cObj['percentDiff'] as number : (comparisonGhg / (baselineGhg || 1) - 1) * 100
                const routeId = routeObj && typeof routeObj['routeId'] === 'string' ? routeObj['routeId'] as string : (typeof cObj['routeId'] === 'string' ? cObj['routeId'] as string : 'unknown')
                const compliant = Boolean(cObj['compliant'])
                const target = typeof cObj['target'] === 'number' ? cObj['target'] as number : undefined
                const compliantToTarget = Boolean(cObj['compliantToTarget'])
                return {
                    routeId,
                    baselineGhg,
                    comparisonGhg,
                    percentDiff,
                    compliant,
                    target,
                    compliantToTarget
                }
            })
            return rows
        } catch {
            return []
        }
    },
    async bank(shipId, year, amount) {
        const res = await fetch(`${base}/banking/bank`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shipId, year, amount })
        })
        return (await handleResp(res)) as BankingKPIs
    },

    async getCb(shipId, year) {
        const url = `${base}/compliance/cb?shipId=${encodeURIComponent(String(shipId))}&year=${encodeURIComponent(String(year))}`
        const res = await fetch(url)
        return (await handleResp(res)) as { cb: number }
    },

    async apply(shipId, year, amount) {
        const res = await fetch(`${base}/banking/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shipId, year, amount })
        })
        return (await handleResp(res)) as BankingKPIs
    },

    async getAdjustedCb(shipId, year) {
        const url = `${base}/compliance/adjusted-cb?shipId=${encodeURIComponent(String(shipId))}&year=${encodeURIComponent(String(year))}`
        const res = await fetch(url)
        return (await handleResp(res)) as { shipId: string; year: number; cb_before: number; banked: number; adjusted: number }
    },

    async createPool(year: number, members: PoolMember[]) {
        const res = await fetch(`${base}/pools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, members })
        })
        return (await handleResp(res)) as Pool
    }
}

export default apiClient
