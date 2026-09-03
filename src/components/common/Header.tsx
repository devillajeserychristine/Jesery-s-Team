import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import {
  Wifi,
  Shield,
  UserCheck,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  LogOut,
  Radio,
  CheckCircle2,
  Clock,
  HardDriveDownload,
  School
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    adminTab,
    setAdminTab,
    currentSession,
    isAdminAuthenticated,
    logoutAdmin,
    disconnectCurrentSession,
    loginWithVoucher,
    loginWithStudentAccount,
    activeSessions,
    stats,
  } = useHotspot();

  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  const formatRemainingTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleQuickVoucher = (code: string) => {
    setShowPresetDropdown(false);
    setViewMode('portal');
    loginWithVoucher(code);
  };

  const handleQuickStudent = (lrn: string) => {
    setShowPresetDropdown(false);
    setViewMode('portal');
    loginWithStudentAccount(lrn, 'password123');
  };

  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-800/80 sticky top-0 z-40 shadow-md">
      {/* Top micro-bar */}
      <div className="bg-emerald-900/90 px-4 py-1 text-xs text-emerald-200 border-b border-emerald-800/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-800/80 font-medium text-emerald-100 border border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Gateway: 192.168.88.1 (Online)
          </span>
          <span className="hidden sm:inline-block text-emerald-300/80">
            SSID: <strong className="text-white">AIS_Campus_HighSpeed_WiFi</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Connected Clients: <strong className="text-white">{activeSessions.length}</strong>
          </span>
          <span className="text-emerald-300 hidden sm:inline-block">|</span>
          <span className="text-emerald-300">
            Today's Traffic: <strong className="text-white">{stats.totalDataTodayGB} GB</strong>
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* School Crest & Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('portal')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-600 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0 border border-amber-400/30">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
              <School className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Annafunan Integrated School
              </h1>
              <span className="hidden lg:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                DepEd SDO Tuguegarao
              </span>
            </div>
            <p className="text-xs text-emerald-300/90 font-medium">
              Campus Wi-Fi Hotspot & Voucher Management Gateway
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Session Badge (if student is currently logged in) */}
          {currentSession && viewMode === 'portal' && (
            <div className="flex items-center gap-2 bg-emerald-900/90 border border-emerald-700/80 rounded-lg px-3 py-1.5 shadow-inner text-xs">
              <div className="flex items-center gap-1.5 text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
                  {currentSession.userDisplayName}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-amber-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{formatRemainingTime(currentSession.remainingSeconds)}</span>
              </div>
              <button
                onClick={disconnectCurrentSession}
                className="text-red-300 hover:text-red-100 hover:bg-red-900/50 p-1 rounded transition"
                title="Disconnect from Hotspot"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Demo Test Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
              title="Quickly test with demo credentials or vouchers"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Test Demo</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showPresetDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 text-xs text-slate-200">
                <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800 mb-2">
                  Instant Test Shortcuts
                </div>
                
                <div className="space-y-1 mb-2">
                  <div className="text-[11px] text-amber-400 font-medium">🎟️ Voucher Codes</div>
                  <button
                    onClick={() => handleQuickVoucher('AIS-FREE-2026')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
                  >
                    <span>AIS-FREE-2026</span>
                    <span className="text-[10px] text-emerald-400">1 Hr (500MB)</span>
                  </button>
                  <button
                    onClick={() => handleQuickVoucher('AIS-STEM-4421')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
                  >
                    <span>AIS-STEM-4421</span>
                    <span className="text-[10px] text-purple-400">Full Day (3GB)</span>
                  </button>
                </div>

                <div className="space-y-1 mb-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-cyan-400 font-medium">🎓 Student Accounts (LRN)</div>
                  <button
                    onClick={() => handleQuickStudent('104820120011')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
                  >
                    <span>Maria Santos (Gr. 10)</span>
                    <span className="text-[10px] text-slate-400">104820120011</span>
                  </button>
                  <button
                    onClick={() => handleQuickStudent('EMP-2018-042')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
                  >
                    <span>Mr. Eduardo Ramos (Faculty)</span>
                    <span className="text-[10px] text-amber-400">EMP-2018-042</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowPresetDropdown(false);
                      setViewMode('admin');
                    }}
                    className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium text-center transition flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Go to Admin Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mode Switcher: Student Portal vs Admin Console */}
          <div className="flex bg-emerald-900/80 p-0.5 rounded-lg border border-emerald-700">
            <button
              onClick={() => setViewMode('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'portal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
              {isAdminAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
