import React, { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/apiClient";
import type { CBRecord } from "../../../core/domain/types";

export default function BankingTab(){
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState<number>(2024);
  const [cb, setCb] = useState<CBRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  async function load(){
    setLoading(true);
    try {
      const record = await apiClient.getCB(shipId, year);
      setCb(record);
    } catch(e:any){
      alert(e?.message || "Failed to load CB");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleBank(){
    if(!cb || cb.cb_before <= 0){ alert("No positive CB to bank"); return; }
    setLoading(true);
    try {
      const res = await apiClient.bankCB({ shipId, year, amount: cb.cb_before });
      setCb(res);
      alert("Banked successfully");
    } catch(e:any){
      alert(e?.message || "Bank failed");
    } finally { setLoading(false); }
  }

  async function handleApply(){
    if(!cb || amount <= 0){ alert("Enter amount to apply"); return; }
    setLoading(true);
    try{
      const res = await apiClient.applyBank({ shipId, year, amount });
      setCb(res);
      alert("Applied successfully");
    }catch(e:any){
      alert(e?.message || "Apply failed");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h2 className="text-xl mb-4">Banking</h2>
      <div className="flex gap-2 mb-4">
        <input className="p-2 border rounded" value={shipId} onChange={e=>setShipId(e.target.value)} />
        <input className="p-2 border rounded w-28" type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
        <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={load}>Load CB</button>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && cb && (
        <div className="bg-white rounded shadow p-4 max-w-xl">
          <div>cb_before: {cb.cb_before}</div>
          <div>applied: {cb.applied ?? 0}</div>
          <div>cb_after: {cb.cb_after ?? cb.cb_before}</div>

          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={handleBank} disabled={cb.cb_before <= 0}>Bank surplus</button>
            <input className="p-2 border rounded w-40" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} placeholder="amount to apply" />
            <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={handleApply} disabled={amount <= 0}>Apply bank</button>
          </div>
        </div>
      )}
    </div>
  );
}
