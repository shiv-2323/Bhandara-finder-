import React, { useState } from 'react';
import { BhandaraEvent, FlagReport, Language } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bhandaras: BhandaraEvent[];
  trashBhandaras: BhandaraEvent[];
  reports: FlagReport[];
  onApproveVerification: (id: string) => void;
  onRejectVerification: (id: string) => void;
  onResolveReport: (reportId: string) => void;
  onDeleteReportedBhandara: (reportId: string, bhandaraId: string) => void;
  onRestoreFromTrash: (id: string) => void;
  onPermDeleteFromTrash: (id: string) => void;
  lang: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  bhandaras,
  trashBhandaras,
  reports,
  onApproveVerification,
  onRejectVerification,
  onResolveReport,
  onDeleteReportedBhandara,
  onRestoreFromTrash,
  onPermDeleteFromTrash,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'reports' | 'trash'>('overview');

  if (!isOpen) return null;

  const pendingVerifications = bhandaras.filter((b) => !b.isVerified);
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const totalMeals = bhandaras.reduce((sum, b) => sum + (b.estimatedMeals || 500), 0);

  // Category Breakdown
  const categoryCounts: Record<string, number> = {};
  bhandaras.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-3xl w-full max-w-3xl my-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-[#F4811F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="text-xl font-extrabold font-['Baloo_2'] text-[#F4811F]">
                Admin Control Dashboard
              </h3>
              <p className="text-xs text-neutral-400">Moderation, Verifications & Performance Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-800 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Dashboard Metrics Bar */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-white text-center">
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-lg font-extrabold text-[#F4811F]">{bhandaras.length}</div>
            <div className="text-[11px] text-neutral-400">Total Events</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-lg font-extrabold text-emerald-400">{totalMeals.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-400">Est. Meals Served</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-lg font-extrabold text-amber-400">{pendingVerifications.length}</div>
            <div className="text-[11px] text-neutral-400">Pending Verification</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-lg font-extrabold text-red-400">{pendingReports.length}</div>
            <div className="text-[11px] text-neutral-400">Flagged Reports</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[var(--border)] bg-[var(--bg-input)] px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-t-xl border-t-2 border-x transition-all ${
              activeTab === 'overview'
                ? 'bg-[var(--bg-card)] border-[#F4811F] text-[#F4811F]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[#F4811F]'
            }`}
          >
            📊 Analytics & Breakdown
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-t-xl border-t-2 border-x transition-all relative ${
              activeTab === 'verifications'
                ? 'bg-[var(--bg-card)] border-[#F4811F] text-[#F4811F]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[#F4811F]'
            }`}
          >
            🛡️ Verifications ({pendingVerifications.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-t-xl border-t-2 border-x transition-all relative ${
              activeTab === 'reports'
                ? 'bg-[var(--bg-card)] border-[#F4811F] text-[#F4811F]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[#F4811F]'
            }`}
          >
            🚩 Reports Queue ({pendingReports.length})
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`px-4 py-2 rounded-t-xl border-t-2 border-x transition-all ${
              activeTab === 'trash'
                ? 'bg-[var(--bg-card)] border-[#F4811F] text-[#F4811F]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[#F4811F]'
            }`}
          >
            🗑️ Trash ({trashBhandaras.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-[var(--text-head)]">
                📂 Category Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="bg-[var(--bg-input)] border border-[var(--border)] p-3 rounded-2xl">
                    <div className="text-xs text-[var(--text-muted)] font-bold">{cat}</div>
                    <div className="text-xl font-extrabold text-[#F4811F]">{count} events</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERIFICATIONS TAB */}
          {activeTab === 'verifications' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[var(--text-head)]">
                🛡️ Pending Organizer Verification Queue ({pendingVerifications.length})
              </h4>

              {pendingVerifications.length === 0 ? (
                <p className="text-xs text-[var(--text-faint)] italic text-center py-6">
                  ✅ All organizers are verified. No pending verifications.
                </p>
              ) : (
                pendingVerifications.map((b) => (
                  <div key={b.id} className="bg-[var(--bg-input)] border border-[var(--border)] p-3.5 rounded-2xl flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[#F4811F]">{b.name}</div>
                      <div className="text-xs text-[var(--text-head)] font-medium">👤 Organizer: {b.organizer}</div>
                      <div className="text-[11px] text-[var(--text-faint)]">📍 {b.location}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onApproveVerification(b.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => onRejectVerification(b.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[var(--text-head)]">
                🚩 Flagged Community Reports ({pendingReports.length})
              </h4>

              {pendingReports.length === 0 ? (
                <p className="text-xs text-[var(--text-faint)] italic text-center py-6">
                  ✅ No unresolved flag reports.
                </p>
              ) : (
                pendingReports.map((rep) => (
                  <div key={rep.id} className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-red-700 dark:text-red-300">
                        🚩 Reason: {rep.reason}
                      </span>
                      <span className="text-[10px] text-red-500">Event: {rep.bhandaraName}</span>
                    </div>
                    <p className="text-xs text-[var(--text-body)] font-medium">{rep.details}</p>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-red-200 dark:border-red-900">
                      <button
                        onClick={() => onResolveReport(rep.id)}
                        className="bg-neutral-800 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        Mark Dismissed / Safe
                      </button>
                      <button
                        onClick={() => onDeleteReportedBhandara(rep.id, rep.bhandaraId)}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        Delete Event Entry
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TRASH TAB */}
          {activeTab === 'trash' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[var(--text-head)]">
                🗑️ Trash / Recycle Bin ({trashBhandaras.length})
              </h4>

              {trashBhandaras.length === 0 ? (
                <p className="text-xs text-[var(--text-faint)] italic text-center py-6">
                  Trash bin is empty.
                </p>
              ) : (
                trashBhandaras.map((b) => (
                  <div key={b.id} className="bg-[var(--bg-input)] border border-[var(--border)] p-3 rounded-2xl flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--text-head)]">{b.name}</div>
                      <div className="text-[11px] text-[var(--text-faint)]">📍 {b.location}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onRestoreFromTrash(b.id)}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        ↩ Restore
                      </button>
                      <button
                        onClick={() => onPermDeleteFromTrash(b.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                      >
                        ✕ Delete Forever
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
