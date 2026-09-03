import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { ActiveSession } from '../../types';
import {
  Activity,
  UserX,
  Gauge,
  Gift,
  Search,
  Wifi,
  Clock,
  HardDriveDownload,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Laptop,
  Radio,
  Zap,
  Info
} from 'lucide-react';

export const ActiveSessionsMonitor: React.FC = () => {
  const {
    activeSessions,
    kickSession,
    toggleThrottleSession,
    grantBonusSession,
  } = useHotspot();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessionForInfo, setSelectedSessionForInfo] = useState<ActiveSession | null>(null);
  const [bonusModalSession, setBonusModalSession] = useState<ActiveSession | null>(null);
  const [bonusMinutes, setBonusMinutes] = useState(30);
  const [bonusMB, setBonusMB] = useState(500);

  const filteredSessions = activeSessions.filter((s) => {
    return (
      s.userDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ipAddress.includes(searchTerm) ||
      s.macAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatRemainingTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleBonusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusModalSession) return;
    grantBonusSession(bonusModalSession.sessionId, Number(bonusMinutes), Number(bonusMB));
    setBonusModalSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Active Sessions ({activeSessions.length})</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Live telemetry of all connected learners, faculty, and voucher devices in Annafunan IS
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP, MAC, Student, Voucher..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Active Clients Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Client / Device</th>
                <th className="py-3 px-4">Network Info</th>
                <th className="py-3 px-4">Remaining Time</th>
                <th className="py-3 px-4">Data Usage</th>
                <th className="py-3 px-4">Live Speed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Hotspot Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No active sessions currently online.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((sess) => {
                  const totalUsed = Number((sess.downloadedMB + sess.uploadedMB).toFixed(1));
                  return (
                    <tr key={sess.sessionId} className="hover:bg-slate-800/40 transition">
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{sess.userDisplayName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: {sess.identifier} • {sess.planName}
                        </div>
                      </td>

                      {/* IP & MAC */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-emerald-400 font-semibold">{sess.ipAddress}</div>
                        <div className="text-slate-500">{sess.macAddress}</div>
                        <div className="text-[10px] text-slate-400">{sess.connectedAp}</div>
                      </td>

                      {/* Remaining Time */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{formatRemainingTime(sess.remainingSeconds)}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Since {sess.connectedAt.split(' ')[1] || sess.connectedAt}
                        </div>
                      </td>

                      {/* Data Usage */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold font-mono text-white">
                          {totalUsed} MB {sess.totalDataLimitMB > 0 ? `/ ${sess.totalDataLimitMB} MB` : ''}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ↓ {sess.downloadedMB} MB • ↑ {sess.uploadedMB} MB
                        </div>
                      </td>

                      {/* Live Speed */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>{(sess.currentDownloadSpeedKbps / 1024).toFixed(2)} Mbps</span>
                        </div>
                        <div className="text-[10px] text-amber-400">
                          ↑ {(sess.currentUploadSpeedKbps / 1024).toFixed(2)} Mbps
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {sess.isPaused ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-semibold">
                            PAUSED
                          </span>
                        ) : sess.isThrottled ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-semibold">
                            THROTTLED (512K)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                            OPTIMAL
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Bonus button */}
                          <button
                            onClick={() => setBonusModalSession(sess)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 hover:text-emerald-300 transition"
                            title="Grant Bonus Time/Bandwidth"
                          >
                            <Gift className="w-3.5 h-3.5" />
                          </button>

                          {/* Throttle button */}
                          <button
                            onClick={() => toggleThrottleSession(sess.sessionId)}
                            className={`p-1.5 rounded-lg transition ${
                              sess.isThrottled
                                ? 'bg-rose-900/80 text-rose-200 hover:bg-rose-800'
                                : 'bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-300'
                            }`}
                            title={sess.isThrottled ? 'Restore normal speed' : 'Throttle to 512Kbps'}
                          >
                            <Gauge className="w-3.5 h-3.5" />
                          </button>

                          {/* Kick / Disconnect */}
                          <button
                            onClick={() => kickSession(sess.sessionId)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition"
                            title="Forcefully Disconnect (Kick)"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>

                          {/* Info */}
                          <button
                            onClick={() => setSelectedSessionForInfo(sess)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Inspect Session Details"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Bonus Time / Data Modal */}
      {bonusModalSession && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Grant Bonus Bandwidth</h3>
              </div>
              <button onClick={() => setBonusModalSession(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Add bonus time and download quota directly to <strong>{bonusModalSession.userDisplayName}</strong>.
            </p>

            <form onSubmit={handleBonusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bonus Minutes (+)</label>
                <input
                  type="number"
                  value={bonusMinutes}
                  onChange={(e) => setBonusMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bonus Quota MB (+)</label>
                <input
                  type="number"
                  value={bonusMB}
                  onChange={(e) => setBonusMB(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-cyan-400 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBonusModalSession(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Grant Bonus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Inspector Modal */}
      {selectedSessionForInfo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Client Session Diagnostics</h3>
              <button onClick={() => setSelectedSessionForInfo(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Session ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedSessionForInfo.sessionId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">User Display Name:</span>
                <span className="font-semibold text-white">{selectedSessionForInfo.userDisplayName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Identifier / LRN:</span>
                <span className="font-mono text-slate-200">{selectedSessionForInfo.identifier}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Assigned IP Address:</span>
                <span className="font-mono text-slate-200">{selectedSessionForInfo.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Device Hardware MAC:</span>
                <span className="font-mono text-slate-200">{selectedSessionForInfo.macAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Connected Access Point:</span>
                <span className="text-slate-200">{selectedSessionForInfo.connectedAp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Device Signature:</span>
                <span className="text-slate-300">{selectedSessionForInfo.deviceInfo}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">QoS Profile Speed Limit:</span>
                <span className="font-mono text-emerald-400">{selectedSessionForInfo.maxDownloadMbps} Mbps Down / {selectedSessionForInfo.maxUploadMbps} Mbps Up</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Connected Since:</span>
                <span className="text-slate-300">{selectedSessionForInfo.connectedAt}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSessionForInfo(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
