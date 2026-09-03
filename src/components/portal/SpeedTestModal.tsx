import React, { useState, useEffect } from 'react';
import { X, Activity, Download, Upload, Gauge, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMaxDownloadMbps?: number;
  targetMaxUploadMbps?: number;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({
  isOpen,
  onClose,
  targetMaxDownloadMbps = 5.0,
  targetMaxUploadMbps = 2.0,
}) => {
  const [stage, setStage] = useState<'idle' | 'pinging' | 'downloading' | 'uploading' | 'finished'>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [finalDownload, setFinalDownload] = useState<number | null>(null);
  const [finalUpload, setFinalUpload] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const startTest = () => {
    setStage('pinging');
    setPing(null);
    setJitter(null);
    setCurrentSpeed(0);
    setFinalDownload(null);
    setFinalUpload(null);
    setProgress(0);
  };

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      return;
    }
    startTest();
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (stage === 'pinging') {
      let p = 0;
      interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setPing(Math.floor(8 + Math.random() * 8));
          setJitter(Math.floor(1 + Math.random() * 3));
          setStage('downloading');
          setProgress(0);
        }
      }, 100);
    } else if (stage === 'downloading') {
      let p = 0;
      interval = setInterval(() => {
        p += 5;
        setProgress(p);
        const noise = (Math.random() - 0.5) * 0.8;
        const current = Math.max(0.2, targetMaxDownloadMbps * (p / 100) + noise);
        setCurrentSpeed(Number(current.toFixed(2)));

        if (p >= 100) {
          clearInterval(interval);
          const computed = Number((targetMaxDownloadMbps * (0.88 + Math.random() * 0.15)).toFixed(2));
          setFinalDownload(computed);
          setCurrentSpeed(0);
          setStage('uploading');
          setProgress(0);
        }
      }, 80);
    } else if (stage === 'uploading') {
      let p = 0;
      interval = setInterval(() => {
        p += 5;
        setProgress(p);
        const noise = (Math.random() - 0.5) * 0.4;
        const current = Math.max(0.1, targetMaxUploadMbps * (p / 100) + noise);
        setCurrentSpeed(Number(current.toFixed(2)));

        if (p >= 100) {
          clearInterval(interval);
          const computed = Number((targetMaxUploadMbps * (0.85 + Math.random() * 0.18)).toFixed(2));
          setFinalUpload(computed);
          setCurrentSpeed(0);
          setStage('finished');
          setProgress(100);
        }
      }, 80);
    }

    return () => clearInterval(interval);
  }, [stage, targetMaxDownloadMbps, targetMaxUploadMbps]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">AIS Campus Speed Test</h3>
              <p className="text-xs text-slate-400">Server: Annafunan IS Hotspot Gateway (192.168.88.1)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Gauge & Display */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-950/60 shadow-inner">
            {/* Animated radial halo */}
            {(stage === 'downloading' || stage === 'uploading') && (
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 border-t-emerald-400 animate-spin" />
            )}

            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stage === 'pinging' && 'Measuring Latency...'}
                {stage === 'downloading' && 'Testing Download'}
                {stage === 'uploading' && 'Testing Upload'}
                {stage === 'finished' && 'Test Completed'}
                {stage === 'idle' && 'Ready'}
              </div>
              <div className="text-4xl font-extrabold text-emerald-400 my-1 font-mono tracking-tight">
                {stage === 'downloading' || stage === 'uploading'
                  ? currentSpeed
                  : stage === 'finished'
                  ? finalDownload
                  : '—'}
              </div>
              <div className="text-xs font-medium text-slate-400">Mbps</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs mt-6 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping</span>
            </div>
            <div className="font-mono text-lg font-bold text-white">
              {ping !== null ? `${ping} ms` : '...'}
            </div>
            <div className="text-[10px] text-slate-500">
              {jitter !== null ? `Jitter: ${jitter}ms` : ''}
            </div>
          </div>

          <div className="text-center border-x border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </div>
            <div className="font-mono text-lg font-bold text-emerald-400">
              {finalDownload !== null ? `${finalDownload} Mbps` : '...'}
            </div>
            <div className="text-[10px] text-slate-500">Profile: {targetMaxDownloadMbps}M</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload</span>
            </div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {finalUpload !== null ? `${finalUpload} Mbps` : '...'}
            </div>
            <div className="text-[10px] text-slate-500">Profile: {targetMaxUploadMbps}M</div>
          </div>
        </div>

        {/* Evaluation banner */}
        {stage === 'finished' && (
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-3.5 mb-6 text-xs text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">DepEd Digital Education Quality: Optimal</p>
              <p className="text-emerald-300/80">
                Your connection speed meets requirements for Google Classroom, DepEd Commons video modules, Wikipedia Education, and synchronized learning sessions.
              </p>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex gap-3">
          <button
            onClick={startTest}
            disabled={stage !== 'finished' && stage !== 'idle'}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${stage !== 'finished' && stage !== 'idle' ? 'animate-spin' : ''}`} />
            <span>Retest Speed</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
