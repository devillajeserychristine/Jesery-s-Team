import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import {
  Wifi,
  Ticket,
  User,
  Lock,
  QrCode,
  ShieldCheck,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  School,
  FileText,
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CaptivePortalSplash: React.FC = () => {
  const {
    loginWithVoucher,
    loginWithStudentAccount,
    networkPolicy,
    setViewMode,
  } = useHotspot();

  const [authMethod, setAuthMethod] = useState<'voucher' | 'student'>('voucher');

  // Voucher Form State
  const [voucherCode, setVoucherCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Student Account Form State
  const [lrnOrEmail, setLrnOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Terms Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);

  // QR Scanner Simulation Modal
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Quick Preset Handlers
  const handlePresetVoucher = (code: string) => {
    setVoucherCode(code);
    setVoucherError(null);
  };

  const handlePresetStudent = (lrn: string) => {
    setLrnOrEmail(lrn);
    setPassword('password123');
    setAccountError(null);
  };

  // Submit Voucher
  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);

    if (!agreeTerms) {
      setVoucherError('Please accept the Annafunan IS Acceptable Use Policy to proceed.');
      return;
    }

    if (!voucherCode.trim()) {
      setVoucherError('Please enter a valid voucher code from your ticket.');
      return;
    }

    const result = loginWithVoucher(voucherCode, guestName);
    if (result.success) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setVoucherError(result.error || 'Failed to authenticate voucher.');
    }
  };

  // Submit Student
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);

    if (!agreeTerms) {
      setAccountError('Please accept the Annafunan IS Acceptable Use Policy to proceed.');
      return;
    }

    if (!lrnOrEmail.trim()) {
      setAccountError('Please enter your 12-digit Learner Reference Number (LRN) or Faculty ID.');
      return;
    }

    if (!password) {
      setAccountError('Please enter your password.');
      return;
    }

    const result = loginWithStudentAccount(lrnOrEmail, password);
    if (result.success) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setAccountError(result.error || 'Failed to sign in.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700/80 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative crest watermark */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <School className="w-80 h-80 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-emerald-200 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>DepEd SDO Tuguegarao City • Annafunan Integrated School</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Campus Wi-Fi Hotspot Gateway
          </h2>

          <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            Welcome to the official high-speed digital research and learning network of Annafunan Integrated School. Sign in with your school-issued voucher or student account to start browsing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              DepEd Commons Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Content-Filtered & Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Dual-Band 5GHz/2.4GHz
            </span>
          </div>
        </div>
      </div>

      {/* Main Authentication & Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
          {/* Dual Tab Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => {
                setAuthMethod('voucher');
                setVoucherError(null);
                setAccountError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                authMethod === 'voucher'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Voucher Code</span>
            </button>

            <button
              onClick={() => {
                setAuthMethod('student');
                setVoucherError(null);
                setAccountError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                authMethod === 'student'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student / LRN Login</span>
            </button>
          </div>

          {/* Tab 1: Voucher Code Authentication */}
          {authMethod === 'voucher' && (
            <form onSubmit={handleVoucherSubmit} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Voucher PIN / Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan Ticket QR</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AIS-FREE-2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-center text-lg sm:text-xl font-mono font-bold tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase transition"
                    autoFocus
                  />
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Name or Device Label (Optional)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Maria Santos / ComLab Station 05"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Sample Voucher Quick Fill Chips */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Click to auto-fill sample test vouchers:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetVoucher('AIS-FREE-2026')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-300 border border-slate-700 transition"
                  >
                    AIS-FREE-2026 (1-Hr Pass)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetVoucher('AIS-STEM-4421')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-purple-300 border border-slate-700 transition"
                  >
                    AIS-STEM-4421 (Full Day)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetVoucher('AIS-QUIK-5532')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-blue-300 border border-slate-700 transition"
                  >
                    AIS-QUIK-5532 (1-Hr)
                  </button>
                </div>
              </div>

              {voucherError && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{voucherError}</span>
                </div>
              )}

              {/* Acceptable Use Policy Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms-voucher"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="terms-voucher" className="text-xs text-slate-300 cursor-pointer select-none">
                  I agree to the <strong className="text-emerald-400">Annafunan IS Acceptable Internet Use Policy</strong> (DepEd Order No. 40, s. 2012) and acknowledge that all network sessions are logged for academic security.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                <span>Connect with Voucher</span>
              </button>
            </form>
          )}

          {/* Tab 2: Student Account (LRN / Password) */}
          {authMethod === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Learner Reference Number (LRN) or Faculty ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lrnOrEmail}
                    onChange={(e) => setLrnOrEmail(e.target.value)}
                    placeholder="e.g. 104820120011 or EMP-2018-042"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition pl-10"
                    autoFocus
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password (Default: password123)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition pl-10 pr-10"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sample Student Accounts Quick Fill */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Click to auto-fill registered test accounts:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetStudent('104820120011')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 transition"
                  >
                    Maria Santos (Gr.10 Rizal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetStudent('104820120012')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 transition"
                  >
                    Juan Dela Cruz (Gr.12 STEM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLrnOrEmail('EMP-2018-042');
                      setPassword('faculty2026!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 transition"
                  >
                    Mr. Eduardo Ramos (Faculty)
                  </button>
                </div>
              </div>

              {accountError && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{accountError}</span>
                </div>
              )}

              {/* Acceptable Use Policy Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms-student"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="terms-student" className="text-xs text-slate-300 cursor-pointer select-none">
                  I agree to the <strong className="text-emerald-400">Annafunan IS Acceptable Internet Use Policy</strong> and agree to use campus bandwidth strictly for educational purposes.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Log In Student Account</span>
              </button>
            </form>
          )}

          {/* Admin shortcut link at bottom */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Are you a school IT administrator or faculty manager? </span>
            <button
              onClick={() => setViewMode('admin')}
              className="text-amber-400 hover:text-amber-300 font-semibold underline ml-1"
            >
              Access Admin Management Console
            </button>
          </div>
        </div>

        {/* Right Column: Gateway Diagnostics & Campus Bulletin (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Hotspot Gateway Connection Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                <Wifi className="w-4 h-4" />
                <span>Access Point Diagnostics</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Network SSID:</span>
                <span className="font-semibold text-white font-mono">{networkPolicy.campusSSID}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Hotspot Gateway:</span>
                <span className="font-mono text-emerald-400">{networkPolicy.gatewayIp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Your Device IP:</span>
                <span className="font-mono text-slate-200">192.168.88.145 (DHCP)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Signal Strength:</span>
                <span className="font-semibold text-emerald-400">-46 dBm (Excellent)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Content Filter:</span>
                <span className="text-cyan-400 font-semibold">DepEd SafeSearch Enabled</span>
              </div>
            </div>
          </div>

          {/* 2. Official Campus Announcement Bulletin */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-800/50 rounded-2xl p-6 shadow-xl text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
              <FileText className="w-4 h-4" />
              <span>Campus ICT Bulletin</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {networkPolicy.announcementNotice}
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] text-slate-400 font-medium">
                🕒 <strong>Hotspot Research Hours:</strong> 7:00 AM – 5:30 PM (Mon-Fri)
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                🎫 <strong>Need a Voucher?</strong> Request a physical study pass ticket from your ICT teacher or school library desk.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated QR Code Camera Scanner Modal */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Scan Voucher Ticket QR Code</h3>
              </div>
              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden border-2 border-emerald-500/50 flex flex-col items-center justify-center">
              <div className="w-44 h-44 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center relative">
                {/* Laser scan line animation */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce" />
                <QrCode className="w-20 h-20 text-emerald-400/40" />
              </div>
              <div className="absolute bottom-3 text-center text-xs text-slate-400">
                Align the QR code from your printed voucher inside the frame
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-300 font-semibold">Simulate scanned QR code:</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVoucherCode('AIS-FREE-2026');
                    setIsQrScannerOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-mono font-bold text-white transition"
                >
                  Scan AIS-FREE-2026
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoucherCode('AIS-LAB-8912');
                    setIsQrScannerOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-xs font-mono font-bold text-white transition"
                >
                  Scan AIS-LAB-8912
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsQrScannerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
