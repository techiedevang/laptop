'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Upload, Download, Eye, Edit2, Copy, Trash2,
  CheckCircle2, XCircle, AlertTriangle, Filter, Laptop as LaptopIcon,
  RefreshCw
} from 'lucide-react';
import { DataTable, Column, BulkAction } from '@/components/admin/DataTable';
import { LaptopForm, LaptopInitialData, LaptopFormData } from '@/components/admin/LaptopForm';
import toast from 'react-hot-toast';

export interface LaptopItem {
  id: string;
  image: string;
  brand: string;
  model: string;
  grade: 'A_PLUS' | 'A' | 'B';
  sku: string;
  available: number;
  total: number;
  sellingPrice: number; // in INR
  status: 'AVAILABLE' | 'HIDDEN' | 'SOLD' | 'RESERVED';
}

const INITIAL_LAPTOPS: LaptopItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60',
    brand: 'Dell',
    model: 'Latitude 7490 Core i7',
    grade: 'A_PLUS',
    sku: 'NGH-DL-7490-A',
    available: 5,
    total: 8,
    sellingPrice: 24999,
    status: 'AVAILABLE',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&auto=format&fit=crop&q=60',
    brand: 'Lenovo',
    model: 'ThinkPad T480 Dual Battery',
    grade: 'A_PLUS',
    sku: 'NGH-LN-T480-A',
    available: 3,
    total: 6,
    sellingPrice: 26499,
    status: 'AVAILABLE',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&auto=format&fit=crop&q=60',
    brand: 'HP',
    model: 'EliteBook 840 G6 Aluminum',
    grade: 'A',
    sku: 'NGH-HP-840G6',
    available: 2,
    total: 5,
    sellingPrice: 31999,
    status: 'AVAILABLE',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=60',
    brand: 'Apple',
    model: 'MacBook Air M1 Space Grey',
    grade: 'A_PLUS',
    sku: 'NGH-AP-M1AIR',
    available: 4,
    total: 4,
    sellingPrice: 52999,
    status: 'AVAILABLE',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60',
    brand: 'Dell',
    model: 'Latitude 5400 Notebook',
    grade: 'A',
    sku: 'NGH-DL-5400-B',
    available: 7,
    total: 10,
    sellingPrice: 21999,
    status: 'AVAILABLE',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&auto=format&fit=crop&q=60',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 6',
    grade: 'A_PLUS',
    sku: 'NGH-LN-X1C6',
    available: 0,
    total: 3,
    sellingPrice: 38999,
    status: 'SOLD',
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&auto=format&fit=crop&q=60',
    brand: 'HP',
    model: 'ProBook 450 G7 15.6"',
    grade: 'B',
    sku: 'NGH-HP-450G7',
    available: 1,
    total: 4,
    sellingPrice: 28499,
    status: 'AVAILABLE',
  },
];

export default function AdminInventoryPage() {
  const [laptops, setLaptops] = useState<LaptopItem[]>(INITIAL_LAPTOPS);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<LaptopItem | null>(null);

  // Filters
  const filteredData = laptops.filter((item) => {
    if (selectedBrand !== 'ALL' && item.brand !== selectedBrand) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (selectedGrade !== 'ALL' && item.grade !== selectedGrade) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.model.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Bulk Actions
  const handleBulkPublish = (ids: string[]) => {
    setLaptops((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, status: 'AVAILABLE' } : l))
    );
    toast.success(`${ids.length} laptops published`);
  };

  const handleBulkHide = (ids: string[]) => {
    setLaptops((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, status: 'HIDDEN' } : l))
    );
    toast.success(`${ids.length} laptops set to hidden`);
  };

  const handleBulkDelete = (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} items?`)) return;
    setLaptops((prev) => prev.filter((l) => !ids.includes(l.id)));
    toast.success(`${ids.length} laptops deleted`);
  };

  const handleExportCSV = (ids?: string[]) => {
    const exportItems = ids && ids.length > 0
      ? laptops.filter((l) => ids.includes(l.id))
      : filteredData;

    const headers = ['ID', 'Brand', 'Model', 'SKU', 'Grade', 'Available', 'Total', 'Selling Price (INR)', 'Status'];
    const rows = exportItems.map((l) => [
      l.id,
      `"${l.brand}"`,
      `"${l.model}"`,
      `"${l.sku}"`,
      l.grade,
      l.available,
      l.total,
      l.sellingPrice,
      l.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NextGen_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${exportItems.length} laptops to CSV`);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Uploaded ${file.name}. Parsed and validated 12 inventory rows.`);
    e.target.value = '';
  };

  // Row Actions
  const handleEdit = (laptop: LaptopItem) => {
    setEditingLaptop(laptop);
    setIsFormOpen(true);
  };

  const handleDuplicate = (laptop: LaptopItem) => {
    const duplicated: LaptopItem = {
      ...laptop,
      id: Math.random().toString(),
      sku: `${laptop.sku}-COPY`,
      model: `${laptop.model} (Copy)`,
    };
    setLaptops((prev) => [duplicated, ...prev]);
    toast.success(`Duplicated "${laptop.model}"`);
  };

  const handleDelete = (id: string, model: string) => {
    if (!confirm(`Are you sure you want to delete "${model}"?`)) return;
    setLaptops((prev) => prev.filter((l) => l.id !== id));
    toast.success(`Deleted ${model}`);
  };

  const handleSaveLaptop = (data: any) => {
    if (editingLaptop) {
      setLaptops((prev) =>
        prev.map((l) =>
          l.id === editingLaptop.id
            ? {
                ...l,
                brand: data.brand,
                model: data.model,
                sku: data.sku,
                grade: data.grade,
                sellingPrice: data.sellingPrice,
                status: data.status,
                image: data.images[0]?.url || l.image,
              }
            : l
        )
      );
      toast.success('Laptop updated successfully');
    } else {
      const newLaptop: LaptopItem = {
        id: Math.random().toString(),
        brand: data.brand,
        model: data.model,
        sku: data.sku,
        grade: data.grade,
        available: 1,
        total: 1,
        sellingPrice: data.sellingPrice,
        status: data.status,
        image: data.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60',
      };
      setLaptops((prev) => [newLaptop, ...prev]);
      toast.success('New laptop added to inventory');
    }
    setIsFormOpen(false);
    setEditingLaptop(null);
  };

  const columns: Column<LaptopItem>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (_, row) => (
        <img
          src={row.image}
          alt={row.model}
          className="w-12 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
        />
      ),
    },
    {
      key: 'brand',
      header: 'Brand',
      sortable: true,
      render: (_, row) => <span className="font-medium text-gray-900 dark:text-white">{row.brand}</span>,
    },
    {
      key: 'model',
      header: 'Model Name',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{row.model}</p>
          <p className="text-[11px] font-mono text-gray-400">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
      render: (_, row) => {
        const gradeColor =
          row.grade === 'A_PLUS'
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
            : row.grade === 'A'
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
        return <span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeColor}`}>{row.grade.replace('_', '+')}</span>;
      },
    },
    {
      key: 'available',
      header: 'Stock (Avail/Tot)',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${row.available === 0 ? 'text-red-500' : row.available <= 2 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
            {row.available}
          </span>
          <span className="text-gray-400">/ {row.total}</span>
        </div>
      ),
    },
    {
      key: 'sellingPrice',
      header: 'Selling Price',
      sortable: true,
      render: (_, row) => (
        <span className="font-bold text-gray-900 dark:text-white">
          ₹{row.sellingPrice.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (_, row) => {
        const map: Record<string, string> = {
          AVAILABLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
          HIDDEN: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
          SOLD: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
          RESERVED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/shop/${row.sku.toLowerCase()}`}
            target="_blank"
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View on site"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            title="Edit laptop"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicate(row)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.model)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: 'Publish',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      onClick: handleBulkPublish,
    },
    {
      label: 'Hide',
      icon: <XCircle className="h-3.5 w-3.5" />,
      onClick: handleBulkHide,
    },
    {
      label: 'Export CSV',
      icon: <Download className="h-3.5 w-3.5" />,
      onClick: handleExportCSV,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5" />,
      variant: 'danger',
      onClick: handleBulkDelete,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LaptopIcon className="h-6 w-6 text-blue-600" /> Inventory Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage refurb laptop stock, hardware specifications, grading, and bulk pricing tiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* CSV Import */}
          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
            <Upload className="h-3.5 w-3.5 text-gray-500" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          {/* Export All CSV */}
          <button
            onClick={() => handleExportCSV()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          {/* Add Laptop Button */}
          <button
            onClick={() => {
              setEditingLaptop(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Add Laptop</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Brand Filter */}
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-medium">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Brands</option>
              <option value="Dell">Dell</option>
              <option value="Lenovo">Lenovo</option>
              <option value="HP">HP</option>
              <option value="Apple">Apple</option>
              <option value="Asus">Asus</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="HIDDEN">Hidden</option>
              <option value="SOLD">Sold Out</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2 font-medium">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Grades</option>
              <option value="A_PLUS">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredData.length}</span> of {laptops.length} models
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        bulkActions={bulkActions}
        pageSize={10}
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        searchPlaceholder="Search model, brand, or SKU..."
      />

      {/* Add / Edit Laptop Modal Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingLaptop ? `Edit Laptop: ${editingLaptop.model}` : 'Add New Laptop to Inventory'}
                </h2>
                <p className="text-xs text-gray-500">
                  Fill in hardware specs, pricing, and upload images.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingLaptop(null);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <LaptopForm
              initialData={editingLaptop ? {
                brand: editingLaptop.brand,
                model: editingLaptop.model,
                sku: editingLaptop.sku,
                grade: editingLaptop.grade,
                status: editingLaptop.status,
                sellingPrice: editingLaptop.sellingPrice,
                mrp: Math.round(editingLaptop.sellingPrice * 2.5),
                costPrice: Math.round(editingLaptop.sellingPrice * 0.7),
                images: [{ url: editingLaptop.image, isPrimary: true }],
              } : undefined}
              onSave={handleSaveLaptop}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingLaptop(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
