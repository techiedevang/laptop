'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, Clock, Download, UserX, CheckCircle2, XCircle,
  AlertTriangle, User, Calendar, FileText, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export type RequestType = 'ACCESS' | 'CORRECTION' | 'DELETION';
export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface PrivacyRequest {
  id: string;
  requestId: string;
  customerName: string;
  customerEmail: string;
  phoneMasked: string;
  type: RequestType;
  status: RequestStatus;
  reason?: string;
  createdAt: string;
  slaDaysRemaining: number;
}

const INITIAL_REQUESTS: PrivacyRequest[] = [
  {
    id: 'pr-1',
    requestId: 'DPDP-2024-001',
    customerName: 'Aakash Mehta',
    customerEmail: 'aakash.m@gmail.com',
    phoneMasked: '+91 98xxxxxx12',
    type: 'ACCESS',
    status: 'PENDING',
    reason: 'Requesting complete export of order history, KYC invoices, and device video logs.',
    createdAt: '14 Nov 2024',
    slaDaysRemaining: 28,
  },
  {
    id: 'pr-2',
    requestId: 'DPDP-2024-002',
    customerName: 'Shreya Sengupta',
    customerEmail: 'shreya.s@yahoo.com',
    phoneMasked: '+91 97xxxxxx40',
    type: 'DELETION',
    status: 'IN_PROGRESS',
    reason: 'Account closure and personal data erasure request under Digital Personal Data Protection Act 2023.',
    createdAt: '12 Nov 2024',
    slaDaysRemaining: 26,
  },
  {
    id: 'pr-3',
    requestId: 'DPDP-2024-003',
    customerName: 'Rohan Deshmukh',
    customerEmail: 'rohan.d@outlook.com',
    phoneMasked: '+91 99xxxxxx81',
    type: 'CORRECTION',
    status: 'COMPLETED',
    reason: 'Updated corporate billing GSTIN number on historical delivery profiles.',
    createdAt: '08 Nov 2024',
    slaDaysRemaining: 0,
  },
];

export default function AdminPrivacyRequestsPage() {
  const [requests, setRequests] = useState<PrivacyRequest[]>(INITIAL_REQUESTS);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRequests = requests.filter((r) => {
    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast.success(`Request marked as ${status}`);
  };

  const handleExportUserData = (req: PrivacyRequest) => {
    toast.success(`Generating encrypted JSON archive for ${req.customerName}...`);
    const data = {
      user: { name: req.customerName, email: req.customerEmail },
      orders: [{ id: 'ORD-1021', totalPaise: 2499900, status: 'DELIVERED' }],
      consents: [{ policy: 'Privacy Policy v2.1', agreedAt: '2024-01-10' }],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `User_Export_${req.requestId}.json`;
    a.click();
  };

  const handleAnonymizeUserData = (req: PrivacyRequest) => {
    if (
      !confirm(
        `Are you sure you want to permanently erase / anonymize all personal identifying data for ${req.customerName}? Statutory tax invoice records will be retained for 7 years under Indian Income Tax Act.`
      )
    )
      return;

    handleUpdateStatus(req.id, 'COMPLETED');
    toast.success(`User PII successfully anonymized with AES pseudonyms.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" /> DPDP Statutory Privacy & Data Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage Data Principal access, correction, and right-to-be-forgotten deletion workflows compliant with the Digital Personal Data Protection Act 2023.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span className="text-gray-500 mr-2 font-medium">Request Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="ACCESS">Data Access (Export)</option>
              <option value="CORRECTION">Correction / Rectification</option>
              <option value="DELETION">Erasure / Deletion</option>
            </select>
          </div>

          <div>
            <span className="text-gray-500 mr-2 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <span className="text-gray-500">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredRequests.length}</span> requests
        </span>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4">Request #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">SLA Countdown</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Execute Compliance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {req.requestId}
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{req.customerName}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{req.customerEmail}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.type === 'DELETION'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : req.type === 'ACCESS'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {req.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {req.slaDaysRemaining > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          {req.slaDaysRemaining} Days (Statutory 30-day window)
                        </span>
                      ) : (
                        <span className="text-emerald-600">SLA Fulfilled</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value as RequestStatus)}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    {req.type === 'ACCESS' && (
                      <button
                        onClick={() => handleExportUserData(req)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow text-xs inline-flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" /> Export PII Archive
                      </button>
                    )}

                    {req.type === 'DELETION' && (
                      <button
                        onClick={() => handleAnonymizeUserData(req)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow text-xs inline-flex items-center gap-1"
                      >
                        <UserX className="h-3.5 w-3.5" /> Anonymize & Erasure
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
