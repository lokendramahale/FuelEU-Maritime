import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../infrastructure/apiClient";
import type { Route } from "../../../core/domain/types";
import { formatNumber } from "../../../shared/helpers";

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });

  // ✅ Fetch routes once
  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      setLoading(true);
      const data = await apiClient.getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    } finally {
      setLoading(false);
    }
  }

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map(r => String(r.year)))), [routes]);

  const filtered = routes.filter(r =>
    (!filters.vesselType || r.vesselType === filters.vesselType) &&
    (!filters.fuelType || r.fuelType === filters.fuelType) &&
    (!filters.year || String(r.year) === filters.year)
  );

  // ✅ Set baseline
  async function handleSetBaseline(routeId: string) {
  console.log("Setting baseline for:", routeId); // ✅ debug
  try {
    setLoading(true);
    const updated = await apiClient.setBaseline(routeId);
    alert(`Baseline set for route ${routeId}`);
    await fetchRoutes();
  } catch (err: any) {
    console.error("Error in handleSetBaseline:", err);
    alert(err?.response?.data?.error || err.message || "Failed to set baseline");
  } finally {
    setLoading(false);
  }
}


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Routes</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          aria-label="Vessel type"
          value={filters.vesselType}
          onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">All vessel types</option>
          {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select
          aria-label="Fuel type"
          value={filters.fuelType}
          onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">All fuel types</option>
          {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          aria-label="Year"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* 🧭 Routes Table */}
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Route ID</th>
                <th className="p-2 text-left">Vessel Type</th>
                <th className="p-2 text-left">Fuel Type</th>
                <th className="p-2 text-right">Year</th>
                <th className="p-2 text-right">GHG Intensity</th>
                <th className="p-2 text-right">Fuel Consumption (t)</th>
                <th className="p-2 text-right">Distance (km)</th>
                <th className="p-2 text-right">Total Emissions (t)</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(route => (
                <tr key={route.id} className="border-t">
                  <td className="p-2">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded">
                        baseline
                      </span>
                    )}
                  </td>
                  <td className="p-2">{route.vesselType}</td>
                  <td className="p-2">{route.fuelType}</td>
                  <td className="p-2 text-right">{route.year}</td>
                  <td className="p-2 text-right">{formatNumber(route.ghgIntensity, 3)}</td>
                  <td className="p-2 text-right">{formatNumber(route.fuelConsumption)}</td>
                  <td className="p-2 text-right">{formatNumber(route.distance)}</td>
                  <td className="p-2 text-right">{formatNumber(route.totalEmissions)}</td>
                  <td className="p-2">
                    <button
                      disabled={loading || route.isBaseline}
                      className={`px-2 py-1 rounded text-white ${route.isBaseline ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                      onClick={() => handleSetBaseline(route.id)}
                    >
                      {route.isBaseline ? "Baseline" : "Set Baseline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-4 text-gray-600">No routes found for the selected filters.</div>
          )}
        </div>
      )}
    </div>
  );
}
