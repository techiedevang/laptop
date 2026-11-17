'use client';

import React, { useState } from 'react';
import {
  Settings, Building2, Phone, Mail, MapPin, Globe, Shield,
  Server, Lock, Save, AlertTriangle, Power, Image as ImageIcon,
  Clock, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'CONTACT' | 'TAX' | 'SEO' | 'SMTP' | 'MAINTENANCE'>('GENERAL');

  // Form States
  const [companyName, setCompanyName] = useState('NextGen IT Hub Pvt Ltd');
  const [cinNumber, setCinNumber] = useState('U72900DL2021PTC389120');
  const [gstin, setGstin] = useState('07AABCN8891P1ZX');
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');

  // Contact Info
  const [addressLine, setAddressLine] = useState('Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092');
  const [supportPhone, setSupportPhone] = useState('+91 9155282776');
  const [supportEmail, setSupportEmail] = useState('support@nextgenithub.in');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 9155282776');
  const [workingHours, setWorkingHours] = useState('Mon - Sat: 10:00 AM – 7:30 PM IST');
  const [mapLatitude, setMapLatitude] = useState('28.6282892');
  const [mapLongitude, setMapLongitude] = useState('77.2782221');

  // Social Links
  const [socials, setSocials] = useState({
    facebook: 'https://facebook.com/nextgenithub',
    instagram: 'https://instagram.com/nextgenithub',
    linkedin: 'https://linkedin.com/company/nextgen-it-hub',
    twitter: 'https://x.com/nextgenithub',
    youtube: 'https://youtube.com/@nextgenithub',
    whatsapp: 'https://wa.me/919155282776',
  });

  // SEO
  const [titleTemplate, setTitleTemplate] = useState('%s | NextGen IT Hub — Refurbished Laptops India');
  const [metaDescription, setMetaDescription] = useState('Buy certified refurbished enterprise laptops in India with 1-Year Warranty, 40-step QA inspection, and express delivery.');

  // Maintenance Mode
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('NextGen IT Hub is undergoing scheduled database maintenance. We will be back online at 06:00 AM IST.');

  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('resend');
  const [smtpPassword, setSmtpPassword] = useState('••••••••••••••••');
  const [fromEmail, setFromEmail] = useState('orders@nextgenithub.in');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved successfully!');
  };

  const handleTestEmail = () => {
    toast.success(`Sent test email dispatch to ${supportEmail}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" /> Platform & Business Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Configure legal business entity details, GSTIN, SMTP notification gateways, SEO metadata, and maintenance switches.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
        >
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'GENERAL', label: 'Company & Tax' },
          { key: 'CONTACT', label: 'Contact & Location' },
          { key: 'SEO', label: 'SEO Defaults' },
          { key: 'SMTP', label: 'Email & SMTP' },
          { key: 'MAINTENANCE', label: 'Maintenance Mode' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-gray-800'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSaveAll} className="space-y-6 text-xs text-gray-900 dark:text-gray-100">
        {/* 1. General & Tax Details */}
        {activeTab === 'GENERAL' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" /> Corporate Entity & Statutory Tax Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Registered Legal Entity Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Corporate Identification Number (CIN)
                </label>
                <input
                  type="text"
                  value={cinNumber}
                  onChange={(e) => setCinNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  GSTIN (15-Digit Indian GST Number) *
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Logo Asset Path or URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Contact & Location */}
        {activeTab === 'CONTACT' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" /> Physical Headquarters & Customer Care
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Registered Warehouse & Office Address
                  </label>
                  <textarea
                    rows={2}
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Support Working Hours</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={mapLatitude}
                    onChange={(e) => setMapLatitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={mapLongitude}
                    onChange={(e) => setMapLongitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-500" /> Social Media Profiles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(socials).map(([net, url]) => (
                  <div key={net}>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1 capitalize">
                      {net}
                    </label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setSocials({ ...socials, [net]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SEO Defaults */}
        {activeTab === 'SEO' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" /> Global Search Engine Optimization Defaults
            </h3>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Default Title Template (%s will be replaced by page title)
                </label>
                <input
                  type="text"
                  value={titleTemplate}
                  onChange={(e) => setTitleTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. SMTP Email */}
        {activeTab === 'SMTP' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-500" /> Transactional Email Gateway (SMTP / Resend)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Port</label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">From Sender Email</label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">SMTP Username</label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">SMTP Password / API Key</label>
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestEmail}
                className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold hover:bg-purple-100 text-xs"
              >
                Send Test Email
              </button>
            </div>
          </div>
        )}

        {/* 5. Maintenance Mode */}
        {activeTab === 'MAINTENANCE' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Power className="h-4 w-4 text-red-500" /> Platform Maintenance Toggle
            </h3>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Emergency Maintenance Mode</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  When enabled, all public catalog and checkout routes display a 503 Maintenance landing screen. Admin dashboard remains accessible.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !isMaintenanceMode;
                  setIsMaintenanceMode(next);
                  toast[next ? 'error' : 'success'](
                    next ? 'MAINTENANCE MODE ACTIVATED' : 'Storefront restored online'
                  );
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs shadow transition-colors ${
                  isMaintenanceMode
                    ? 'bg-red-600 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isMaintenanceMode ? 'MAINTENANCE ACTIVE' : 'SYSTEM OPERATIONAL'}
              </button>
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Notice Message Displayed to Customers
              </label>
              <textarea
                rows={3}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
          >
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
