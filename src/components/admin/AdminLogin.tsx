import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { Shield, Lock, User, AlertCircle, ArrowLeft, KeyRound, Sparkles, School } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setViewMode } = useHotspot();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = loginAdmin(username, password);
    if (!success) {
      setError('Invalid administrator credentials. (Default demo pass: "aisadmin2026" or "admin")');
    }
  };

  const handleQuickAdminDemo = () => {
    setUsername('admin');
    setPassword('aisadmin2026');
    loginAdmin('admin', 'aisadmin2026');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white space-y-6">
        {/* Header with shield */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-600 p-0.5 mx-auto shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AIS Hotspot Administrator
          </h2>
          <p className="text-xs text-slate-400">
            Annafunan Integrated School • Network & Voucher Console
          </p>
        </div>

        {/* Quick 1-click Demo Admin Login button */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Fast test login without typing:</span>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminDemo}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
          >
            1-Click Demo Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or aisadmin"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition pl-10"
                autoFocus
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (e.g. aisadmin2026)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition pl-10"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Management Console</span>
          </button>
        </form>

        {/* Back to Student Portal */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setViewMode('portal')}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Student Wi-Fi Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
