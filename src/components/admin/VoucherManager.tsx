import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { Voucher } from '../../types';
import { VoucherPrintView } from './VoucherPrintView';
import {
  Ticket,
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDriveDownload,
  Trash2,
  Ban,
  RotateCcw,
  Download,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoucherManager: React.FC = () => {
  const {
    vouchers,
    plans,
    generateVouchers,
    revokeVoucher,
    deleteVoucher,
    extendVoucherTimeAndData,
  } = useHotspot();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unused' | 'active' | 'expired' | 'revoked'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genPlanId, setGenPlanId] = useState(plans[0]?.id || 'plan-1hr');
  const [genCount, setGenCount] = useState<number>(10);
  const [genPrefix, setGenPrefix] = useState('AIS');
  const [genNotes, setGenNotes] = useState('');

  // Print Preview Modal State
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [selectedVouchersForPrint, setSelectedVouchersForPrint] = useState<Voucher[]>([]);

  // Extend Modal State
  const [extendingVoucher, setExtendingVoucher] = useState<Voucher | null>(null);
  const [extraMinutes, setExtraMinutes] = useState(60);
  const [extraMB, setExtraMB] = useState(500);

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.usedBy && v.usedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesPlan = planFilter === 'all' || v.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = generateVouchers({
      planId: genPlanId,
      count: genCount,
      prefix: genPrefix,
      notes: genNotes,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setIsGeneratorOpen(false);
    setSelectedVouchersForPrint(created);
    setIsPrintOpen(true);
  };

  const handleExtendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendingVoucher) return;
    extendVoucherTimeAndData(extendingVoucher.id, Number(extraMinutes), Number(extraMB));
    setExtendingVoucher(null);
  };

  const handlePrintAllFiltered = () => {
    setSelectedVouchersForPrint(filteredVouchers.length > 0 ? filteredVouchers : vouchers);
    setIsPrintOpen(true);
  };

  const handlePrintSingle = (v: Voucher) => {
    setSelectedVouchersForPrint([v]);
    setIsPrintOpen(true);
  };

  const exportCSV = () => {
    const headers = ['Code', 'Plan', 'Duration(mins)', 'DataLimit(MB)', 'Status', 'DataUsed(MB)', 'UsedBy', 'CreatedAt'];
    const rows = filteredVouchers.map((v) => [
      v.code,
      `"${v.planName}"`,
      v.durationMinutes,
      v.dataLimitMB,
      v.status,
      v.dataUsedMB || 0,
      `"${v.usedBy || 'N/A'}"`,
      `"${v.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AIS_Vouchers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <span>Campus Voucher Inventory</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate, distribute, monitor, and print hotspot tickets for learners and guests
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 md:flex-none py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintAllFiltered}
            className="flex-1 md:flex-none py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Current List ({filteredVouchers.length})</span>
          </button>

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Vouchers</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code, student, plan..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Statuses ({vouchers.length})</option>
            <option value="unused">Unused ({vouchers.filter((v) => v.status === 'unused').length})</option>
            <option value="active">Active / In-Use ({vouchers.filter((v) => v.status === 'active').length})</option>
            <option value="expired">Expired ({vouchers.filter((v) => v.status === 'expired').length})</option>
            <option value="revoked">Revoked ({vouchers.filter((v) => v.status === 'revoked').length})</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Plan Profiles</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher Code</th>
                <th className="py-3 px-4">Plan & Quota</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned / Used By</th>
                <th className="py-3 px-4">Data Consumed</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No vouchers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((v) => {
                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-emerald-400">
                        {v.code}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{v.planName}</div>
                        <div className="text-[11px] text-slate-400">
                          {Math.round(v.durationMinutes / 60)}h • {v.dataLimitMB > 0 ? `${v.dataLimitMB} MB` : 'Unlimited'} • {v.downloadSpeedMbps} Mbps
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {v.status === 'unused' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold text-[10px]">
                            UNUSED
                          </span>
                        )}
                        {v.status === 'active' && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold text-[10px] flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            ACTIVE
                          </span>
                        )}
                        {v.status === 'expired' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold text-[10px]">
                            EXPIRED
                          </span>
                        )}
                        {v.status === 'revoked' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-semibold text-[10px]">
                            REVOKED
                          </span>
                        )}
                      </td>

                      {/* Used By */}
                      <td className="py-3.5 px-4">
                        {v.usedBy ? (
                          <div>
                            <span className="font-medium text-slate-200">{v.usedBy}</span>
                            {v.macAddress && (
                              <div className="text-[10px] font-mono text-slate-500">{v.macAddress}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Data Consumed */}
                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        {v.dataUsedMB > 0 ? (
                          <span>
                            {v.dataUsedMB} MB <span className="text-slate-500 text-[10px]">({v.timeUsedMinutes || 0} mins)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">0 MB</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {v.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePrintSingle(v)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Print Ticket"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setExtendingVoucher(v)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition"
                            title="Extend Quota / Time"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {v.status !== 'revoked' && (
                            <button
                              onClick={() => revokeVoucher(v.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
                              title="Revoke Voucher"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => deleteVoucher(v.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Batch Voucher Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-900 text-emerald-300 border border-emerald-700">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Generate Hotspot Vouchers</h3>
                  <p className="text-xs text-slate-400">Create batches of PIN codes for Annafunan IS learners</p>
                </div>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-4 text-xs">
              {/* Select Plan */}
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Plan Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setGenPlanId(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        genPlanId === p.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-100">{p.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.durationMinutes} mins • {p.dataLimitMB > 0 ? `${p.dataLimitMB} MB` : 'Unlimited'}
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-2 font-semibold">
                        Speed: {p.downloadSpeedMbps} Mbps
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Prefix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Quantity to Generate
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={genCount}
                    onChange={(e) => setGenCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Code Prefix
                  </label>
                  <input
                    type="text"
                    value={genPrefix}
                    onChange={(e) => setGenPrefix(e.target.value.toUpperCase())}
                    placeholder="e.g. AIS, LAB, STEM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Batch Tag / Purpose (Optional)
                </label>
                <input
                  type="text"
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  placeholder="e.g. For Grade 10 Science Lab Activity"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/50"
                >
                  Generate {genCount} Vouchers & Print
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Voucher Modal */}
      {extendingVoucher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Extend Voucher ({extendingVoucher.code})</h3>
              <button onClick={() => setExtendingVoucher(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Additional Minutes</label>
                <input
                  type="number"
                  value={extraMinutes}
                  onChange={(e) => setExtraMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Additional Quota (MB)</label>
                <input
                  type="number"
                  value={extraMB}
                  onChange={(e) => setExtraMB(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendingVoucher(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Apply Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print View Modal */}
      {isPrintOpen && (
        <VoucherPrintView
          vouchers={selectedVouchersForPrint}
          onClose={() => setIsPrintOpen(false)}
        />
      )}
    </div>
  );
};
