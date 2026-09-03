import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  VoucherPlan,
  Voucher,
  StudentAccount,
  ActiveSession,
  NetworkPolicy,
  AuditLog,
  HotspotStats
} from '../types';
import {
  INITIAL_PLANS,
  INITIAL_VOUCHERS,
  INITIAL_STUDENTS,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_NETWORK_POLICY,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface HotspotContextType {
  // Navigation & View
  viewMode: 'portal' | 'admin';
  setViewMode: (mode: 'portal' | 'admin') => void;
  adminTab: 'overview' | 'vouchers' | 'sessions' | 'students' | 'policies' | 'logs';
  setAdminTab: (tab: 'overview' | 'vouchers' | 'sessions' | 'students' | 'policies' | 'logs') => void;

  // Student / Portal Session State
  currentUser: { type: 'student' | 'voucher' | 'faculty'; identifier: string; name: string } | null;
  currentSession: ActiveSession | null;
  
  // Admin State
  isAdminAuthenticated: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Data Collections
  plans: VoucherPlan[];
  vouchers: Voucher[];
  students: StudentAccount[];
  activeSessions: ActiveSession[];
  networkPolicy: NetworkPolicy;
  auditLogs: AuditLog[];
  stats: HotspotStats;

  // Portal Actions
  loginWithVoucher: (code: string, customName?: string) => { success: boolean; error?: string };
  loginWithStudentAccount: (identifier: string, pass: string) => { success: boolean; error?: string };
  disconnectCurrentSession: () => void;
  pauseResumeCurrentSession: () => void;
  topupWithVoucher: (code: string) => { success: boolean; message?: string; error?: string };

  // Admin Actions
  generateVouchers: (params: { planId: string; count: number; prefix: string; notes?: string }) => Voucher[];
  revokeVoucher: (id: string) => void;
  deleteVoucher: (id: string) => void;
  extendVoucherTimeAndData: (id: string, extraMinutes: number, extraMB: number) => void;
  
  kickSession: (sessionId: string) => void;
  toggleThrottleSession: (sessionId: string) => void;
  grantBonusSession: (sessionId: string, extraMinutes: number, extraMB: number) => void;

  addStudent: (student: Omit<StudentAccount, 'id' | 'dailyMinutesUsedToday' | 'dailyDataUsedTodayMB'>) => void;
  updateStudent: (id: string, updates: Partial<StudentAccount>) => void;
  deleteStudent: (id: string) => void;

  updatePolicy: (updates: Partial<NetworkPolicy>) => void;
  addAuditLog: (entry: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
  resetToDefaults: () => void;
}

const HotspotContext = createContext<HotspotContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VOUCHERS: 'ais_hotspot_vouchers_v1',
  STUDENTS: 'ais_hotspot_students_v1',
  SESSIONS: 'ais_hotspot_sessions_v1',
  POLICY: 'ais_hotspot_policy_v1',
  LOGS: 'ais_hotspot_logs_v1',
  CURRENT_USER: 'ais_hotspot_curr_user_v1',
  CURRENT_SESSION: 'ais_hotspot_curr_sess_v1',
  ADMIN_AUTH: 'ais_hotspot_admin_auth_v1',
};

export const HotspotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'portal' | 'admin'>('portal');
  const [adminTab, setAdminTab] = useState<'overview' | 'vouchers' | 'sessions' | 'students' | 'policies' | 'logs'>('overview');

  // Load from local storage or defaults
  const [plans] = useState<VoucherPlan[]>(INITIAL_PLANS);

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
    } catch {
      return INITIAL_VOUCHERS;
    }
  });

  const [students, setStudents] = useState<StudentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SESSIONS;
    } catch {
      return INITIAL_ACTIVE_SESSIONS;
    }
  });

  const [networkPolicy, setNetworkPolicy] = useState<NetworkPolicy>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POLICY);
      return saved ? JSON.parse(saved) : INITIAL_NETWORK_POLICY;
    } catch {
      return INITIAL_NETWORK_POLICY;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ type: 'student' | 'voucher' | 'faculty'; identifier: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentSession, setCurrentSession] = useState<ActiveSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [vouchers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(activeSessions));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [activeSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY, JSON.stringify(networkPolicy));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [networkPolicy]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      if (currentSession) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [currentSession]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [isAdminAuthenticated]);

  // Helper to add audit log
  const addAuditLog = useCallback((entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...entry,
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  }, []);

  // Real-time Bandwidth & Session Countdown Engine (Runs every 1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Update current local session if active
      if (currentSession && !currentSession.isPaused && currentSession.remainingSeconds > 0) {
        // Calculate simulated throughput
        const baseDownSpeed = currentSession.isThrottled ? 512 : currentSession.maxDownloadMbps * 1000;
        const randomFactorDown = 0.5 + Math.random() * 0.8;
        const currentDownKbps = Math.round(baseDownSpeed * randomFactorDown);
        const currentUpKbps = Math.round((currentSession.isThrottled ? 128 : currentSession.maxUploadMbps * 1000) * (0.3 + Math.random() * 0.5));

        // Increment data consumed (KB converted to MB)
        const addedDownMB = (currentDownKbps / 8) / 1024;
        const addedUpMB = (currentUpKbps / 8) / 1024;
        const newDownloaded = currentSession.downloadedMB + addedDownMB;
        const newUploaded = currentSession.uploadedMB + addedUpMB;
        const totalUsed = newDownloaded + newUploaded;

        // Check if data limit reached or time expired
        const isTimeExpired = currentSession.remainingSeconds <= 1;
        const isDataExceeded = currentSession.totalDataLimitMB > 0 && totalUsed >= currentSession.totalDataLimitMB;

        if (isTimeExpired || isDataExceeded) {
          // Session expired
          addAuditLog({
            eventType: 'SESSION_EXPIRED',
            message: `Session for ${currentSession.userDisplayName} (${currentSession.identifier}) ended due to ${isTimeExpired ? 'time expiry' : 'bandwidth quota reached'}.`,
            userIdentifier: currentSession.identifier,
            ipAddress: currentSession.ipAddress,
            severity: 'warning',
          });

          // Mark voucher or student data
          if (currentSession.userType === 'voucher_user') {
            setVouchers((prev) =>
              prev.map((v) =>
                v.code === currentSession.identifier
                  ? { ...v, status: 'expired', dataUsedMB: Math.round(totalUsed), timeUsedMinutes: Math.round(currentSession.totalDurationSeconds / 60) }
                  : v
              )
            );
          }

          // Remove from active sessions
          setActiveSessions((prev) => prev.filter((s) => s.sessionId !== currentSession.sessionId));
          setCurrentSession(null);
          setCurrentUser(null);
        } else {
          // Update current session
          const updatedSess: ActiveSession = {
            ...currentSession,
            remainingSeconds: currentSession.remainingSeconds - 1,
            downloadedMB: Number(newDownloaded.toFixed(2)),
            uploadedMB: Number(newUploaded.toFixed(2)),
            currentDownloadSpeedKbps: currentDownKbps,
            currentUploadSpeedKbps: currentUpKbps,
          };
          setCurrentSession(updatedSess);

          // Also keep in activeSessions array
          setActiveSessions((prev) =>
            prev.map((s) => (s.sessionId === updatedSess.sessionId ? updatedSess : s))
          );
        }
      }

      // 2. Animate background active sessions too
      setActiveSessions((prev) =>
        prev.map((sess) => {
          if (sess.sessionId === currentSession?.sessionId) return sess;
          if (sess.isPaused || sess.remainingSeconds <= 0) return sess;

          const baseDown = sess.isThrottled ? 450 : sess.maxDownloadMbps * 1000;
          const simDown = Math.round(baseDown * (0.4 + Math.random() * 0.7));
          const simUp = Math.round((sess.isThrottled ? 100 : sess.maxUploadMbps * 1000) * (0.2 + Math.random() * 0.5));
          const addedMB = (simDown / 8) / 1024;

          return {
            ...sess,
            remainingSeconds: Math.max(0, sess.remainingSeconds - 1),
            downloadedMB: Number((sess.downloadedMB + addedMB).toFixed(2)),
            uploadedMB: Number((sess.uploadedMB + addedMB * 0.15).toFixed(2)),
            currentDownloadSpeedKbps: simDown,
            currentUploadSpeedKbps: simUp,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, addAuditLog]);

  // Compute aggregated stats
  const stats: HotspotStats = {
    activeUsersCount: activeSessions.length,
    totalDataTodayGB: Number(
      (
        activeSessions.reduce((acc, s) => acc + s.downloadedMB + s.uploadedMB, 0) / 1024 +
        vouchers.reduce((acc, v) => acc + (v.dataUsedMB || 0), 0) / 1024 +
        3.42 // baseline today
      ).toFixed(2)
    ),
    vouchersGeneratedCount: vouchers.length,
    vouchersActiveCount: vouchers.filter((v) => v.status === 'active').length,
    networkUtilizationPercent: Math.min(
      95,
      Math.round((activeSessions.reduce((acc, s) => acc + s.currentDownloadSpeedKbps, 0) / 50000) * 100) + 12
    ),
    peakHourUsers: Math.max(activeSessions.length + 8, 24),
  };

  // 1. Voucher Login Handler
  const loginWithVoucher = (code: string, customName?: string): { success: boolean; error?: string } => {
    const cleanedCode = code.trim().toUpperCase();
    const foundVoucher = vouchers.find((v) => v.code.toUpperCase() === cleanedCode);

    if (!foundVoucher) {
      addAuditLog({
        eventType: 'LOGIN_FAILED',
        message: `Failed voucher login attempt with invalid code: "${cleanedCode}"`,
        userIdentifier: cleanedCode,
        ipAddress: '192.168.88.145',
        severity: 'error',
      });
      return { success: false, error: 'Invalid voucher code. Please check your printed voucher ticket.' };
    }

    if (foundVoucher.status === 'expired') {
      return { success: false, error: 'This voucher has already expired or reached its quota limit.' };
    }

    if (foundVoucher.status === 'revoked') {
      return { success: false, error: 'This voucher was revoked by the Annafunan IS network administrator.' };
    }

    // Activate voucher
    const nowStr = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const clientIp = '192.168.88.' + Math.floor(100 + Math.random() * 120);
    const clientMac = [
      'A4',
      'C3',
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
    ].join(':');

    const displayName = customName || foundVoucher.usedBy || `Student Guest (${foundVoucher.code})`;

    // Update voucher in list
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === foundVoucher.id
          ? {
              ...v,
              status: 'active',
              activatedAt: nowStr,
              usedBy: displayName,
              macAddress: clientMac,
            }
          : v
      )
    );

    const newSession: ActiveSession = {
      sessionId: 'SESS-' + Math.floor(1000 + Math.random() * 9000),
      identifier: foundVoucher.code,
      userDisplayName: displayName,
      userType: 'voucher_user',
      planName: foundVoucher.planName,
      ipAddress: clientIp,
      macAddress: clientMac,
      connectedAt: nowStr,
      totalDurationSeconds: foundVoucher.durationMinutes * 60,
      remainingSeconds: (foundVoucher.durationMinutes - (foundVoucher.timeUsedMinutes || 0)) * 60,
      totalDataLimitMB: foundVoucher.dataLimitMB,
      downloadedMB: foundVoucher.dataUsedMB || 0,
      uploadedMB: 0,
      currentDownloadSpeedKbps: foundVoucher.downloadSpeedMbps * 800,
      currentUploadSpeedKbps: foundVoucher.uploadSpeedMbps * 400,
      maxDownloadMbps: foundVoucher.downloadSpeedMbps,
      maxUploadMbps: foundVoucher.uploadSpeedMbps,
      isThrottled: false,
      isPaused: false,
      connectedAp: 'AP-CentralCampus-01 (5 GHz)',
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Device (Wi-Fi 6)' : 'Laptop / Workstation',
    };

    setCurrentUser({
      type: 'voucher',
      identifier: foundVoucher.code,
      name: displayName,
    });
    setCurrentSession(newSession);
    setActiveSessions((prev) => [newSession, ...prev.filter((s) => s.identifier !== foundVoucher.code)]);

    addAuditLog({
      eventType: 'VOUCHER_ACTIVATED',
      message: `Voucher ${foundVoucher.code} (${foundVoucher.planName}) activated by ${displayName}`,
      userIdentifier: foundVoucher.code,
      ipAddress: clientIp,
      severity: 'success',
    });

    return { success: true };
  };

  // 2. Student / Faculty Account Login Handler
  const loginWithStudentAccount = (identifier: string, pass: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim();
    const cleanPass = pass.trim();

    const student = students.find(
      (s) => s.lrn.toLowerCase() === cleanId.toLowerCase() || (s.email && s.email.toLowerCase() === cleanId.toLowerCase())
    );

    if (!student) {
      addAuditLog({
        eventType: 'LOGIN_FAILED',
        message: `Failed account login for nonexistent LRN/Email: "${cleanId}"`,
        userIdentifier: cleanId,
        ipAddress: '192.168.88.142',
        severity: 'error',
      });
      return { success: false, error: 'Student LRN / Faculty ID not found in Annafunan IS registry.' };
    }

    if (student.status === 'suspended') {
      return { success: false, error: 'This account has been temporarily suspended by the guidance/IT office.' };
    }

    if (student.password && student.password !== cleanPass) {
      addAuditLog({
        eventType: 'LOGIN_FAILED',
        message: `Incorrect password entered for ${student.fullName} (LRN: ${student.lrn})`,
        userIdentifier: student.lrn,
        ipAddress: '192.168.88.142',
        severity: 'error',
      });
      return { success: false, error: 'Incorrect password. Default is "password123" or your assigned PIN.' };
    }

    const nowStr = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const clientIp = '192.168.88.' + Math.floor(100 + Math.random() * 120);
    const clientMac = [
      'BC',
      '4E',
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
      Math.floor(10 + Math.random() * 89).toString(16).toUpperCase(),
    ].join(':');

    // Update last login
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, lastLogin: nowStr } : s))
    );

    const remainingMins = Math.max(10, student.dailyFreeMinutes - student.dailyMinutesUsedToday);
    const maxDown = student.role === 'faculty' ? networkPolicy.facultyDownloadMbps : networkPolicy.defaultStudentDownloadMbps;
    const maxUp = student.role === 'faculty' ? networkPolicy.facultyUploadMbps : networkPolicy.defaultStudentUploadMbps;

    const newSession: ActiveSession = {
      sessionId: 'SESS-' + Math.floor(1000 + Math.random() * 9000),
      identifier: student.lrn,
      userDisplayName: `${student.fullName} (${student.role === 'faculty' ? 'Faculty' : student.gradeLevel + ' ' + student.section})`,
      userType: student.role === 'faculty' ? 'faculty' : 'student',
      planName: student.role === 'faculty' ? 'Faculty Dedicated Line' : 'DepEd Student Daily Allotment',
      ipAddress: clientIp,
      macAddress: clientMac,
      connectedAt: nowStr,
      totalDurationSeconds: student.dailyFreeMinutes * 60,
      remainingSeconds: remainingMins * 60,
      totalDataLimitMB: student.dailyFreeDataMB,
      downloadedMB: student.dailyDataUsedTodayMB || 0,
      uploadedMB: 0,
      currentDownloadSpeedKbps: maxDown * 750,
      currentUploadSpeedKbps: maxUp * 350,
      maxDownloadMbps: maxDown,
      maxUploadMbps: maxUp,
      isThrottled: false,
      isPaused: false,
      connectedAp: 'AP-MainBuilding-02 (5 GHz)',
      deviceInfo: 'Learner Client Device',
    };

    setCurrentUser({
      type: student.role === 'faculty' ? 'faculty' : 'student',
      identifier: student.lrn,
      name: student.fullName,
    });
    setCurrentSession(newSession);
    setActiveSessions((prev) => [newSession, ...prev.filter((s) => s.identifier !== student.lrn)]);

    addAuditLog({
      eventType: 'LOGIN_SUCCESS',
      message: `${student.role === 'faculty' ? 'Faculty' : 'Student'} ${student.fullName} logged in successfully`,
      userIdentifier: student.lrn,
      ipAddress: clientIp,
      severity: 'success',
    });

    return { success: true };
  };

  // Disconnect Current Portal Session
  const disconnectCurrentSession = () => {
    if (currentSession) {
      addAuditLog({
        eventType: 'LOGIN_SUCCESS',
        message: `${currentSession.userDisplayName} disconnected manually from hotspot`,
        userIdentifier: currentSession.identifier,
        ipAddress: currentSession.ipAddress,
        severity: 'info',
      });
      setActiveSessions((prev) => prev.filter((s) => s.sessionId !== currentSession.sessionId));
    }
    setCurrentSession(null);
    setCurrentUser(null);
  };

  // Pause / Resume Session
  const pauseResumeCurrentSession = () => {
    if (!currentSession) return;
    const toggled = !currentSession.isPaused;
    const updated = { ...currentSession, isPaused: toggled };
    setCurrentSession(updated);
    setActiveSessions((prev) => prev.map((s) => (s.sessionId === currentSession.sessionId ? updated : s)));
    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Session for ${currentSession.userDisplayName} was ${toggled ? 'PAUSED' : 'RESUMED'} by user`,
      userIdentifier: currentSession.identifier,
      ipAddress: currentSession.ipAddress,
      severity: 'info',
    });
  };

  // Top-up session with new voucher
  const topupWithVoucher = (code: string): { success: boolean; message?: string; error?: string } => {
    if (!currentSession) return { success: false, error: 'No active session found to top up.' };
    const cleanedCode = code.trim().toUpperCase();
    const foundVoucher = vouchers.find((v) => v.code.toUpperCase() === cleanedCode);

    if (!foundVoucher) return { success: false, error: 'Voucher code not found.' };
    if (foundVoucher.status !== 'unused') return { success: false, error: 'This voucher has already been redeemed or expired.' };

    // Apply extra time & data
    const extraSeconds = foundVoucher.durationMinutes * 60;
    const extraMB = foundVoucher.dataLimitMB;

    const updatedSession: ActiveSession = {
      ...currentSession,
      remainingSeconds: currentSession.remainingSeconds + extraSeconds,
      totalDurationSeconds: currentSession.totalDurationSeconds + extraSeconds,
      totalDataLimitMB: currentSession.totalDataLimitMB + extraMB,
    };

    setCurrentSession(updatedSession);
    setActiveSessions((prev) => prev.map((s) => (s.sessionId === currentSession.sessionId ? updatedSession : s)));

    setVouchers((prev) =>
      prev.map((v) =>
        v.id === foundVoucher.id
          ? {
              ...v,
              status: 'active',
              usedBy: currentSession.userDisplayName + ' (Top-up)',
              activatedAt: new Date().toLocaleTimeString(),
            }
          : v
      )
    );

    addAuditLog({
      eventType: 'VOUCHER_ACTIVATED',
      message: `Session ${currentSession.sessionId} topped up with +${foundVoucher.durationMinutes} mins and +${extraMB} MB via voucher ${foundVoucher.code}`,
      userIdentifier: currentSession.identifier,
      ipAddress: currentSession.ipAddress,
      severity: 'success',
    });

    return {
      success: true,
      message: `Successfully added ${foundVoucher.durationMinutes} minutes and ${extraMB} MB to your active session!`,
    };
  };

  // Admin Auth
  const loginAdmin = (user: string, pass: string): boolean => {
    if ((user.toLowerCase() === 'admin' || user.toLowerCase() === 'aisadmin') && (pass === 'aisadmin2026' || pass === 'admin' || pass === 'admin123')) {
      setIsAdminAuthenticated(true);
      addAuditLog({
        eventType: 'ADMIN_ACTION',
        message: 'Administrator logged into Hotspot Management Console',
        userIdentifier: user,
        ipAddress: '192.168.88.2 (Admin Console)',
        severity: 'success',
      });
      return true;
    }
    addAuditLog({
      eventType: 'LOGIN_FAILED',
      message: `Failed admin login attempt with user: "${user}"`,
      userIdentifier: user,
      ipAddress: '192.168.88.2',
      severity: 'error',
    });
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: 'Administrator logged out of Hotspot Management Console',
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'info',
    });
  };

  // Batch Voucher Generator
  const generateVouchers = ({
    planId,
    count,
    prefix,
    notes,
  }: {
    planId: string;
    count: number;
    prefix: string;
    notes?: string;
  }): Voucher[] => {
    const selectedPlan = plans.find((p) => p.id === planId) || plans[0];
    const nowStr = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const batchId = 'BATCH-' + Date.now().toString().slice(-6);

    const newVouchers: Voucher[] = [];

    for (let i = 0; i < count; i++) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const randomLetters = Math.random().toString(36).substring(2, 4).toUpperCase();
      const code = `${prefix ? prefix.trim().toUpperCase() + '-' : 'AIS-'}${randomLetters}${randomDigits}`;

      newVouchers.push({
        id: 'vouch-' + Date.now() + '-' + i,
        code,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        durationMinutes: selectedPlan.durationMinutes,
        dataLimitMB: selectedPlan.dataLimitMB,
        downloadSpeedMbps: selectedPlan.downloadSpeedMbps,
        uploadSpeedMbps: selectedPlan.uploadSpeedMbps,
        status: 'unused',
        createdAt: nowStr,
        dataUsedMB: 0,
        timeUsedMinutes: 0,
        notes: notes || `Generated in batch ${batchId}`,
        batchId,
      });
    }

    setVouchers((prev) => [...newVouchers, ...prev]);

    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Batch generated ${count} vouchers (${selectedPlan.name}) with prefix "${prefix || 'AIS'}"`,
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'info',
    });

    return newVouchers;
  };

  const revokeVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'revoked' } : v))
    );
    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Voucher ID ${id} was revoked by administrator`,
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'warning',
    });
  };

  const deleteVoucher = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const extendVoucherTimeAndData = (id: string, extraMinutes: number, extraMB: number) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            durationMinutes: v.durationMinutes + extraMinutes,
            dataLimitMB: v.dataLimitMB + extraMB,
            status: v.status === 'expired' ? 'active' : v.status,
          };
        }
        return v;
      })
    );
  };

  // Kick Session
  const kickSession = (sessionId: string) => {
    const session = activeSessions.find((s) => s.sessionId === sessionId);
    if (!session) return;

    setActiveSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));

    if (currentSession?.sessionId === sessionId) {
      setCurrentSession(null);
      setCurrentUser(null);
    }

    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Administrator forcefully kicked session ${sessionId} (${session.userDisplayName}, IP: ${session.ipAddress})`,
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'warning',
    });
  };

  // Throttle Session
  const toggleThrottleSession = (sessionId: string) => {
    setActiveSessions((prev) =>
      prev.map((s) => {
        if (s.sessionId === sessionId) {
          const nextState = !s.isThrottled;
          addAuditLog({
            eventType: 'ADMIN_ACTION',
            message: `Session ${sessionId} (${s.userDisplayName}) bandwidth was ${nextState ? 'THROTTLED to 512Kbps' : 'RESTORED to full profile speed'}`,
            userIdentifier: 'admin',
            ipAddress: '192.168.88.2',
            severity: nextState ? 'warning' : 'info',
          });
          return {
            ...s,
            isThrottled: nextState,
            maxDownloadMbps: nextState ? 0.5 : 5,
            maxUploadMbps: nextState ? 0.2 : 2,
          };
        }
        return s;
      })
    );

    if (currentSession?.sessionId === sessionId) {
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              isThrottled: !prev.isThrottled,
              maxDownloadMbps: !prev.isThrottled ? 0.5 : 5,
              maxUploadMbps: !prev.isThrottled ? 0.2 : 2,
            }
          : null
      );
    }
  };

  // Grant Bonus Session
  const grantBonusSession = (sessionId: string, extraMinutes: number, extraMB: number) => {
    const extraSec = extraMinutes * 60;
    setActiveSessions((prev) =>
      prev.map((s) => {
        if (s.sessionId === sessionId) {
          return {
            ...s,
            remainingSeconds: s.remainingSeconds + extraSec,
            totalDurationSeconds: s.totalDurationSeconds + extraSec,
            totalDataLimitMB: s.totalDataLimitMB + extraMB,
          };
        }
        return s;
      })
    );

    if (currentSession?.sessionId === sessionId) {
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              remainingSeconds: prev.remainingSeconds + extraSec,
              totalDurationSeconds: prev.totalDurationSeconds + extraSec,
              totalDataLimitMB: prev.totalDataLimitMB + extraMB,
            }
          : null
      );
    }

    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Granted +${extraMinutes} mins & +${extraMB} MB bonus bandwidth to session ${sessionId}`,
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'success',
    });
  };

  // Student CRUD
  const addStudent = (studentData: Omit<StudentAccount, 'id' | 'dailyMinutesUsedToday' | 'dailyDataUsedTodayMB'>) => {
    const newStudent: StudentAccount = {
      ...studentData,
      id: 'stud-' + Date.now(),
      dailyMinutesUsedToday: 0,
      dailyDataUsedTodayMB: 0,
      lastLogin: 'Never',
    };
    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: `Added new student account: ${newStudent.fullName} (LRN: ${newStudent.lrn}, Section: ${newStudent.gradeLevel} ${newStudent.section})`,
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'info',
    });
  };

  const updateStudent = (id: string, updates: Partial<StudentAccount>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Policy update
  const updatePolicy = (updates: Partial<NetworkPolicy>) => {
    setNetworkPolicy((prev) => ({ ...prev, ...updates }));
    addAuditLog({
      eventType: 'ADMIN_ACTION',
      message: 'Network policies and bandwidth QoS settings updated',
      userIdentifier: 'admin',
      ipAddress: '192.168.88.2',
      severity: 'info',
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  const resetToDefaults = () => {
    setVouchers(INITIAL_VOUCHERS);
    setStudents(INITIAL_STUDENTS);
    setActiveSessions(INITIAL_ACTIVE_SESSIONS);
    setNetworkPolicy(INITIAL_NETWORK_POLICY);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentSession(null);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <HotspotContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        currentUser,
        currentSession,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        plans,
        vouchers,
        students,
        activeSessions,
        networkPolicy,
        auditLogs,
        stats,
        loginWithVoucher,
        loginWithStudentAccount,
        disconnectCurrentSession,
        pauseResumeCurrentSession,
        topupWithVoucher,
        generateVouchers,
        revokeVoucher,
        deleteVoucher,
        extendVoucherTimeAndData,
        kickSession,
        toggleThrottleSession,
        grantBonusSession,
        addStudent,
        updateStudent,
        deleteStudent,
        updatePolicy,
        addAuditLog,
        clearAuditLogs,
        resetToDefaults,
      }}
    >
      {children}
    </HotspotContext.Provider>
  );
};

export const useHotspot = () => {
  const context = useContext(HotspotContext);
  if (!context) {
    throw new Error('useHotspot must be used within a HotspotProvider');
  }
  return context;
};
