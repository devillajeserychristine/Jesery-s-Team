import React, { useState, useEffect } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { VoucherManager } from './VoucherManager';
import { ActiveSessionsMonitor } from './ActiveSessionsMonitor';
import { StudentRegistry } from './StudentRegistry';
import { NetworkPolicies } from './NetworkPolicies';
import { AuditLogs } from './AuditLogs';
import {
  Layers,
  Ticket,
  Activity,
  GraduationCap,
  Sliders,
  FileText,
  LogOut,
  Users,
  HardDriveDownload,
  Wifi,
  Zap,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Radio,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    logoutAdmin,
    setViewMode,
    stats,
    activeSessions,
    vouchers,
    auditLogs,
  } = useHotspot();

  // Bandwidth history points for SVG chart
  const [trafficHistory, setTrafficHistory] = useState<{ down: number; up: number }[]>([
    { down: 12, up: 3 },
    { down: 18, up: 5 },
    { down: 25, up: 7 },
    { down: 32, up: 8 },
    { down: 28, up: 6 },
    { down: 35, up: 10 },
    { down: 42, up: 12 },
    { down: 38, up: 9 },
    { down: 45, up: 14 },
    { down: 52, up: 15 },
  ]);

  // Push new traffic point every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const totalDownKbps = activeSessions.reduce((acc, s) => acc + s.currentDownloadSpeedKbps, 0);
      const totalUpKbps = activeSessions.reduce((acc, s) => acc + s.currentUploadSpeedKbps, 0);
      
      const downMbps = Number((totalDownKbps / 1024 + 5 + Math.random() * 8).toFixed(1));
      const upMbps = Number((totalUpKbps / 1024 + 1.5 + Math.random() * 3).toFixed(1));

      setTrafficHistory((prev) => [...prev.slice(1), { down: downMbps, up: upMbps }]);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSessions]);

  const maxTraffic = Math.max(...trafficHistory.map((t) => Math.max(t.down, t.up, 60)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Admin Subheader & Tab Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAdminTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setAdminTab('vouchers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'vouchers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Vouchers</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
              {vouchers.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('sessions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'sessions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Active Clients</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono">
              {activeSessions.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'students'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Accounts</span>
          </button>

          <button
            onClick={() => setAdminTab('policies')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'policies'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Bandwidth Policies</span>
          </button>

          <button
            onClick={() => setAdminTab('logs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              adminTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('portal')}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>View Student Portal</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 font-semibold text-xs transition flex items-center gap-1.5 border border-rose-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Active Clients */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Active Hotspot Clients
                </span>
                <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
                  <span>{stats.activeUsersCount}</span>
                  <span className="text-xs font-normal text-emerald-400">Online</span>
                </div>
                <div className="text-[11px] text-slate-400">Peak today: {stats.peakHourUsers} learners</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* 2. Total Data Used */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Bandwidth Transferred
                </span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono flex items-baseline gap-1">
                  <span>{stats.totalDataTodayGB}</span>
                  <span className="text-sm font-normal text-slate-400">GB</span>
                </div>
                <div className="text-[11px] text-slate-400">Since 12:00 AM Today</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <HardDriveDownload className="w-6 h-6" />
              </div>
            </div>

            {/* 3. Vouchers Generated / Active */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Vouchers in Circulation
                </span>
                <div className="text-3xl font-extrabold text-amber-400 font-mono flex items-baseline gap-2">
                  <span>{stats.vouchersGeneratedCount}</span>
                  <span className="text-xs font-normal text-slate-400">({stats.vouchersActiveCount} In-Use)</span>
                </div>
                <div className="text-[11px] text-slate-400">Ready for student distribution</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
                <Ticket className="w-6 h-6" />
              </div>
            </div>

            {/* 4. Network Utilization */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  WAN Uplink Utilization
                </span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {stats.networkUtilizationPercent}%
                </div>
                <div className="text-[11px] text-slate-400">DepEd 100Mbps Dedicated Line</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Real-time Bandwidth Throughput Multi-Line SVG Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Real-Time Hotspot Throughput (WAN Traffic)</h3>
                  <p className="text-xs text-slate-400">Live download and upload packet stream sampled every 3 seconds</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Download: {trafficHistory[trafficHistory.length - 1]?.down} Mbps
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Upload: {trafficHistory[trafficHistory.length - 1]?.up} Mbps
                </span>
              </div>
            </div>

            {/* SVG Wave Graph */}
            <div className="h-44 w-full relative bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                {/* Download area & line */}
                <path
                  d={`M 0,${120 - (trafficHistory[0].down / maxTraffic) * 100} ${trafficHistory
                    .map((t, idx) => `L ${(idx / (trafficHistory.length - 1)) * 500},${120 - (t.down / maxTraffic) * 100}`)
                    .join(' ')} L 500,120 L 0,120 Z`}
                  fill="url(#downGrad)"
                />
                <path
                  d={`M 0,${120 - (trafficHistory[0].down / maxTraffic) * 100} ${trafficHistory
                    .map((t, idx) => `L ${(idx / (trafficHistory.length - 1)) * 500},${120 - (t.down / maxTraffic) * 100}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Upload area & line */}
                <path
                  d={`M 0,${120 - (trafficHistory[0].up / maxTraffic) * 100} ${trafficHistory
                    .map((t, idx) => `L ${(idx / (trafficHistory.length - 1)) * 500},${120 - (t.up / maxTraffic) * 100}`)
                    .join(' ')} L 500,120 L 0,120 Z`}
                  fill="url(#upGrad)"
                />
                <path
                  d={`M 0,${120 - (trafficHistory[0].up / maxTraffic) * 100} ${trafficHistory
                    .map((t, idx) => `L ${(idx / (trafficHistory.length - 1)) * 500},${120 - (t.up / maxTraffic) * 100}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Grid: Quick Active Sessions glance & Recent Events */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Active Sessions Table (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Active Hotspot Clients</span>
                </h3>
                <button
                  onClick={() => setAdminTab('sessions')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Manage All ({activeSessions.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {activeSessions.slice(0, 4).map((sess) => (
                  <div
                    key={sess.sessionId}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{sess.userDisplayName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {sess.ipAddress} • {sess.connectedAp.split(' ')[0]}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-emerald-400 font-semibold">
                        {(sess.currentDownloadSpeedKbps / 1024).toFixed(2)} Mbps
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.floor(sess.remainingSeconds / 60)}m left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Events (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Recent Security Events</span>
                </h3>
                <button
                  onClick={() => setAdminTab('logs')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>View All Logs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-emerald-400 font-bold">{log.eventType}</span>
                      <span className="text-slate-500 font-mono">{log.timestamp.split(' ')[0]}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] line-clamp-1">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'vouchers' && <VoucherManager />}
      {adminTab === 'sessions' && <ActiveSessionsMonitor />}
      {adminTab === 'students' && <StudentRegistry />}
      {adminTab === 'policies' && <NetworkPolicies />}
      {adminTab === 'logs' && <AuditLogs />}
    </div>
  );
};
