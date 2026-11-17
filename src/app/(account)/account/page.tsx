'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Video,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  Key,
  LogOut,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountDashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Devan Sharma',
    email: 'devan.sharma@example.com',
    phone: '+91 98765 43210',
    gstin: '27AADCB2234M1Z2',
    company: 'Apex Tech Solutions',
    memberSince: 'October 2023',
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'security'>('overview');

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      type: 'Office / Corporate (Primary)',
      recipient: 'Devan Sharma',
      company: 'Apex Tech Solutions',
      gstin: '27AADCB2234M1Z2',
      phone: '+91 98765 43210',
      line1: '402, Quantum Towers, Senapati Bapat Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411016',
      isDefault: true,
    },
    {
      id: 'addr-2',
      type: 'Home',
      recipient: 'Devan Sharma',
      phone: '+91 98765 43210',
      line1: 'Flat 12B, Sky High Apartments, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      isDefault: false,
    },
  ]);

  const recentOrders = [
    {
      id: 'NG-2024-8841',
      date: '12 Nov 2024',
      item: 'Dell Latitude 7490 Core i5 8th Gen (16GB / 512GB SSD)',
      grade: 'Grade A+',
      status: 'SHIPPED',
      amount: '₹24,999',
      awb: 'BLUEDART-8829104',
    },
    {
      id: 'NG-2024-7629',
      date: '28 Sep 2024',
      item: 'Lenovo ThinkPad T480 Core i5 (16GB / 256GB SSD)',
      grade: 'Grade A+',
      status: 'DELIVERED',
      amount: '₹26,499',
      awb: 'DELHIVERY-7738210',
    },
  ];

  const upcomingMeeting = {
    id: 'meet_demo_9921',
    token: 'tok_demo_livekit_test_123',
    scheduledAt: 'Tomorrow at 3:30 PM IST',
    laptop: 'Apple MacBook Air M1 (Space Grey, 8GB / 256GB SSD)',
    engineer: 'Rajesh Patil (Senior Hardware Specialist)',
    status: 'CONFIRMED',
  };

  const handleLogout = () => {
    toast.success('You have been logged out securely.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Title */}
        <div className="border-b border-blue-100 dark:border-slate-800 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Customer Account Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your orders, scheduled video demonstrations, GST invoices, and DPDP privacy settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors border border-blue-200"
            >
              <span>Explore Laptops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Summary Banner */}
        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {userProfile.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{userProfile.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Verified Customer
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-500" /> {userProfile.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {userProfile.phone}</span>
                {userProfile.company && (
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-purple-500" /> {userProfile.company}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100/80 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Orders</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">2</p>
            </div>
            <div className="bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100/80 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700">Live Demos</span>
              <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">1 Scheduled</p>
            </div>
            <div className="bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100/80 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Warranty</span>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Active</p>
            </div>
            <div className="bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100/80 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Addresses</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">{addresses.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blue-100 dark:border-slate-800 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'addresses'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Delivery & GST Addresses
          </button>
          <Link
            href="/account/orders"
            className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <span>My Orders & Tracking</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/account/privacy-center"
            className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <span>DPDP Privacy Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Orders & Demos */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Scheduled Live Demo Alert Card */}
              {upcomingMeeting && (
                <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-blue-600 text-white">
                        <Video className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scheduled Live Laptop Demo</h3>
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">{upcomingMeeting.scheduledAt}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-200/80 text-blue-900 dark:bg-blue-900 dark:text-blue-200">
                      1-on-1 WebRTC
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-blue-100 dark:border-blue-900/60 text-xs space-y-1.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{upcomingMeeting.laptop}</p>
                    <p className="text-slate-500 dark:text-slate-400">Assigned Engineer: {upcomingMeeting.engineer}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">No application download required. Joins directly via browser.</span>
                    <Link
                      href={`/meet/${upcomingMeeting.token}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Enter Meeting Room</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Orders</h3>
                  </div>
                  <Link
                    href="/account/orders"
                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All & Download Tax Invoices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{order.id}</span>
                          <span className="text-xs text-slate-400">• {order.date}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {order.grade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{order.item}</p>
                        <p className="text-[11px] text-slate-400">Tracking: {order.awb}</p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">{order.amount}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Col: Quick Links & Protection */}
            <div className="space-y-6">
              
              {/* Warranty & Support Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hardware Protection</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  All Grade A+/A laptops include our 6-month comprehensive motherboard, RAM, and display guarantee.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">QC Checklist</span>
                    <span className="font-semibold text-emerald-600">50 Points Passed</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">GST Input Invoice</span>
                    <span className="font-semibold text-blue-600">18% HSN 8471</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Return Policy</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">7 Days Replacement</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block text-center w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 rounded-xl text-xs transition-colors"
                >
                  Raise Support or Warranty Claim
                </Link>
              </div>

              {/* DPDP Act 2023 Quick Access */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Your Privacy Rights</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Under the Digital Personal Data Protection (DPDP) Act 2023, you can download your complete data profile or request erasure.
                </p>
                <Link
                  href="/account/privacy-center"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <span>Open Privacy Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Addresses & GST */}
        {activeTab === 'addresses' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Saved Delivery & Billing Addresses</h3>
                <p className="text-xs text-slate-500 mt-0.5">Used for shipping dispatch and automatic GST tax invoice generation.</p>
              </div>
              <button
                onClick={() => toast.success('Address dialog ready')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                + Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 relative bg-slate-50/50 dark:bg-slate-950/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{addr.type}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{addr.recipient}</p>
                    {addr.company && <p className="text-purple-600 font-medium">{addr.company} (GSTIN: {addr.gstin})</p>}
                    <p>{addr.line1}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-slate-500">Phone: {addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
