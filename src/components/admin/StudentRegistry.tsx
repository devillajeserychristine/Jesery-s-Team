import React, { useState } from 'react';
import { useHotspot } from '../../context/HotspotContext';
import { StudentAccount } from '../../types';
import {
  User,
  Plus,
  Search,
  KeyRound,
  Shield,
  Ban,
  CheckCircle2,
  Edit2,
  Trash2,
  GraduationCap,
  Clock,
  HardDriveDownload,
  AlertCircle
} from 'lucide-react';

export const StudentRegistry: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useHotspot();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty'>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);

  // Form State
  const [lrn, setLrn] = useState('');
  const [fullName, setFullName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');
  const [section, setSection] = useState('Rizal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [dailyFreeMinutes, setDailyFreeMinutes] = useState(120);
  const [dailyFreeDataMB, setDailyFreeDataMB] = useState(1000);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setLrn(Math.floor(100000000000 + Math.random() * 900000000000).toString());
    setFullName('');
    setGradeLevel('Grade 10');
    setSection('Rizal');
    setEmail('');
    setPassword('password123');
    setRole('student');
    setDailyFreeMinutes(120);
    setDailyFreeDataMB(1000);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (s: StudentAccount) => {
    setEditingStudent(s);
    setLrn(s.lrn);
    setFullName(s.fullName);
    setGradeLevel(s.gradeLevel);
    setSection(s.section);
    setEmail(s.email || '');
    setPassword(s.password || 'password123');
    setRole(s.role);
    setDailyFreeMinutes(s.dailyFreeMinutes);
    setDailyFreeDataMB(s.dailyFreeDataMB);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lrn || !fullName) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        lrn,
        fullName,
        gradeLevel,
        section,
        email,
        password,
        role,
        dailyFreeMinutes: Number(dailyFreeMinutes),
        dailyFreeDataMB: Number(dailyFreeDataMB),
      });
    } else {
      addStudent({
        lrn,
        fullName,
        gradeLevel,
        section,
        email,
        password,
        role,
        dailyFreeMinutes: Number(dailyFreeMinutes),
        dailyFreeDataMB: Number(dailyFreeDataMB),
        status: 'active',
      });
    }
    setIsAddModalOpen(false);
  };

  const toggleStatus = (s: StudentAccount) => {
    const next = s.status === 'active' ? 'suspended' : 'active';
    updateStudent(s.id, { status: next });
  };

  const resetStudentPassword = (s: StudentAccount) => {
    updateStudent(s.id, { password: 'password123' });
    alert(`Password for ${s.fullName} has been reset to "password123"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Student & Faculty Registry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage Learner Reference Numbers (LRN), daily allowances, and credential access
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Account</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search LRN, student name, grade, section..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Roles ({students.length})</option>
          <option value="student">Students ({students.filter((s) => s.role === 'student').length})</option>
          <option value="faculty">Faculty ({students.filter((s) => s.role === 'faculty').length})</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">LRN / ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Grade & Section</th>
                <th className="py-3 px-4">Daily Allowance</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No learners or faculty accounts found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    {/* LRN */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {s.lrn}
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{s.fullName}</span>
                        {s.role === 'faculty' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            TEACHER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{s.email || 'No email provided'}</div>
                    </td>

                    {/* Grade & Section */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">{s.gradeLevel}</span>
                      <span className="text-slate-400 text-[11px]"> - {s.section}</span>
                    </td>

                    {/* Daily Allowance */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>{s.dailyFreeMinutes} mins / day</div>
                      <div className="text-cyan-400">{s.dailyFreeDataMB} MB cap</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {s.status === 'active' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-semibold">
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {s.lastLogin || 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => resetStudentPassword(s)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition"
                          title="Reset Password to password123"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Edit Account"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleStatus(s)}
                          className={`p-1.5 rounded-lg transition ${
                            s.status === 'active'
                              ? 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400'
                              : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
                          }`}
                          title={s.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {editingStudent ? 'Edit Account' : 'Register New Learner / Faculty'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    LRN / Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="12-digit LRN"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  >
                    <option value="student">Student Learner</option>
                    <option value="faculty">Faculty / Teacher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maria Christine Santos"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="e.g. Grade 10, Grade 12"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Section / Strand
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. Rizal, STEM-Einstein"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Daily Free Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={dailyFreeMinutes}
                    onChange={(e) => setDailyFreeMinutes(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Daily Data Quota (MB)
                  </label>
                  <input
                    type="number"
                    value={dailyFreeDataMB}
                    onChange={(e) => setDailyFreeDataMB(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-300"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editingStudent ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
