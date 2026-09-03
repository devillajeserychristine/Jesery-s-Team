import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import {
  FileText,
  Search,
  Download,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Filter
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useHotspot();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'EventType', 'Severity', 'UserIdentifier', 'IPAddress', 'Message'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      l.eventType,
      l.severity,
      `"${l.userIdentifier}"`,
      l.ipAddress,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AIS_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Hotspot Security & Access Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time logs of student logins, voucher activations, security alerts, and administrative events
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={clearAuditLogs}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event, message, IP, LRN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as any)}
          className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Severities ({auditLogs.length})</option>
          <option value="success">Success Events</option>
          <option value="info">Info Events</option>
          <option value="warning">Warnings / Expirations</option>
          <option value="error">Errors & Failed Attempts</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Message / Description</th>
                <th className="py-3 px-4">User / Identifier</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No log events recorded matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-400">
                      {l.timestamp}
                    </td>

                    {/* Event Type */}
                    <td className="py-3 px-4 font-bold text-slate-200">
                      {l.eventType}
                    </td>

                    {/* Message */}
                    <td className="py-3 px-4 font-sans text-xs text-slate-200 max-w-md">
                      {l.message}
                    </td>

                    {/* User */}
                    <td className="py-3 px-4 text-emerald-400">
                      {l.userIdentifier}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-4 text-slate-400">
                      {l.ipAddress}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 font-sans">
                      {l.severity === 'success' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                          SUCCESS
                        </span>
                      )}
                      {l.severity === 'info' && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-semibold">
                          INFO
                        </span>
                      )}
                      {l.severity === 'warning' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-semibold">
                          WARNING
                        </span>
                      )}
                      {l.severity === 'error' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-semibold">
                          ERROR
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
