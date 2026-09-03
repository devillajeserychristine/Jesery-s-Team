export type UserRole = 'student' | 'voucher_user' | 'admin' | 'faculty';

export type VoucherStatus = 'unused' | 'active' | 'expired' | 'revoked';

export interface VoucherPlan {
  id: string;
  name: string;
  durationMinutes: number; // e.g. 60 = 1 hour, 1440 = 24 hours
  dataLimitMB: number; // 0 for unlimited
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  pricePhp: number; // Free or subsidized
  description: string;
  badgeColor: string;
}

export interface Voucher {
  id: string;
  code: string;
  planId: string;
  planName: string;
  durationMinutes: number;
  dataLimitMB: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  status: VoucherStatus;
  createdAt: string;
  expiresAt?: string;
  activatedAt?: string;
  usedBy?: string; // Student name or device
  macAddress?: string;
  dataUsedMB: number;
  timeUsedMinutes: number;
  notes?: string;
  batchId?: string;
}

export interface StudentAccount {
  id: string;
  lrn: string; // Learner Reference Number (12 digits)
  fullName: string;
  gradeLevel: string; // e.g. "Grade 7", "Grade 10", "Grade 12"
  section: string; // e.g. "Mabini", "STEM-Einstein"
  email?: string;
  password?: string;
  role: 'student' | 'faculty';
  dailyFreeMinutes: number;
  dailyFreeDataMB: number;
  dailyMinutesUsedToday: number;
  dailyDataUsedTodayMB: number;
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface ActiveSession {
  sessionId: string;
  identifier: string; // Voucher code or LRN
  userDisplayName: string;
  userType: 'student' | 'voucher_user' | 'faculty';
  planName: string;
  ipAddress: string;
  macAddress: string;
  connectedAt: string;
  totalDurationSeconds: number;
  remainingSeconds: number;
  totalDataLimitMB: number;
  downloadedMB: number;
  uploadedMB: number;
  currentDownloadSpeedKbps: number;
  currentUploadSpeedKbps: number;
  maxDownloadMbps: number;
  maxUploadMbps: number;
  isThrottled: boolean;
  isPaused: boolean;
  connectedAp: string;
  deviceInfo: string;
}

export interface NetworkPolicy {
  schoolName: string;
  campusSSID: string;
  gatewayIp: string;
  primaryDns: string;
  captivePortalTitle: string;
  announcementNotice: string;
  requireTermsAcceptance: boolean;
  academicResearchHoursOnly: boolean;
  blockSocialMediaDuringClass: boolean;
  blockGamingSites: boolean;
  blockP2PTorrenting: boolean;
  defaultStudentDownloadMbps: number;
  defaultStudentUploadMbps: number;
  facultyDownloadMbps: number;
  facultyUploadMbps: number;
  sessionIdleTimeoutMinutes: number;
  dailyResetTime: string; // e.g. "00:00"
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'VOUCHER_ACTIVATED' | 'SESSION_EXPIRED' | 'ADMIN_ACTION' | 'QUOTA_DEPLETED' | 'SECURITY_ALERT';
  message: string;
  userIdentifier: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface HotspotStats {
  activeUsersCount: number;
  totalDataTodayGB: number;
  vouchersGeneratedCount: number;
  vouchersActiveCount: number;
  networkUtilizationPercent: number;
  peakHourUsers: number;
}
