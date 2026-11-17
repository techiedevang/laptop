'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import {
  Package, TrendingUp, ShoppingBag, AlertTriangle, DollarSign,
  Calendar, Users, Video, Plus, Eye, FileText, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

// --- Mock Data ---
const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `Nov ${i + 1}`,
  revenue: Math.floor(Math.random() * 80000) + 20000,
}));

const orderStatusData = [
  { name: 'Delivered', value: 42, color: '#22c55e' },
  { name: 'Shipped', value: 18, color: '#3b82f6' },
  { name: 'Pending', value: 10, color: '#f59e0b' },
  { name: 'Cancelled', value: 5, color: '#ef4444' },
  { name: 'Returned', value: 3, color: '#8b5cf6' },
];

const topLaptopsData = [
  { model: 'ThinkPad T14', sold: 24 },
  { model: 'HP EliteBook 840', sold: 19 },
  { model: 'Dell Latitude 5490', sold: 15 },
  { model: 'MacBook Pro 2020', sold: 12 },
  { model: 'Lenovo IdeaPad 3', sold: 9 },
];

const recentOrders = [
  { id: 'ORD-1021', customer: 'Ravi K.', date: '15 Nov', items: 2, total: '₹68,500', status: 'Shipped', payment: 'Paid' },
  { id: 'ORD-1020', customer: 'Priya S.', date: '15 Nov', items: 1, total: '₹32,000', status: 'Pending', payment: 'Paid' },
  { id: 'ORD-1019', customer: 'Amit D.', date: '14 Nov', items: 1, total: '₹45,000', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-1018', customer: 'Sunita R.', date: '14 Nov', items: 3, total: '₹1,20,000', status: 'Confirmed', payment: 'Partial' },
  { id: 'ORD-1017', customer: 'Deepak M.', date: '13 Nov', items: 1, total: '₹28,000', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-1016', customer: 'Neha P.', date: '13 Nov', items: 2, total: '₹55,000', status: 'Cancelled', payment: 'Refunded' },
  { id: 'ORD-1015', customer: 'Rahul V.', date: '12 Nov', items: 1, total: '₹39,500', status: 'Shipped', payment: 'Paid' },
  { id: 'ORD-1014', customer: 'Meera J.', date: '12 Nov', items: 4, total: '₹1,65,000', status: 'Packed', payment: 'Paid' },
  { id: 'ORD-1013', customer: 'Kiran T.', date: '11 Nov', items: 1, total: '₹22,000', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-1012', customer: 'Ananya B.', date: '11 Nov', items: 2, total: '₹78,000', status: 'Delivered', payment: 'Paid' },
];

const lowStockAlerts = [
  { model: 'HP ProBook 450', sku: 'HP-PB-450-A', available: 1, grade: 'A' },
  { model: 'Dell XPS 13', sku: 'DELL-XPS-13-B', available: 2, grade: 'B' },
  { model: 'Lenovo ThinkPad E14', sku: 'LEN-E14-A+', available: 1, grade: 'A+' },
];

const upcomingMeetings = [
  { customer: '98xxxx1234', laptop: 'ThinkPad T14', time: '11:00 AM', staff: 'Vikas R.' },
  { customer: '70xxxx9871', laptop: 'HP EliteBook', time: '2:30 PM', staff: 'Ananya S.' },
  { customer: '99xxxx4567', laptop: 'MacBook Pro', time: '4:00 PM', staff: 'Vikas R.' },
];

// --- Summary Card ---
function StatCard({
  icon, label, value, change, changeType, color,
}: {
  icon: React.ReactNode; label: string; value: string; change?: string; changeType?: 'up' | 'down'; color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex gap-4 items-start shadow-sm">
      <div className={`p-2.5 rounded-lg ${color} flex-shrink-0`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        {change && (
          <p className={`flex items-center gap-0.5 text-xs mt-1 ${changeType === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {change} vs last period
          </p>
        )}
      </div>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    Confirmed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    Packed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    Refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    Partial: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    Paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Package className="h-5 w-5 text-blue-600" />} label="Total Laptops" value="348" change="+12" changeType="up" color="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard icon={<Package className="h-5 w-5 text-green-600" />} label="In Stock" value="241" color="bg-green-50 dark:bg-green-900/30" />
        <StatCard icon={<ShoppingBag className="h-5 w-5 text-indigo-600" />} label="Sold Today" value="7" change="+3" changeType="up" color="bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} label="Low Stock Alerts" value="3" color="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard icon={<DollarSign className="h-5 w-5 text-emerald-600" />} label="Revenue This Month" value="₹18.4L" change="+22%" changeType="up" color="bg-emerald-50 dark:bg-emerald-900/30" />
        <StatCard icon={<ShoppingBag className="h-5 w-5 text-purple-600" />} label="Orders Today" value="12" change="+4" changeType="up" color="bg-purple-50 dark:bg-purple-900/30" />
        <StatCard icon={<Calendar className="h-5 w-5 text-sky-600" />} label="Orders This Month" value="184" change="+18" changeType="up" color="bg-sky-50 dark:bg-sky-900/30" />
        <StatCard icon={<Users className="h-5 w-5 text-rose-600" />} label="Pending Bulk Enquiries" value="6" color="bg-rose-50 dark:bg-rose-900/30" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <a href="/admin/inventory/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Laptop
        </a>
        <a href="/admin/orders" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
          <Eye className="h-4 w-4" /> View Orders
        </a>
        <a href="/admin/content/blogs/new" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
          <FileText className="h-4 w-4" /> New Blog Post
        </a>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Revenue — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 2, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status Pie */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={({ percent }: any) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600 dark:text-gray-300">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Laptops Bar Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Top 5 Selling Laptops</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topLaptopsData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
            <YAxis type="category" dataKey="model" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} width={130} />
            <Tooltip formatter={(v: any) => [v, 'Units Sold']} />
            <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  {['Order #', 'Customer', 'Date', 'Total', 'Status', 'Payment'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2.5 font-mono text-blue-600 dark:text-blue-400 text-xs">{order.id}</td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200">{order.customer}</td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 text-xs">{order.date}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{order.total}</td>
                    <td className="px-4 py-2.5">{statusBadge(order.status)}</td>
                    <td className="px-4 py-2.5">{statusBadge(order.payment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {lowStockAlerts.map((item) => (
                <div key={item.sku} className="px-4 py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.model}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.sku} · Grade {item.grade}</p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    {item.available} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" /> Today&apos;s Meetings
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {upcomingMeetings.map((m, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{m.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{m.laptop}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Staff: {m.staff}</p>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
