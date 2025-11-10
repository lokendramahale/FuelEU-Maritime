import { useState } from 'react'
import RoutesTab from './adapters/ui/components/RoutesTab'
import CompareTab from './adapters/ui/components/CompareTab'
import BankingTab from './adapters/ui/components/BankingTab'
import PoolingTab from './adapters/ui/components/PoolingTab'
import UICard from './adapters/ui/components/UICard'

const TABS = ['Routes','Compare','Banking','Pooling'] as const

function App(){
  const [tab, setTab] = useState<typeof TABS[number]>('Routes')
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4">
        <header className="app-header">
          <div>
            <div className="app-title">Fuel EU Compliance Dashboard</div>
            <div className="app-subtitle">Monitor routes, compare intensities, and manage banking & pooling</div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-gray-600">Environment: dev</div>
            <div className="text-xs text-gray-500">API: {((import.meta as any).env?.VITE_API_BASE) ?? 'http://localhost:4000'}</div>
          </div>
        </header>

        <nav className="tabs mb-4">
          {TABS.map(t=> (
            <button key={t} aria-pressed={t===tab ? 'true' : 'false'} className={`tab-btn ${t===tab ? 'tab-btn-active' : 'bg-white'}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </nav>

        <main>
          <UICard>
            {tab === 'Routes' && <RoutesTab />}
            {tab === 'Compare' && <CompareTab />}
            {tab === 'Banking' && <BankingTab />}
            {tab === 'Pooling' && <PoolingTab />}
          </UICard>
        </main>
      </div>
    </div>
  )
}

export default App
