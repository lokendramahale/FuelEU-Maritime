import { Route, ComparisonRow, CBRecord } from "../../domain/types";

export interface PoolMember {
  shipId: string;
  cb_before: number;
}

export interface RouteRepository {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonRow[]>;
  getCB(shipId: string, year: number): Promise<CBRecord>;
  getAdjustedCB(year: number): Promise<CBRecord[]>;
  bankCB(payload: { shipId: string; year: number; amount: number }): Promise<CBRecord>;
  applyBank(payload: { shipId: string; year: number; amount: number}): Promise<CBRecord>;
  createPool(payload: { year: number; members: PoolMember[] }): Promise<{ members: PoolMember[] }>;
}
