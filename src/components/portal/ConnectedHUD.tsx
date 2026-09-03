import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { SpeedTestModal } from './SpeedTestModal';
import {
  Wifi,
  Clock,
  HardDriveDownload,
  Activity,
  LogOut,
  Pause,
  Play,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  BookOpen,
  GraduationCap,
  Sparkles,
  Server,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConnectedHUD: React.FC = () => {
  const {
    currentSession,
    disconnectCurrentSession,
    pauseResumeCurrentSession,
    topupWithVoucher,
    networkPolicy,
  } = useHotspot();

  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupCode, setTopupCode] = useState('');
  const [topupFeedback, setTopupFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!currentSession) return null;

  const totalUsedMB = Number((currentSession.downloadedMB + currentSession.uploadedMB).toFixed(2));
  const hasQuotaLimit = currentSession.totalDataLimitMB > 0;
  const quotaPercent = hasQuotaLimit
    ? Math.min(100, Math.round((totalUsedMB / currentSession.totalDataLimitMB) * 100))
    : 0;

  const formatHoursMinsSecs = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hrs: hrs.toString().padStart(2, '0'),
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0'),
    };
  };

  const timeParts = formatHoursMinsSecs(currentSession.remainingSeconds);

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupCode.trim()) return;

    const result = topupWithVoucher(topupCode);
    if (result.success) {
      setTopupFeedback({ type: 'success', message: result.message || 'Top-up applied successfully!' });
      setTopupCode('');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setShowTopupModal(false);
        setTopupFeedback(null);
      }, 2000);
    } else {
      setTopupFeedback({ type: 'error', message: result.error || 'Failed to apply voucher.' });
    }
  };

  const educationalLinks = [
    {
      title: 'DepEd Commons',
      desc: 'Official Learning Modules & MELCs',
      url: 'https://commons.deped.gov.ph',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'AIS Digital E-Library',
      desc: 'School Research Papers & References',
      url: '#',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'Google Classroom',
      desc: 'Assignments & Class Submissions',
      url: 'https://classroom.google.com',
      icon: Globe,
      color: 'from-amber-600 to-orange-700',
    },
    {
      title: 'Khan Academy',
      desc: 'Interactive STEM Lessons & Quizzes',
      url: 'https://www.khanacademy.org',
      icon: Zap,
      color: 'from-purple-600 to-pink-700',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/80 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-white">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>INTERNET ACCESS ACTIVE</span>
              <span className="text-emerald-400/60">•</span>
              <span>{currentSession.connectedAp}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentSession.userDisplayName}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
              <span>Plan: <strong className="text-amber-400">{currentSession.planName}</strong></span>
              <span>•</span>
              <span>Client IP: <strong className="text-slate-200 font-mono">{currentSession.ipAddress}</strong></span>
              <span>•</span>
              <span>MAC: <strong className="text-slate-200 font-mono">{currentSession.macAddress}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsSpeedTestOpen(true)}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition shadow-sm"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Run Speed Test</span>
            </button>

            <button
              onClick={pauseResumeCurrentSession}
              className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition shadow-sm ${
                currentSession.isPaused
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              {currentSession.isPaused ? (
                <>
                  <Play className="w-4 h-4 text-white" />
                  <span>Resume Session</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Pause Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTopupModal(true)}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Extend / Top-up</span>
            </button>

            <button
              onClick={disconnectCurrentSession}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700/60 font-semibold text-xs transition shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paused alert if paused */}
      {currentSession.isPaused && (
        <div className="bg-amber-950/80 border border-amber-600/80 text-amber-200 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>
              <strong>Session is currently PAUSED.</strong> Time countdown and background packet consumption are frozen. Click "Resume Session" when ready to continue.
            </span>
          </div>
          <button
            onClick={pauseResumeCurrentSession}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            Resume
          </button>
        </div>
      )}

      {/* Throttled Notice if throttled */}
      {currentSession.isThrottled && (
        <div className="bg-rose-950/80 border border-rose-600/80 text-rose-200 p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>
            <strong>Bandwidth Throttled:</strong> High traffic detected on your device. Download speed is temporarily limited to 512 Kbps by the AIS Network Policy.
          </span>
        </div>
      )}

      {/* Real-time Telemetry Grid: Time, Bandwidth Quota, Live Speeds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Remaining Session Time Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Remaining Session Time</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              ACTIVE
            </span>
          </div>

          <div className="py-6 flex items-center justify-center">
            <div className="flex items-baseline gap-2 font-mono">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shadow-inner">
                  {timeParts.hrs}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Hours</div>
              </div>
              <span className="text-3xl font-bold text-emerald-400 animate-pulse">:</span>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shadow-inner">
                  {timeParts.mins}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Mins</div>
              </div>
              <span className="text-3xl font-bold text-emerald-400 animate-pulse">:</span>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shadow-inner">
                  {timeParts.secs}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Secs</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-3 border-t border-slate-800">
            <span>Allocated: {Math.round(currentSession.totalDurationSeconds / 60)} Mins</span>
            <span className="text-emerald-400 font-medium">Auto-renew with voucher</span>
          </div>
        </div>

        {/* 2. Bandwidth Quota Usage Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
              <HardDriveDownload className="w-4 h-4 text-cyan-400" />
              <span>Bandwidth Data Quota</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              {hasQuotaLimit ? `${quotaPercent}% USED` : 'UNLIMITED'}
            </span>
          </div>

          <div className="py-4 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {totalUsedMB} <span className="text-sm font-normal text-slate-400">MB</span>
                </div>
                <div className="text-xs text-slate-400">Consumed This Session</div>
              </div>
              {hasQuotaLimit && (
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-300 font-mono">
                    {currentSession.totalDataLimitMB} <span className="text-xs font-normal text-slate-400">MB</span>
                  </div>
                  <div className="text-xs text-slate-400">Total Cap</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {hasQuotaLimit ? (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      quotaPercent > 85
                        ? 'bg-rose-500'
                        : quotaPercent > 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Down: {currentSession.downloadedMB} MB</span>
                  <span>Up: {currentSession.uploadedMB} MB</span>
                  <span>Rem: {Math.max(0, currentSession.totalDataLimitMB - totalUsedMB).toFixed(1)} MB</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Faculty Bandwidth Tier</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-3 border-t border-slate-800">
            <span>Fair-Use Policy Active</span>
            <span className="text-cyan-400 font-medium">QoS Priority: Standard</span>
          </div>
        </div>

        {/* 3. Live Speed & Throughput Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Real-Time Speed</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-mono">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="py-4 grid grid-cols-2 gap-3">
            {/* Download Speed */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Download</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {(currentSession.currentDownloadSpeedKbps / 1024).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">Mbps (Cap: {currentSession.maxDownloadMbps}M)</div>
            </div>

            {/* Upload Speed */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Upload</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {(currentSession.currentUploadSpeedKbps / 1024).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">Mbps (Cap: {currentSession.maxUploadMbps}M)</div>
            </div>
          </div>

          {/* Mini Live Wave Graphic */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Access Point: {currentSession.connectedAp.split(' ')[0]}</span>
            <span className="text-amber-400 font-mono">5.0 GHz / 802.11ax</span>
          </div>
        </div>
      </div>

      {/* Educational Quick Launch & DepEd Portals */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Recommended Educational Portals</span>
            </h3>
            <p className="text-xs text-slate-400">Whitelisted high-priority resources for Annafunan Integrated School learners</p>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            Zero-Rated / QoS Boosted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {educationalLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-600/50 p-4 rounded-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition flex items-center justify-between">
                    <span>{item.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Topup Voucher Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-900 text-emerald-300 border border-emerald-700">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Extend Wi-Fi Session</h3>
                  <p className="text-xs text-slate-400">Enter a new voucher code to stack time & data</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTopupModal(false);
                  setTopupFeedback(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopupSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                  Voucher Code (e.g. AIS-FREE-2026)
                </label>
                <input
                  type="text"
                  value={topupCode}
                  onChange={(e) => setTopupCode(e.target.value.toUpperCase())}
                  placeholder="AIS-XXXX-XXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
                  autoFocus
                />
              </div>

              {topupFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    topupFeedback.type === 'success'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {topupFeedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>{topupFeedback.message}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTopupModal(false);
                    setTopupFeedback(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Apply Top-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Speed Test Modal */}
      <SpeedTestModal
        isOpen={isSpeedTestOpen}
        onClose={() => setIsSpeedTestOpen(false)}
        targetMaxDownloadMbps={currentSession.maxDownloadMbps}
        targetMaxUploadMbps={currentSession.maxUploadMbps}
      />
    </div>
  );
};
