import React, { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/apiClient";
import { percentDiff, TARGET_INTENSITY } from "../../../shared/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CompareTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.getComparison().then(r => {
      setRows(r.map(row => ({
        id: row.baseline.routeId + "_" + row.comparison.routeId,
        baseline: row.baseline.ghgIntensity,
        comparison: row.comparison.ghgIntensity,
        percentDiff: Number(row.percentDiff.toFixed(3)),
        compliant: row.compliant
      })));
    }).finally(()=>setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Compare (Target {TARGET_INTENSITY} gCO₂e/MJ)</h2>

      {loading ? <div>Loading...</div> : (
        <>
          <div className="h-64 bg-white rounded shadow p-4 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="baseline" name="Baseline" />
                <Bar dataKey="comparison" name="Comparison" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded shadow overflow-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">pair</th>
                  <th className="p-2 text-right">baseline (gCO₂e/MJ)</th>
                  <th className="p-2 text-right">comparison (gCO₂e/MJ)</th>
                  <th className="p-2 text-right">% diff</th>
                  <th className="p-2">compliant</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.id}</td>
                    <td className="p-2 text-right">{r.baseline}</td>
                    <td className="p-2 text-right">{r.comparison}</td>
                    <td className="p-2 text-right">{r.percentDiff}%</td>
                    <td className="p-2">{r.compliant ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
