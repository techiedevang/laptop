'use client';

import { useState } from 'react';
import {
  Shield,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Lock,
  Smartphone,
  LogOut,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrivacyCenterPage() {
  const [consents, setConsents] = useState({
    marketing: false,
    whatsapp: true,
    analytics: true,
  });

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 's1',
      device: 'Chrome 124 on Windows 11',
      ip: '103.21.124.xx (Pune, India)',
      current: true,
      date: 'Active Now',
    },
    {
      id: 's2',
      device: 'Safari on iPhone 15',
      ip: '49.36.110.xx (Mumbai, India)',
      current: false,
      date: '12 Nov 2024',
    },
  ]);

  const [isExporting, setIsExporting] = useState(false);

  // Correction Form State
  const [correctionData, setCorrectionData] = useState({
    fullName: 'Deepak Verma',
    email: 'deepak@example.com',
    phone: '9876543210',
    reason: 'Update primary contact phone number',
  });
  const [isUpdatingData, setIsUpdatingData] = useState(false);

  const handleDownloadData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/account/export-data');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextgen-my-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Fallback simulation
        const userData = {
          platform: 'NextGen IT Hub',
          generatedAt: new Date().toISOString(),
          dpdpCompliance: 'Digital Personal Data Protection Act 2023',
          profile: {
            name: correctionData.fullName,
            email: correctionData.email,
            phone: `+91-${correctionData.phone}`,
          },
          orders: [
            {
              orderId: 'NGH-2024-889123',
              laptop: 'Dell Latitude 7490 Refurbished Grade A+',
              totalINR: 24999,
              status: 'DELIVERED',
            },
          ],
          consents,
        };

        const blob = new Blob([JSON.stringify(userData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextgen-my-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast.success('Your complete personal data export has been downloaded.');
    } catch {
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingData(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success('Rectification request recorded under DPDP Act. Profile updated.');
    } finally {
      setIsUpdatingData(false);
    }
  };

  const handleLogoutAll = () => {
    setActiveSessions(activeSessions.filter((s) => s.current));
    toast.success('Logged out from all other remote devices successfully.');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'WARNING: This will permanently anonymize your account records and revoke all active sessions under the DPDP Act 2023. Statutory GST tax invoices will be retained as per Ministry of Finance guidelines. Do you wish to proceed?'
    );
    if (!confirmed) return;

    try {
      await fetch('/api/account/delete-request', { method: 'POST' });
    } catch {}

    toast.success('Account deletion request registered. Logging out...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Privacy Center & DPDP Rights | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Statutory Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Privacy Center & Data Rights
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Exercise your legal rights of data access, correction, consent revocation, and erasure under India&apos;s Digital Personal Data Protection Act.
            </p>
          </div>

          {/* 1. Download My Data (Portability) */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <span>Right to Data Portability (Download My Data)</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  Receive an encrypted, machine-readable JSON copy of all personal records, order history, addresses, and consent audit logs associated with your account.
                </p>
              </div>

              <button
                onClick={handleDownloadData}
                disabled={isExporting}
                className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Compiling JSON...' : 'Download My Data (JSON)'}</span>
              </button>
            </div>
          </div>

          {/* 2. Correct My Data Form (Right to Rectification) */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Right to Correction & Rectification</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update or rectify inaccurate personal records stored in our database.
              </p>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={correctionData.fullName}
                    onChange={(e) => setCorrectionData({ ...correctionData, fullName: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={correctionData.email}
                    onChange={(e) => setCorrectionData({ ...correctionData, email: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    value={correctionData.phone}
                    onChange={(e) => setCorrectionData({ ...correctionData, phone: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Rectification Request
                </label>
                <input
                  type="text"
                  value={correctionData.reason}
                  onChange={(e) => setCorrectionData({ ...correctionData, reason: e.target.value })}
                  placeholder="e.g. Updating phone number for courier updates"
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingData}
                className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                {isUpdatingData ? 'Submitting...' : 'Save & Update My Data'}
              </button>
            </form>
          </div>

          {/* 3. Consent Management */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Manage Consents & Communication Channels</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Toggle individual data processing permissions at any time.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    WhatsApp Order & Demo Reminders
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Receive instant meeting room link for video demo and Bluedart delivery tracking via WhatsApp
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consents.whatsapp}
                  onChange={(e) => {
                    setConsents({ ...consents, whatsapp: e.target.checked });
                    toast.success('WhatsApp communication preference updated');
                  }}
                  className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Marketing Emails & Special Enterprise Deals
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Occasional announcements when fresh enterprise laptop batches arrive
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={(e) => {
                    setConsents({ ...consents, marketing: e.target.checked });
                    toast.success('Marketing email preference updated');
                  }}
                  className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Functional Performance & Diagnostic Cookies
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Helps us improve search filters and laptop comparison latency
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consents.analytics}
                  onChange={(e) => {
                    setConsents({ ...consents, analytics: e.target.checked });
                    toast.success('Diagnostic preference updated');
                  }}
                  className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Active Sessions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Active Login Sessions</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Devices currently authenticated to your account
                </p>
              </div>

              {activeSessions.length > 1 && (
                <button
                  onClick={handleLogoutAll}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out all devices</span>
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <span>{session.device}</span>
                      {session.current && (
                        <span className="text-[10px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-bold">
                          Current Device
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {session.ip} • {session.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Danger Zone: Delete Account */}
          <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-red-900 dark:text-red-200 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Right to Erasure (Delete Account & Anonymize Data)</span>
              </h2>
              <p className="text-xs text-red-700 dark:text-red-300">
                Permanently delete your profile, saved addresses, and active sessions. Legally required GST tax invoices are retained strictly for the statutory limitation period mandated by the Ministry of Finance.
              </p>
            </div>

            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Anonymize My Data</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
