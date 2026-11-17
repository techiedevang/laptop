'use client';

import React, { useState } from 'react';
import {
  Shield, UserPlus, CheckCircle2, AlertTriangle, Lock, Eye,
  Trash2, Edit2, ShieldAlert, KeyRound, Globe, ListFilter,
  Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  twoFactorEnabled: boolean;
  isActive: boolean;
  lastLogin: string;
  ipAllowlist: string[];
  activityLogs: { action: string; ip: string; timestamp: string }[];
}

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'u-1',
    name: 'Devan Sharma (Principal)',
    email: 'admin@nextgenithub.in',
    role: 'SUPER_ADMIN',
    twoFactorEnabled: true,
    isActive: true,
    lastLogin: '15 Nov 2024, 02:14 PM',
    ipAllowlist: ['103.21.244.10', '192.168.1.100'],
    activityLogs: [
      { action: 'Updated site SEO defaults', ip: '103.21.244.10', timestamp: '15 Nov 02:15 PM' },
      { action: 'Approved 3 customer reviews', ip: '103.21.244.10', timestamp: '15 Nov 01:40 PM' },
      { action: 'Triggered database backup', ip: '103.21.244.10', timestamp: '14 Nov 11:30 PM' },
    ],
  },
  {
    id: 'u-2',
    name: 'Vikas Sharma',
    email: 'vikas@nextgenithub.in',
    role: 'MANAGER',
    twoFactorEnabled: true,
    isActive: true,
    lastLogin: '15 Nov 2024, 11:30 AM',
    ipAllowlist: ['103.21.244.15'],
    activityLogs: [
      { action: 'Host joined demo NGH-LIVE-771', ip: '103.21.244.15', timestamp: '15 Nov 11:32 AM' },
      { action: 'Updated inventory SKU NGH-DL-7490-A stock', ip: '103.21.244.15', timestamp: '14 Nov 04:10 PM' },
    ],
  },
  {
    id: 'u-3',
    name: 'Ananya Sen',
    email: 'ananya@nextgenithub.in',
    role: 'STAFF',
    twoFactorEnabled: false,
    isActive: true,
    lastLogin: '14 Nov 2024, 05:20 PM',
    ipAllowlist: [],
    activityLogs: [
      { action: 'Marked order NGH-ORD-9021 Packed', ip: '122.161.44.89', timestamp: '14 Nov 05:22 PM' },
    ],
  },
  {
    id: 'u-4',
    name: 'Rahul Verma (Ex-Staff)',
    email: 'rahul.v@nextgenithub.in',
    role: 'STAFF',
    twoFactorEnabled: false,
    isActive: false,
    lastLogin: '01 Nov 2024, 10:00 AM',
    ipAllowlist: [],
    activityLogs: [
      { action: 'Account deactivated by Super Admin', ip: '103.21.244.10', timestamp: '02 Nov 09:00 AM' },
    ],
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(INITIAL_USERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserLogs, setSelectedUserLogs] = useState<AdminUserRecord | null>(null);
  const [editingAllowlistUser, setEditingAllowlistUser] = useState<AdminUserRecord | null>(null);
  const [ipInput, setIpInput] = useState('');

  // Add User Form
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'STAFF' as AdminRole,
    tempPassword: '',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email required');
      return;
    }
    const created: AdminUserRecord = {
      id: Math.random().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      twoFactorEnabled: false,
      isActive: true,
      lastLogin: 'Never logged in',
      ipAllowlist: [],
      activityLogs: [
        { action: 'Account created with initial credentials', ip: '127.0.0.1', timestamp: 'Just now' },
      ],
    };
    setUsers((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Admin user created. Temporary password dispatched to ${newUser.email}`);
  };

  const handleToggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextState = !u.isActive;
          toast[nextState ? 'success' : 'error'](
            nextState ? `User ${u.name} activated` : `User ${u.name} suspended`
          );
          return {
            ...u,
            isActive: nextState,
            activityLogs: [
              {
                action: nextState ? 'Re-activated account' : 'Suspended account',
                ip: '103.21.244.10',
                timestamp: 'Just now',
              },
              ...u.activityLogs,
            ],
          };
        }
        return u;
      })
    );
  };

  const handleSaveIPs = () => {
    if (!editingAllowlistUser) return;
    const ips = ipInput
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);

    setUsers((prev) =>
      prev.map((u) => (u.id === editingAllowlistUser.id ? { ...u, ipAllowlist: ips } : u))
    );
    toast.success(`IP allowlist updated for ${editingAllowlistUser.name}`);
    setEditingAllowlistUser(null);
  };

  const handleRoleChange = (id: string, newRole: AdminRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    toast.success(`Role changed to ${newRole}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" /> Admin Users, Roles & Security Access
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage administrative personnel, RBAC permissions, mandatory TOTP 2FA enforcement, and IP restrictions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
        >
          <UserPlus className="h-4 w-4" /> Add Admin User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role Permission</th>
                <th className="py-3.5 px-4">2FA Status</th>
                <th className="py-3.5 px-4">IP Allowlist</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-[11px] text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                      disabled={user.role === 'SUPER_ADMIN'}
                      className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-semibold"
                    >
                      <option value="SUPER_ADMIN">SUPER ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    {user.twoFactorEnabled ? (
                      <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Enforced
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-bold text-amber-500">
                        <AlertTriangle className="h-4 w-4" /> Missing 2FA
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setEditingAllowlistUser(user);
                        setIpInput(user.ipAllowlist.join(', '));
                      }}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px]"
                    >
                      <Globe className="h-3 w-3" />
                      {user.ipAllowlist.length > 0 ? `${user.ipAllowlist.length} IPs` : 'Any IP (Open)'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                    {user.lastLogin}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => setSelectedUserLogs(user)}
                      className="p-1.5 text-gray-400 hover:text-blue-600"
                      title="View Audit Logs"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {user.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`p-1.5 ${
                          user.isActive ? 'text-gray-400 hover:text-red-600' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                        title={user.isActive ? 'Suspend' : 'Activate'}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log Drawer Modal */}
      {selectedUserLogs && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Audit Activity Trail: {selectedUserLogs.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">{selectedUserLogs.email}</p>
              </div>
              <button
                onClick={() => setSelectedUserLogs(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {selectedUserLogs.activityLogs.map((log, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60 flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.action}</p>
                    <p className="text-[10px] text-gray-400 font-mono">IP: {log.ip}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{log.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserLogs(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IP Allowlist Modal */}
      {editingAllowlistUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" /> IP Allowlist for {editingAllowlistUser.name}
            </h3>
            <p className="text-gray-500">
              Only logins from these IPv4/IPv6 addresses will be permitted for this account. Leave empty to allow any network.
            </p>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Authorized IP Addresses (Comma-separated)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 103.21.244.10, 14.139.120.5"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAllowlistUser(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveIPs}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Save IP Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Add Staff / Admin User</h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Kapoor"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sneha@nextgenithub.in"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Assign Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <option value="STAFF">STAFF (Orders & Demo Hosting)</option>
                  <option value="MANAGER">MANAGER (Inventory & Enquiries)</option>
                  <option value="ADMIN">ADMIN (Full Operations)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Temporary Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newUser.tempPassword}
                  onChange={(e) => setNewUser({ ...newUser, tempPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
