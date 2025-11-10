import type { Route, ComparisonRow, BankingKPIs, Pool, PoolMember } from '../domain/types'

export interface RoutesPort {
    getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>
    setBaseline(id: number): Promise<void>
    getComparison(): Promise<ComparisonRow[]>
}

export interface BankingPort {
    // shipId required by backend; year also required
    getCb(shipId: string, year: number): Promise<{ cb: number }>
    bank(shipId: string, year: number, amount: number): Promise<BankingKPIs>
    apply(shipId: string, year: number, amount: number): Promise<BankingKPIs>
}

export interface PoolingPort {
    // adjusted CB is fetched per shipId & year
    getAdjustedCb(shipId: string, year: number): Promise<{ shipId: string; year: number; cb_before: number; banked: number; adjusted: number }>
    // createPool requires the year and members with shipId & cb_before
    createPool(year: number, members: PoolMember[]): Promise<Pool>
}
