import { RouteDTO } from '../domain/types';

export interface RoutesRepository {
  findAll(filter?: Partial<RouteDTO>): Promise<RouteDTO[]>;
  findById(id: number): Promise<RouteDTO | null>;
  findBaseline(year?: number): Promise<RouteDTO | null>;
  setBaseline(id: number): Promise<void>;
  upsert(route: RouteDTO): Promise<RouteDTO>;
}

export interface ComplianceRepository {
  saveCB(shipId: string, year: number, cb: number): Promise<void>;
  getCB(shipId: string, year: number): Promise<number | null>;
}

export interface BankingRepository {
  getBanked(shipId: string, year: number): Promise<number>;
  addBankEntry(shipId: string, year: number, amount: number): Promise<void>;
  consumeBanked(shipId: string, year: number, amount: number): Promise<void>;
}

export interface PoolsRepository {
  createPool(year: number, members: { shipId: string; cb_before: number; cb_after: number }[]): Promise<any>;
}
