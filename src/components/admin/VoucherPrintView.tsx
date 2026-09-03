import React, { useEffect, useState } from 'react';
import { Voucher } from '../../types';
import { Printer, X, Download, School, QrCode, Wifi, Clock, HardDriveDownload } from 'lucide-react';
import QRCode from 'qrcode';

interface VoucherPrintViewProps {
  vouchers: Voucher[];
  onClose: () => void;
}

export const VoucherPrintView: React.FC<VoucherPrintViewProps> = ({ vouchers, onClose }) => {
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate QR data URLs for each voucher
    const generateQRs = async () => {
      const map: Record<string, string> = {};
      for (const v of vouchers) {
        try {
          const url = await QRCode.toDataURL(v.code, {
            margin: 1,
            width: 120,
            color: {
              dark: '#064e3b',
              light: '#ffffff',
            },
          });
          map[v.id] = url;
        } catch (e) {
          console.error(e);
        }
      }
      setQrMap(map);
    };

    generateQRs();
  }, [vouchers]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Non-printable Control Toolbar */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-2xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-800 text-emerald-300">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Printable Voucher Sheet ({vouchers.length} Tickets)</h3>
            <p className="text-xs text-slate-400">Formatted for 2-column or 3-column thermal / card stock paper</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Vouchers Now</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="w-full max-w-5xl bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl print:p-0 print:shadow-none print:max-w-none print:w-full print:rounded-none">
        {/* Printable School Header */}
        <div className="text-center pb-6 border-b-2 border-emerald-800 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <School className="w-8 h-8 text-emerald-800" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-emerald-950">
                Annafunan Integrated School
              </h2>
              <p className="text-xs text-emerald-800 font-semibold">
                Department of Education • SDO Tuguegarao City • Region II
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 tracking-wider uppercase">
            Official Campus Wi-Fi Internet Study Vouchers • Hotspot Gateway
          </div>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
          {vouchers.map((v) => {
            const qrUrl = qrMap[v.id];
            return (
              <div
                key={v.id}
                className="border-2 border-dashed border-emerald-800/60 rounded-xl p-4 bg-emerald-50/40 relative overflow-hidden flex flex-col justify-between break-inside-avoid print:bg-white"
              >
                {/* Header of ticket */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-emerald-800/20">
                  <div>
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block">
                      Annafunan IS Hotspot
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                      {v.planName}
                    </h4>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-800 text-white uppercase">
                    {Math.round(v.durationMinutes / 60)}H Pass
                  </span>
                </div>

                {/* Body: PIN & QR Code */}
                <div className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      Voucher Code / PIN:
                    </span>
                    <div className="text-lg sm:text-xl font-black font-mono tracking-widest text-emerald-900 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-sm inline-block">
                      {v.code}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium pt-1 space-y-0.5">
                      <div>⏳ <strong>Duration:</strong> {v.durationMinutes} mins</div>
                      <div>📊 <strong>Quota:</strong> {v.dataLimitMB > 0 ? `${v.dataLimitMB} MB` : 'Unlimited'}</div>
                      <div>⚡ <strong>Speed:</strong> {v.downloadSpeedMbps} Mbps</div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex-shrink-0 text-center">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={`QR for ${v.code}`}
                        className="w-20 h-20 rounded border border-emerald-300 p-0.5 bg-white shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                        <QrCode className="w-8 h-8" />
                      </div>
                    )}
                    <span className="text-[8px] text-slate-500 uppercase block mt-0.5 font-bold">
                      Scan to Login
                    </span>
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="pt-2 border-t border-emerald-800/20 text-[9px] text-slate-600 leading-tight flex justify-between items-center">
                  <span>Connect to: <strong>AIS_Campus_WiFi</strong></span>
                  <span className="text-[8px] text-emerald-800 font-semibold font-mono">
                    {v.batchId || 'BATCH-2026'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Print Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500">
          Annafunan Integrated School • ICT Laboratory & Hotspot Services • For Academic Research & Educational Purposes Only
        </div>
      </div>
    </div>
  );
};
