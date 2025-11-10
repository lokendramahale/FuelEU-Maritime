import React, { useState } from "react";

type Tab = { id: string; label: string; component: React.ReactNode };

export const Tabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              t.id === active
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-blue-50"
            }`}
            aria-pressed={t.id === active}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section aria-live="polite">{current.component}</section>
    </div>
  );
};
