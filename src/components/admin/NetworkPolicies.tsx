import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import {
  Shield,
  Wifi,
  Sliders,
  CheckCircle2,
  Lock,
  Save,
  Globe,
  Radio,
  Server,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const NetworkPolicies: React.FC = () => {
  const { networkPolicy, updatePolicy, resetToDefaults } = useHotspot();

  const [formData, setFormData] = useState(networkPolicy);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof typeof networkPolicy, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePolicy(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Network Policy & Bandwidth QoS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure traffic rate limiting, content filters, and captive portal parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefaults}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Bandwidth QoS & Speed Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Bandwidth Allocation & QoS Tiers</h3>
                <p className="text-xs text-slate-400">Set maximum bandwidth speeds per client profile</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              Traffic Shaper Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Student Tier */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="font-bold text-sm text-cyan-400 flex items-center justify-between">
                <span>Student / Voucher Profile</span>
                <span className="text-[10px] text-slate-500">Standard Priority</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Max Download Limit (Mbps): <strong className="text-emerald-400">{formData.defaultStudentDownloadMbps} Mbps</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={formData.defaultStudentDownloadMbps}
                  onChange={(e) => handleChange('defaultStudentDownloadMbps', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Max Upload Limit (Mbps): <strong className="text-amber-400">{formData.defaultStudentUploadMbps} Mbps</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={formData.defaultStudentUploadMbps}
                  onChange={(e) => handleChange('defaultStudentUploadMbps', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Faculty Tier */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="font-bold text-sm text-amber-400 flex items-center justify-between">
                <span>Faculty & Administration Profile</span>
                <span className="text-[10px] text-amber-400/80">High Priority QoS</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Max Download Limit (Mbps): <strong className="text-emerald-400">{formData.facultyDownloadMbps} Mbps</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={formData.facultyDownloadMbps}
                  onChange={(e) => handleChange('facultyDownloadMbps', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Max Upload Limit (Mbps): <strong className="text-amber-400">{formData.facultyUploadMbps} Mbps</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={formData.facultyUploadMbps}
                  onChange={(e) => handleChange('facultyUploadMbps', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Content & Security Filtering (DepEd Compliance) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Educational Content Filtering & Protection</h3>
              <p className="text-xs text-slate-400">Enforce child protection and academic bandwidth reservation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Gaming */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-200">Block Online Gaming</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Restricts Steam, Roblox, Mobile Legends, and gaming ports during school hours.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.blockGamingSites}
                onChange={(e) => handleChange('blockGamingSites', e.target.checked)}
                className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* P2P / Torrent */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-200">Block P2P & Torrenting</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prevents BitTorrent packets from saturating campus WAN uplink.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.blockP2PTorrenting}
                onChange={(e) => handleChange('blockP2PTorrenting', e.target.checked)}
                className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Social Media during class */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-200">Restrict Social Media</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Throttles video streams on TikTok, Instagram, and Facebook during lecture hours.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.blockSocialMediaDuringClass}
                onChange={(e) => handleChange('blockSocialMediaDuringClass', e.target.checked)}
                className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Captive Portal Splash & Gateway Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Captive Portal Banner & Identity</h3>
              <p className="text-xs text-slate-400">Configure parameters shown on student login screen</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Campus SSID Name</label>
              <input
                type="text"
                value={formData.campusSSID}
                onChange={(e) => handleChange('campusSSID', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Gateway Host IP</label>
              <input
                type="text"
                value={formData.gatewayIp}
                onChange={(e) => handleChange('gatewayIp', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Campus ICT Bulletin Announcement Notice
              </label>
              <textarea
                rows={3}
                value={formData.announcementNotice}
                onChange={(e) => handleChange('announcementNotice', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Policy changes deployed successfully to hotspot gateway!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Changes take effect immediately on next DHCP handshake.
            </div>
          )}

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Network Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
