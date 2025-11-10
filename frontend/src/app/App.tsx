import React from "react";
import { Header } from "../adapters/ui/components/Header";
import { Tabs } from "../adapters/ui/components/Tabs";
import RoutesTab from "../adapters/ui/pages/RoutesTab";
import CompareTab from "../adapters/ui/pages/CompareTab";
import BankingTab from "../adapters/ui/pages/BankingTab";
import PoolingTab from "../adapters/ui/pages/PoolingTab";

export default function App() {
  const tabs = [
    { id: "routes", label: "Routes", component: <RoutesTab /> },
    { id: "compare", label: "Compare", component: <CompareTab /> },
    { id: "banking", label: "Banking", component: <BankingTab /> },
    { id: "pooling", label: "Pooling", component: <PoolingTab /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}
