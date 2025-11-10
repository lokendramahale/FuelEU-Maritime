import React, { useEffect, useState } from "react";
import { apiClient } from "../../infrastructure/apiClient";

type MemberInput = { shipId: string; cb_before: number };

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<MemberInput[]>([
    { shipId: "R001", cb_before: 1000 },
    { shipId: "R002", cb_before: 500 },
  ]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  // Update a member field
  function updateMember(idx: number, key: keyof MemberInput, value: any) {
    setMembers((old) => old.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));
  }

  // Calculate pool sum and validity
  const sum = members.reduce((s, m) => s + Number(m.cb_before || 0), 0);
  const valid = sum >= 0 && members.every((m) => typeof m.cb_before === "number" && !isNaN(m.cb_before));

  async function handleCreatePool() {
    if (!valid) {
      alert("⚠️ Invalid pool: total CB sum must be ≥ 0 and all CB values must be numbers.");
      return;
    }

    // Pre-check: Avoid mixing extreme positive and negative balances
    const hasPositive = members.some((m) => m.cb_before > 0);
    const hasNegative = members.some((m) => m.cb_before < 0);
    if (hasPositive && hasNegative && Math.abs(sum) > 100) {
      alert("⚠️ Warning: Mixed positive and negative balances may make one ship worse off.");
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await apiClient.createPool({
        year,
        members: members.map((m) => ({
          shipId: m.shipId.trim(),
          cb_before: Number(m.cb_before),
        })),
      });
      setResult(res);
      alert("✅ Pool created successfully!");
    } catch (e: any) {
      const msg = e?.message || "Create pool failed";
      if (msg.includes("worse off")) {
        alert("⚠️ Allocation invalid: one or more ships would be worse off after pooling.");
      } else {
        alert("❌ " + msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>

      {/* Year Input */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 border rounded w-28"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="font-semibold mb-3">Pool Members</h3>

        {members.map((m, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input
              value={m.shipId}
              onChange={(e) => updateMember(idx, "shipId", e.target.value)}
              placeholder="Ship ID"
              className="p-2 border rounded w-32"
            />
            <input
              type="number"
              value={m.cb_before}
              onChange={(e) => updateMember(idx, "cb_before", Number(e.target.value))}
              placeholder="CB Before"
              className="p-2 border rounded w-40"
            />
            <button
              onClick={() => setMembers((old) => old.filter((_, i) => i !== idx))}
              className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => setMembers((old) => [...old, { shipId: `R00${old.length + 1}`, cb_before: 0 }])}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded"
          disabled={loading}
        >
          Add Member
        </button>
      </div>

      {/* Pool Summary */}
      <div className="mb-4 text-lg">
        <span>Pool Sum: </span>
        <strong className={sum >= 0 ? "text-green-600" : "text-red-600"}>{sum}</strong>
      </div>

      {/* Submit Button */}
      <button
        disabled={!valid || loading}
        onClick={handleCreatePool}
        className={`px-4 py-2 rounded ${
          valid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-700"
        }`}
      >
        {loading ? "Creating..." : "Create Pool"}
      </button>

      {/* Result Display */}
      {result && (
        <div className="mt-6 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3 text-lg">Pool Result</h3>
          <ul className="space-y-1">
            {result.members.map((m: any) => (
              <li key={m.shipId} className="text-sm">
                {m.shipId}:{" "}
                <span className="text-gray-700">{m.cb_before}</span> →{" "}
                <span
                  className={m.cb_after > m.cb_before ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                >
                  {m.cb_after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
