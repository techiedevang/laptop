'use client';

import React, { useState } from 'react';
import {
  Building2, Mail, Phone, Calendar, ArrowRight, CheckCircle2,
  XCircle, Plus, Send, FileText, ShoppingCart, User, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export type PipelineStage = 'NEW' | 'CONTACTED' | 'QUOTED' | 'NEGOTIATING' | 'CONVERTED' | 'LOST';

export interface BulkEnquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  pincode: string;
  quantity: number;
  budgetPerUnit?: number;
  requirements: string;
  stage: PipelineStage;
  createdAt: string;
  quote?: {
    quoteNumber: string;
    items: { model: string; qty: number; unitPrice: number }[];
    total: number;
    sentAt: string;
  };
}

const INITIAL_ENQUIRIES: BulkEnquiry[] = [
  {
    id: 'enq-1',
    companyName: 'Apex Tech Labs Pvt Ltd',
    contactPerson: 'Sandeep Malhotra',
    email: 'procurement@apextech.in',
    phone: '+91 9820192831',
    pincode: '400051',
    quantity: 25,
    budgetPerUnit: 26000,
    requirements: '25x Dell or ThinkPad laptops, min 16GB RAM, SSD, 1-year on-site warranty needed.',
    stage: 'NEW',
    createdAt: '15 Nov 2024',
  },
  {
    id: 'enq-2',
    companyName: 'Eduskill Academy',
    contactPerson: 'Kavita Menon',
    email: 'kavita@eduskill.org',
    phone: '+91 9445123990',
    pincode: '600036',
    quantity: 40,
    budgetPerUnit: 20000,
    requirements: 'Affordable laptops for computer training center batch. Durable keyboards required.',
    stage: 'CONTACTED',
    createdAt: '14 Nov 2024',
  },
  {
    id: 'enq-3',
    companyName: 'Vertex Outsourcing LLP',
    contactPerson: 'Rohan Mehra',
    email: 'rohan.m@vertexllp.com',
    phone: '+91 9811204859',
    pincode: '110020',
    quantity: 15,
    budgetPerUnit: 32000,
    requirements: '15 units HP EliteBook 840 G6 or similar. Need official GST B2B invoice.',
    stage: 'QUOTED',
    createdAt: '13 Nov 2024',
    quote: {
      quoteNumber: 'QT-2024-881',
      items: [{ model: 'HP EliteBook 840 G6 Aluminum Grade A', qty: 15, unitPrice: 30500 }],
      total: 457500,
      sentAt: '14 Nov 2024',
    },
  },
  {
    id: 'enq-4',
    companyName: 'Innovate BPO Services',
    contactPerson: 'Aditi Deshmukh',
    email: 'aditi@innovatebpo.com',
    phone: '+91 9765432190',
    pincode: '411014',
    quantity: 50,
    budgetPerUnit: 24000,
    requirements: 'Bulk call center batch. Dual battery Lenovo T480 preferred.',
    stage: 'NEGOTIATING',
    createdAt: '10 Nov 2024',
  },
  {
    id: 'enq-5',
    companyName: 'Greenfield Public School',
    contactPerson: 'Brother Joseph',
    email: 'principal@greenfield.edu.in',
    phone: '+91 9433019284',
    pincode: '700019',
    quantity: 30,
    budgetPerUnit: 22000,
    requirements: 'Laptops for senior teacher staff.',
    stage: 'CONVERTED',
    createdAt: '08 Nov 2024',
  },
];

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'NEW', label: 'New Lead', color: 'border-t-blue-500' },
  { key: 'CONTACTED', label: 'Contacted', color: 'border-t-amber-500' },
  { key: 'QUOTED', label: 'Quoted', color: 'border-t-purple-500' },
  { key: 'NEGOTIATING', label: 'Negotiating', color: 'border-t-indigo-500' },
  { key: 'CONVERTED', label: 'Converted 🎉', color: 'border-t-emerald-500' },
  { key: 'LOST', label: 'Lost / Closed', color: 'border-t-red-500' },
];

export default function BulkEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>(INITIAL_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState<BulkEnquiry | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote form state
  const [quoteItems, setQuoteItems] = useState([
    { model: 'Dell Latitude 7490 Core i7 Grade A+', qty: 10, unitPrice: 23500 },
  ]);

  const handleMoveStage = (id: string, stage: PipelineStage) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, stage } : e))
    );
    toast.success(`Enquiry moved to ${stage}`);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, stage });
    }
  };

  const handleSendQuote = () => {
    if (!selectedEnquiry) return;
    const total = quoteItems.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);
    const newQuote = {
      quoteNumber: `QT-${Date.now().toString().slice(-4)}`,
      items: quoteItems,
      total,
      sentAt: new Date().toLocaleDateString('en-IN'),
    };

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === selectedEnquiry.id ? { ...e, quote: newQuote, stage: 'QUOTED' } : e
      )
    );
    setSelectedEnquiry((prev) => (prev ? { ...prev, quote: newQuote, stage: 'QUOTED' } : null));
    setIsQuoteModalOpen(false);
    toast.success(`Official GST quotation sent via email to ${selectedEnquiry.email}`);
  };

  const handleConvertToOrder = (enquiry: BulkEnquiry) => {
    toast.success(`Enquiry converted to B2B Order for ${enquiry.companyName}!`);
    handleMoveStage(enquiry.id, 'CONVERTED');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" /> B2B Bulk Enquiries Pipeline
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage institutional orders, enterprise corporate refresh requests, GST quotations & conversions.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 min-h-[550px]">
        {STAGES.map((col) => {
          const colItems = enquiries.filter((e) => e.stage === col.key);
          return (
            <div
              key={col.key}
              className={`bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/60 flex flex-col border-t-4 ${col.color}`}
            >
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm">
                  {colItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEnquiry(item)}
                    className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {item.companyName}
                      </p>
                      <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {item.quantity} Qty
                      </span>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-[11px]">
                      {item.requirements}
                    </p>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{item.contactPerson}</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-xs text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" /> {selectedEnquiry.companyName}
                </h2>
                <p className="text-xs text-gray-500">Submitted on {selectedEnquiry.createdAt}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div>
                <span className="text-gray-500 block text-[11px]">Contact Person:</span>
                <span className="font-semibold text-sm">{selectedEnquiry.contactPerson}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Required Units:</span>
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {selectedEnquiry.quantity} Laptops
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Email Address:</span>
                <span className="font-mono">{selectedEnquiry.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Direct Phone:</span>
                <span className="font-mono">{selectedEnquiry.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Delivery PIN:</span>
                <span className="font-mono">{selectedEnquiry.pincode}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Target Unit Budget:</span>
                <span className="font-semibold">
                  {selectedEnquiry.budgetPerUnit
                    ? `₹${selectedEnquiry.budgetPerUnit.toLocaleString('en-IN')}`
                    : 'Not specified'}
                </span>
              </div>
            </div>

            {/* Requirement Details */}
            <div>
              <span className="font-bold block text-gray-700 dark:text-gray-300 mb-1">
                Requirement Specification:
              </span>
              <p className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                {selectedEnquiry.requirements}
              </p>
            </div>

            {/* Quotation Status */}
            {selectedEnquiry.quote ? (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Quote Sent: {selectedEnquiry.quote.quoteNumber}
                  </span>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                    Total: ₹{selectedEnquiry.quote.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-[11px]">
                  {selectedEnquiry.quote.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span>{it.qty}x {it.model}</span>
                      <span>₹{(it.qty * it.unitPrice).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Stage Selector & Actions */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Move Stage:</span>
                <select
                  value={selectedEnquiry.stage}
                  onChange={(e) => handleMoveStage(selectedEnquiry.id, e.target.value as PipelineStage)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-semibold"
                >
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow"
                >
                  <Send className="h-3.5 w-3.5" /> Create Quote
                </button>
                <button
                  type="button"
                  onClick={() => handleConvertToOrder(selectedEnquiry)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Convert to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {isQuoteModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" /> Prepare Quotation for {selectedEnquiry.companyName}
            </h3>

            <div className="space-y-3">
              {quoteItems.map((item, idx) => (
                <div key={idx} className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold">Laptop Model</label>
                    <input
                      type="text"
                      value={item.model}
                      onChange={(e) => {
                        const copy = [...quoteItems];
                        copy[idx].model = e.target.value;
                        setQuoteItems(copy);
                      }}
                      className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold">Quantity</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const copy = [...quoteItems];
                          copy[idx].qty = Number(e.target.value);
                          setQuoteItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold">Unit Price (₹)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const copy = [...quoteItems];
                          copy[idx].unitPrice = Number(e.target.value);
                          setQuoteItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-sm">
              <span>Total Estimated:</span>
              <span className="text-purple-600">
                ₹{quoteItems.reduce((acc, i) => acc + i.qty * i.unitPrice, 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendQuote}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow"
              >
                Send Quotation via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
