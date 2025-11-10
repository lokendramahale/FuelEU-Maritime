export type Route = {
    id: number
    routeId: string
    vesselType: string
    fuelType: string
    year: number
    ghgIntensity: number // gCO2e/MJ
    fuelConsumption?: number // t
    distanceKm?: number // km
    totalEmissions?: number // t
    isBaseline?: boolean
}

export type ComparisonRow = {
    routeId: string
    baselineGhg: number
    comparisonGhg: number
    percentDiff?: number
    compliant?: boolean
    target?: number
    compliantToTarget?: boolean
}

export type BankingKPIs = {
    cb_before: number
    applied: number
    cb_after: number
}

export type PoolMember = {
    shipId: string
    // cb before pooling/banking adjustments
    cb_before: number
    // optional resulting cb after pool applied
    cb_after?: number
}

export type Pool = {
    id?: string
    members: PoolMember[]
}
