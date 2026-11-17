'use client';

import React, { useState } from 'react';
import {
  ShoppingCart, Search, Download, Filter, Eye, CheckCircle2,
  Truck, AlertCircle, Calendar, RefreshCw
} from 'lucide-react';
import { DataTable, Column, BulkAction } from '@/components/admin/DataTable';
import { OrderDetail, AdminOrderDetailData } from '@/components/admin/OrderDetail';
import toast from 'react-hot-toast';

export interface OrderRowItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhoneMasked: string;
  date: string;
  itemsSummary: string;
  total: number; // in INR
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
  fullOrder: AdminOrderDetailData;
}

const INITIAL_ORDERS: OrderRowItem[] = [
  {
    id: '1',
    orderNumber: 'NGH-ORD-9021',
    customerName: 'Deepak Verma',
    customerPhoneMasked: '+91 98xxxxxx10',
    date: '15 Nov 2024',
    itemsSummary: 'Dell Latitude 7490 (x1)',
    total: 24999,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    fullOrder: {
      id: '1',
      orderNumber: 'NGH-ORD-9021',
      createdAt: '15 Nov 2024, 10:45 AM',
      customer: {
        name: 'Deepak Verma',
        email: 'deepak.verma@example.com',
        phoneMasked: '+91 98xxxxxx10',
        phoneFull: '+91 9876543210',
        shippingAddress: {
          line1: 'Flat 402, Sunshine Heights, Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
        },
      },
      items: [
        {
          id: 'item-1',
          sku: 'NGH-DL-7490-A',
          model: 'Dell Latitude 7490 Core i7 (Grade A+)',
          image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60',
          quantity: 1,
          unitPrice: 24999,
        },
      ],
      pricing: {
        subtotal: 21185,
        discount: 0,
        cgst: 1907,
        sgst: 1907,
        igst: 0,
        shipping: 0,
        total: 24999,
      },
      payment: {
        method: 'RAZORPAY',
        status: 'PAID',
        razorpayPaymentId: 'pay_Or9B8Z2hQ0x1Nm',
        razorpayOrderId: 'order_Or9B172h309K',
      },
      status: 'SHIPPED',
      tracking: {
        carrier: 'Delhivery Express',
        trackingNumber: 'DEL-9928192019',
      },
    },
  },
  {
    id: '2',
    orderNumber: 'NGH-ORD-9020',
    customerName: 'Ananya Roy (Infotech Solutions)',
    customerPhoneMasked: '+91 91xxxxxx44',
    date: '14 Nov 2024',
    itemsSummary: 'HP EliteBook 840 (x5)',
    total: 159995,
    status: 'PACKED',
    paymentStatus: 'PAID',
    fullOrder: {
      id: '2',
      orderNumber: 'NGH-ORD-9020',
      createdAt: '14 Nov 2024, 02:30 PM',
      customer: {
        name: 'Ananya Roy',
        email: 'ananya@infotechsolutions.in',
        phoneMasked: '+91 91xxxxxx44',
        phoneFull: '+91 9123456744',
        gstin: '29AABCU9603R1Z2',
        shippingAddress: {
          line1: 'Unit 5B, Mindspace IT Park, Hitec City',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
        },
      },
      items: [
        {
          id: 'item-2',
          sku: 'NGH-HP-840G6',
          model: 'HP EliteBook 840 G6 Aluminum (Grade A)',
          image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&auto=format&fit=crop&q=60',
          quantity: 5,
          unitPrice: 31999,
        },
      ],
      pricing: {
        subtotal: 135589,
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 24406,
        shipping: 0,
        total: 159995,
      },
      payment: {
        method: 'BANK_TRANSFER',
        status: 'PAID',
        razorpayPaymentId: 'NEFT_AXIS_998124',
      },
      status: 'PACKED',
      tracking: {
        carrier: 'BlueDart Air',
        trackingNumber: 'Pending Dispatch',
      },
    },
  },
  {
    id: '3',
    orderNumber: 'NGH-ORD-9019',
    customerName: 'Vikram Joshi',
    customerPhoneMasked: '+91 99xxxxxx88',
    date: '14 Nov 2024',
    itemsSummary: 'Apple MacBook Air M1 (x1)',
    total: 52999,
    status: 'PLACED',
    paymentStatus: 'PAID',
    fullOrder: {
      id: '3',
      orderNumber: 'NGH-ORD-9019',
      createdAt: '14 Nov 2024, 07:15 PM',
      customer: {
        name: 'Vikram Joshi',
        email: 'vikram.j@gmail.com',
        phoneMasked: '+91 99xxxxxx88',
        shippingAddress: {
          line1: 'B-12, Sector 14',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
        },
      },
      items: [
        {
          id: 'item-3',
          sku: 'NGH-AP-M1AIR',
          model: 'Apple MacBook Air M1 Space Grey (Grade A+)',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=60',
          quantity: 1,
          unitPrice: 52999,
        },
      ],
      pricing: {
        subtotal: 44914,
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 8085,
        shipping: 0,
        total: 52999,
      },
      payment: {
        method: 'RAZORPAY',
        status: 'PAID',
        razorpayPaymentId: 'pay_Pw77A82hQ0x2Vv',
      },
      status: 'PLACED',
    },
  },
  {
    id: '4',
    orderNumber: 'NGH-ORD-9018',
    customerName: 'Rahul Sharma',
    customerPhoneMasked: '+91 87xxxxxx55',
    date: '13 Nov 2024',
    itemsSummary: 'Lenovo ThinkPad T480 (x1)',
    total: 26499,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    fullOrder: {
      id: '4',
      orderNumber: 'NGH-ORD-9018',
      createdAt: '13 Nov 2024, 11:20 AM',
      customer: {
        name: 'Rahul Sharma',
        email: 'rahul.s@outlook.com',
        phoneMasked: '+91 87xxxxxx55',
        shippingAddress: {
          line1: 'House 55, Model Town',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110009',
        },
      },
      items: [
        {
          id: 'item-4',
          sku: 'NGH-LN-T480-A',
          model: 'Lenovo ThinkPad T480 Dual Battery',
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&auto=format&fit=crop&q=60',
          quantity: 1,
          unitPrice: 26499,
        },
      ],
      pricing: {
        subtotal: 22457,
        discount: 0,
        cgst: 2021,
        sgst: 2021,
        igst: 0,
        shipping: 0,
        total: 26499,
      },
      payment: {
        method: 'COD',
        status: 'PAID',
      },
      status: 'DELIVERED',
      tracking: {
        carrier: 'Delhivery Express',
        trackingNumber: 'DEL-8877119922',
      },
    },
  },
  {
    id: '5',
    orderNumber: 'NGH-ORD-9017',
    customerName: 'Priya Mehra',
    customerPhoneMasked: '+91 93xxxxxx12',
    date: '12 Nov 2024',
    itemsSummary: 'Dell Latitude 5400 (x1)',
    total: 21999,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    fullOrder: {
      id: '5',
      orderNumber: 'NGH-ORD-9017',
      createdAt: '12 Nov 2024, 04:00 PM',
      customer: {
        name: 'Priya Mehra',
        email: 'priya.m@yahoo.com',
        phoneMasked: '+91 93xxxxxx12',
        shippingAddress: {
          line1: 'Sector 62',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201309',
        },
      },
      items: [
        {
          id: 'item-5',
          sku: 'NGH-DL-5400-B',
          model: 'Dell Latitude 5400 Notebook',
          image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60',
          quantity: 1,
          unitPrice: 21999,
        },
      ],
      pricing: {
        subtotal: 18643,
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 3356,
        shipping: 0,
        total: 21999,
      },
      payment: {
        method: 'RAZORPAY',
        status: 'REFUNDED',
      },
      status: 'CANCELLED',
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRowItem[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<AdminOrderDetailData | null>(null);

  // Filtering
  const filtered = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (filterPayment !== 'ALL' && o.paymentStatus !== filterPayment) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.itemsSummary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleStatusChangeInline = (id: string, newStatus: OrderRowItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus, fullOrder: { ...o.fullOrder, status: newStatus } } : o))
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleBulkStatusUpdate = (ids: string[], newStatus: OrderRowItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (ids.includes(o.id) ? { ...o, status: newStatus, fullOrder: { ...o.fullOrder, status: newStatus } } : o))
    );
    toast.success(`Updated ${ids.length} orders to ${newStatus}`);
  };

  const handleExportCSV = (ids?: string[]) => {
    const exportItems = ids && ids.length > 0 ? orders.filter((o) => ids.includes(o.id)) : filtered;
    const headers = ['Order Number', 'Customer Name', 'Date', 'Items', 'Total (INR)', 'Status', 'Payment Status'];
    const rows = exportItems.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.customerName}"`,
      `"${o.date}"`,
      `"${o.itemsSummary}"`,
      o.total,
      o.status,
      o.paymentStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NextGen_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${exportItems.length} orders to CSV`);
  };

  const columns: Column<OrderRowItem>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      sortable: true,
      render: (_, row) => (
        <button
          onClick={() => setSelectedOrderDetail(row.fullOrder)}
          className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.orderNumber}
        </button>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.customerName}</p>
          <p className="text-[11px] font-mono text-gray-400">{row.customerPhoneMasked}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (_, row) => <span className="text-xs text-gray-500">{row.date}</span>,
    },
    {
      key: 'itemsSummary',
      header: 'Items',
      render: (_, row) => <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{row.itemsSummary}</span>,
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: (_, row) => (
        <span className="font-bold text-gray-900 dark:text-white">
          ₹{row.total.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (_, row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChangeInline(row.id, e.target.value as any)}
          className="text-xs font-semibold py-1 px-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
        >
          <option value="PLACED">PLACED</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PACKED">PACKED</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      sortable: true,
      render: (_, row) => {
        const color =
          row.paymentStatus === 'PAID'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
            : row.paymentStatus === 'REFUNDED'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
        return <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${color}`}>{row.paymentStatus}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <button
          onClick={() => setSelectedOrderDetail(row.fullOrder)}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1 ml-auto"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: 'Mark Packed',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      onClick: (ids) => handleBulkStatusUpdate(ids, 'PACKED'),
    },
    {
      label: 'Mark Shipped',
      icon: <Truck className="h-3.5 w-3.5" />,
      onClick: (ids) => handleBulkStatusUpdate(ids, 'SHIPPED'),
    },
    {
      label: 'Export CSV',
      icon: <Download className="h-3.5 w-3.5" />,
      onClick: handleExportCSV,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-blue-600" /> Orders Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Process customer orders, print shipping labels, assign courier AWBs, and issue GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-medium">Payment:</span>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> orders
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filtered}
        bulkActions={bulkActions}
        pageSize={10}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder="Search order #, customer, or laptop item..."
      />

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <OrderDetail
          order={selectedOrderDetail}
          onClose={() => setSelectedOrderDetail(null)}
          onUpdateStatus={(orderId, newStatus, reason) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? { ...o, status: newStatus, fullOrder: { ...o.fullOrder, status: newStatus } }
                  : o
              )
            );
            setSelectedOrderDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
          }}
          onUpdateTracking={(orderId, carrier, trNum) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? {
                      ...o,
                      fullOrder: {
                        ...o.fullOrder,
                        tracking: { carrier, trackingNumber: trNum },
                      },
                    }
                  : o
              )
            );
          }}
        />
      )}
    </div>
  );
}
