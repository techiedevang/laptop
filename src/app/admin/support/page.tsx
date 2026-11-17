'use client';

import React, { useState } from 'react';
import {
  Headphones, MessageSquare, Mail, User, Clock, CheckCircle2,
  AlertCircle, Send, ArrowRight, Phone, Search, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedStaff: string;
  createdAt: string;
  messages: { sender: 'CUSTOMER' | 'STAFF'; text: string; timestamp: string }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'UNREAD' | 'REPLIED' | 'ARCHIVED';
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 't-1',
    ticketNumber: 'TKT-9912',
    subject: 'Request for RAM Upgrade on Dell Latitude 7490',
    customerName: 'Anil Deshmukh',
    customerEmail: 'anil.d@gmail.com',
    orderNumber: 'NGH-ORD-9021',
    status: 'OPEN',
    priority: 'HIGH',
    assignedStaff: 'Vikas Sharma',
    createdAt: '15 Nov 2024, 09:30 AM',
    messages: [
      {
        sender: 'CUSTOMER',
        text: 'Hello, I received my laptop yesterday. It is working wonderfully! Can you guide me on whether I can add a second 16GB DDR4 RAM stick without voiding the 1-year warranty?',
        timestamp: '15 Nov 09:30 AM',
      },
    ],
  },
  {
    id: 't-2',
    ticketNumber: 'TKT-9910',
    subject: 'Charger Cable Adapter Pin Issue',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.s@yahoo.com',
    orderNumber: 'NGH-ORD-9018',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignedStaff: 'Ananya Sen',
    createdAt: '14 Nov 2024, 04:15 PM',
    messages: [
      {
        sender: 'CUSTOMER',
        text: 'The 65W charging adapter pin has loose contact with my wall socket.',
        timestamp: '14 Nov 04:15 PM',
      },
      {
        sender: 'STAFF',
        text: 'Hi Priya, we apologize for the inconvenience! We have dispatched a replacement OEM 65W charger via BlueDart AWB 771299381. Tracking link sent to your SMS.',
        timestamp: '14 Nov 05:00 PM',
      },
    ],
  },
];

const INITIAL_CONTACTS: ContactMessage[] = [
  {
    id: 'c-1',
    name: 'Suresh Raina',
    email: 'suresh@crickettech.in',
    phone: '+91 9988112233',
    subject: 'Corporate Annual Maintenance Contract (AMC)',
    message: 'We have 45 ThinkPads in our Bangalore office and want to know if NextGen IT Hub offers post-warranty on-site AMC support.',
    createdAt: '15 Nov 2024, 11:20 AM',
    status: 'UNREAD',
  },
  {
    id: 'c-2',
    name: 'Dr. Meenakshi',
    email: 'meenakshi@aims.edu',
    phone: '+91 9444123456',
    subject: 'Donation of refurbished laptops to medical interns',
    message: 'We are seeking special academic institutional pricing for 12 laptops for our rural clinical team.',
    createdAt: '14 Nov 2024, 02:40 PM',
    status: 'REPLIED',
  },
];

const STAFF_LIST = ['Vikas Sharma', 'Ananya Sen', 'Rahul Verma', 'Sneha Kapoor'];

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'CONTACTS'>('TICKETS');
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [contacts, setContacts] = useState<ContactMessage[]>(INITIAL_CONTACTS);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [filterTicketStatus, setFilterTicketStatus] = useState('ALL');

  const filteredTickets = tickets.filter((t) => {
    if (filterTicketStatus !== 'ALL' && t.status !== filterTicketStatus) return false;
    return true;
  });

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'STAFF' as const,
      text: ticketReplyText.trim(),
      timestamp: 'Just now',
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, status: 'IN_PROGRESS', messages: [...t.messages, newMsg] }
          : t
      )
    );

    setSelectedTicket((prev) =>
      prev ? { ...prev, status: 'IN_PROGRESS', messages: [...prev.messages, newMsg] } : null
    );

    setTicketReplyText('');
    toast.success('Reply dispatched to customer email & SMS');
  };

  const handleAssignTicketStaff = (ticketId: string, staff: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedStaff: staff } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, assignedStaff: staff });
    }
    toast.success(`Assigned ticket to ${staff}`);
  };

  const handleTicketStatusChange = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }
    toast.success(`Ticket marked as ${status}`);
  };

  const handleContactStatus = (id: string, status: ContactMessage['status']) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    toast.success(`Message marked as ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Headphones className="h-6 w-6 text-blue-600" /> Customer Support & Contact Inquiries
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Resolve warranty support tickets, respond to storefront contact queries, and maintain SLAs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`px-4 py-2 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'TICKETS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="h-4 w-4" /> Support Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('CONTACTS')}
          className={`px-4 py-2 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'CONTACTS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Mail className="h-4 w-4" /> Contact Inquiries ({contacts.length})
        </button>
      </div>

      {/* TICKETS VIEW */}
      {activeTab === 'TICKETS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Filter Status:</span>
              <select
                value={filterTicketStatus}
                onChange={(e) => setFilterTicketStatus(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-xl border cursor-pointer transition-all text-xs space-y-2 ${
                    selectedTicket?.id === t.id
                      ? 'border-blue-600 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'HIGH'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{t.subject}</p>
                  <p className="text-gray-500 text-[11px] truncate">{t.customerName}</p>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between text-[10px] text-gray-400">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{t.status}</span>
                    <span>{t.createdAt.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Detail & Thread */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5 text-xs text-gray-900 dark:text-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {selectedTicket.ticketNumber}
                      </span>
                      <h2 className="font-bold text-base text-gray-900 dark:text-white">
                        {selectedTicket.subject}
                      </h2>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail})
                      {selectedTicket.orderNumber && ` · Order: ${selectedTicket.orderNumber}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.assignedStaff}
                      onChange={(e) => handleAssignTicketStaff(selectedTicket.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-medium"
                    >
                      {STAFF_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleTicketStatusChange(selectedTicket.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-bold text-emerald-600"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                  {selectedTicket.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl max-w-[85%] space-y-1 ${
                        m.sender === 'STAFF'
                          ? 'ml-auto bg-blue-600 text-white rounded-tr-none'
                          : 'bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-gray-100 rounded-tl-none'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] opacity-80 pb-1">
                        <span className="font-bold">{m.sender === 'STAFF' ? 'NextGen Support Staff' : selectedTicket.customerName}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSendTicketReply} className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <textarea
                    rows={3}
                    placeholder="Type official support reply to send to customer..."
                    value={ticketReplyText}
                    onChange={(e) => setTicketReplyText(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" /> Send Reply
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-16 text-center text-gray-400 text-xs">
                Select a ticket from the left column to view message thread & reply.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CONTACT FORM MESSAGES */
        <div className="space-y-3">
          {contacts.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">{msg.subject}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{msg.name}</span>
                    <span>{msg.email}</span>
                    <span className="font-mono">{msg.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      msg.status === 'UNREAD'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {msg.status}
                  </span>
                  <span className="text-gray-400 text-[11px]">{msg.createdAt}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                {msg.message}
              </p>

              <div className="flex justify-end gap-2 pt-1">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  onClick={() => handleContactStatus(msg.id, 'REPLIED')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
