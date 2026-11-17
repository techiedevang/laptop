'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video, Calendar as CalendarIcon, List, Clock, User, Phone, CheckCircle2,
  XCircle, AlertCircle, RefreshCw, Send, Settings, UserCheck, MessageSquare,
  TrendingUp, Users, ExternalLink, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface AdminMeeting {
  id: string;
  meetingCode: string;
  customerName: string;
  customerPhoneMasked: string;
  customerEmail: string;
  laptops: string[];
  dateTimeIST: string;
  timeSlot: string;
  status: 'UPCOMING' | 'LIVE_NOW' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  assignedStaff: string;
  notes?: string;
  notificationLogs: {
    channel: 'WHATSAPP' | 'EMAIL';
    status: 'DELIVERED' | 'SENT' | 'FAILED';
    sentAt: string;
  }[];
}

const INITIAL_MEETINGS: AdminMeeting[] = [
  {
    id: 'm-1',
    meetingCode: 'NGH-LIVE-771',
    customerName: 'Karthik Raja',
    customerPhoneMasked: '+91 98xxxxxx31',
    customerEmail: 'karthik.raja@gmail.com',
    laptops: ['ThinkPad T14 Gen 1', 'Dell Latitude 7490'],
    dateTimeIST: '15 Nov 2024, 02:30 PM',
    timeSlot: '02:30 PM - 02:45 PM',
    status: 'LIVE_NOW',
    assignedStaff: 'Vikas Sharma',
    notes: 'Customer interested in battery life testing and keyboard condition comparison.',
    notificationLogs: [
      { channel: 'WHATSAPP', status: 'DELIVERED', sentAt: '15 Nov 10:00 AM' },
      { channel: 'EMAIL', status: 'DELIVERED', sentAt: '15 Nov 10:00 AM' },
    ],
  },
  {
    id: 'm-2',
    meetingCode: 'NGH-LIVE-772',
    customerName: 'Priya Sundaram',
    customerPhoneMasked: '+91 91xxxxxx90',
    customerEmail: 'priya.s@infotech.in',
    laptops: ['HP EliteBook 840 G6'],
    dateTimeIST: '15 Nov 2024, 04:00 PM',
    timeSlot: '04:00 PM - 04:15 PM',
    status: 'UPCOMING',
    assignedStaff: 'Ananya Sen',
    notes: 'B2B order enquiry for 10 units, needs to inspect aluminum chassis condition.',
    notificationLogs: [
      { channel: 'WHATSAPP', status: 'DELIVERED', sentAt: '15 Nov 11:30 AM' },
      { channel: 'EMAIL', status: 'DELIVERED', sentAt: '15 Nov 11:30 AM' },
    ],
  },
  {
    id: 'm-3',
    meetingCode: 'NGH-LIVE-770',
    customerName: 'Ramesh Patel',
    customerPhoneMasked: '+91 94xxxxxx11',
    customerEmail: 'ramesh.p@yahoo.com',
    laptops: ['MacBook Air M1 Space Grey'],
    dateTimeIST: '15 Nov 2024, 11:00 AM',
    timeSlot: '11:00 AM - 11:15 AM',
    status: 'COMPLETED',
    assignedStaff: 'Vikas Sharma',
    notes: 'Customer loved the display and battery report. Converted to order NGH-ORD-9021!',
    notificationLogs: [
      { channel: 'WHATSAPP', status: 'DELIVERED', sentAt: '14 Nov 06:00 PM' },
      { channel: 'EMAIL', status: 'DELIVERED', sentAt: '14 Nov 06:00 PM' },
    ],
  },
  {
    id: 'm-4',
    meetingCode: 'NGH-LIVE-769',
    customerName: 'Amit Bansal',
    customerPhoneMasked: '+91 88xxxxxx20',
    customerEmail: 'amit.b@outlook.com',
    laptops: ['Dell Latitude 5400'],
    dateTimeIST: '14 Nov 2024, 03:00 PM',
    timeSlot: '03:00 PM - 03:15 PM',
    status: 'NO_SHOW',
    assignedStaff: 'Rahul Verma',
    notes: 'Did not join room after 7 minutes. Follow-up WhatsApp message sent.',
    notificationLogs: [
      { channel: 'WHATSAPP', status: 'DELIVERED', sentAt: '14 Nov 09:00 AM' },
      { channel: 'EMAIL', status: 'SENT', sentAt: '14 Nov 09:00 AM' },
    ],
  },
];

const STAFF_LIST = ['Vikas Sharma', 'Ananya Sen', 'Rahul Verma', 'Sneha Kapoor'];

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<AdminMeeting[]>(INITIAL_MEETINGS);
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  // Availability Settings
  const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [slotDuration, setSlotDuration] = useState(15);
  const [maxBookingsPerSlot, setMaxBookingsPerSlot] = useState(2);

  const filteredMeetings = meetings.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: AdminMeeting['status']) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    toast.success(`Meeting status updated to ${status}`);
  };

  const handleAssignStaff = (id: string, staff: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, assignedStaff: staff } : m))
    );
    toast.success(`Assigned ${staff} to meeting`);
  };

  const handleResendNotification = (meeting: AdminMeeting) => {
    toast.success(`Reminder sent to ${meeting.customerName} via WhatsApp & Email`);
  };

  const handleUpdateNotes = (id: string) => {
    const current = meetings.find((m) => m.id === id)?.notes || '';
    const updated = prompt('Internal Staff Notes for Meeting:', current);
    if (updated !== null) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, notes: updated } : m))
      );
      toast.success('Internal notes updated');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-600" /> Video Demo & Live Meetings Admin
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Host 1-on-1 live video demos with buyers, demonstrate device grade & battery stats before dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'LIST'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'CALENDAR'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Calendar
            </button>
          </div>

          <button
            onClick={() => setIsAvailabilityOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Settings className="h-3.5 w-3.5 text-gray-500" />
            <span>Manage Slots</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s Demos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4</p>
          <span className="text-[10px] text-blue-500 font-medium">1 Live Now</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</p>
          <span className="text-[10px] text-green-500 font-medium">+15% vs last week</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">92%</p>
          <span className="text-[10px] text-gray-400">Healthy</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">No-Show Rate</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">8%</p>
          <span className="text-[10px] text-gray-400">Target &lt; 10%</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Order Conversion</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">64%</p>
          <span className="text-[10px] text-purple-500 font-medium">High B2B Intent</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'LIVE_NOW', 'UPCOMING', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content: List or Calendar */}
      {viewMode === 'LIST' ? (
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 shadow-sm transition-all ${
                meeting.status === 'LIVE_NOW'
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Meeting Left Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {meeting.meetingCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        meeting.status === 'LIVE_NOW'
                          ? 'bg-red-100 text-red-600 animate-pulse'
                          : meeting.status === 'UPCOMING'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : meeting.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {meeting.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">| {meeting.timeSlot} (IST)</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {meeting.customerName}
                    </span>
                    <span className="text-gray-500 font-mono">{meeting.customerPhoneMasked}</span>
                    <span className="text-gray-500">{meeting.customerEmail}</span>
                  </div>

                  {/* Laptops Requested */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] text-gray-400 font-medium">Requested Devices:</span>
                    {meeting.laptops.map((lap, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 text-xs font-semibold"
                      >
                        {lap}
                      </span>
                    ))}
                  </div>

                  {/* Notes & Notification Status */}
                  {meeting.notes && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mt-2">
                      📝 {meeting.notes}
                    </p>
                  )}

                  {/* Notification delivery logs */}
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-gray-500">
                    <span>Notifications:</span>
                    {meeting.notificationLogs.map((log, i) => (
                      <span key={i} className="flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {log.channel}: {log.status}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
                  {/* Staff Assignment */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Assigned:</span>
                    <select
                      value={meeting.assignedStaff}
                      onChange={(e) => handleAssignStaff(meeting.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    >
                      {STAFF_LIST.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/meet/${meeting.meetingCode.toLowerCase()}`}
                      target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
                    >
                      <Video className="h-3.5 w-3.5" /> Join as Host
                    </Link>

                    <button
                      onClick={() => handleResendNotification(meeting)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs"
                      title="Resend WhatsApp/Email reminders"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleUpdateNotes(meeting.id)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs"
                      title="Edit staff notes"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>

                    <select
                      value={meeting.status}
                      onChange={(e) => handleStatusChange(meeting.id, e.target.value as any)}
                      className="px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-xs font-semibold"
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="LIVE_NOW">Live Now</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NO_SHOW">No Show</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Weekly Demo Schedule (11 Nov – 17 Nov 2024)
            </h3>
            <span className="text-xs text-gray-500">All times in Indian Standard Time (IST)</span>
          </div>

          <div className="grid grid-cols-6 gap-2 text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 min-h-[220px] bg-gray-50/50 dark:bg-gray-900/30">
                <div className="font-bold text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                  <span>{day}</span>
                  <span className="text-gray-400 font-normal">{11 + i} Nov</span>
                </div>
                <div className="mt-2 space-y-2">
                  {i === 4 && (
                    <>
                      <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 p-2 rounded-lg text-[11px]">
                        <p className="font-bold text-red-700 dark:text-red-300">02:30 PM</p>
                        <p className="truncate font-medium text-gray-800 dark:text-gray-200">Karthik Raja</p>
                        <p className="text-[10px] text-gray-500">ThinkPad T14</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 p-2 rounded-lg text-[11px]">
                        <p className="font-bold text-blue-700 dark:text-blue-300">04:00 PM</p>
                        <p className="truncate font-medium text-gray-800 dark:text-gray-200">Priya Sundaram</p>
                        <p className="text-[10px] text-gray-500">HP EliteBook</p>
                      </div>
                    </>
                  )}
                  {i === 3 && (
                    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded-lg text-[11px]">
                      <p className="font-bold text-gray-700 dark:text-gray-300">03:00 PM</p>
                      <p className="truncate font-medium text-gray-800 dark:text-gray-200">Amit Bansal</p>
                      <p className="text-[10px] text-gray-400">Dell 5400</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Availability Modal */}
      {isAvailabilityOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-600" /> Manage Video Demo Availability
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Working Days
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setWorkingDays((prev) =>
                          prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        workingDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Slot Duration (Minutes)
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Max Concurrent Demos
                  </label>
                  <input
                    type="number"
                    value={maxBookingsPerSlot}
                    onChange={(e) => setMaxBookingsPerSlot(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Excluded Holiday Dates
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25 Dec, 26 Jan, 15 Aug (comma separated)"
                  defaultValue="26 Jan, 15 Aug, 02 Oct, Diwali"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsAvailabilityOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAvailabilityOpen(false);
                  toast.success('Availability settings saved!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
