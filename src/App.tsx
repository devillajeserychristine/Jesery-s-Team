import React from 'react';
import { HotspotProvider, useHotspot } from './context/HotspotContext';
import { Header } from './components/common/Header';
import { CaptivePortalSplash } from './components/portal/CaptivePortalSplash';
import { ConnectedHUD } from './components/portal/ConnectedHUD';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { School, ShieldCheck, Heart, Radio, Wifi, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { viewMode, currentSession, isAdminAuthenticated } = useHotspot();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'portal' ? (
          currentSession ? (
            <ConnectedHUD />
          ) : (
            <CaptivePortalSplash />
          )
        ) : isAdminAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin />
        )}
      </main>

      {/* Official School & DepEd Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <School className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-200">
                Annafunan Integrated School • Campus Hotspot System
              </p>
              <p className="text-[11px] text-slate-500">
                Schools Division Office of Tuguegarao City • Cagayan Valley Region (Region II)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              DepEd Child Protection Policy Compliant
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span>Gateway Version: <strong>pfSense / RADIUS 2.8</strong></span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-500">Academic Year 2025–2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HotspotProvider>
      <MainLayout />
    </HotspotProvider>
  );
}
