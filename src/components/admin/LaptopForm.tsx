'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload, X, Plus, Trash2, ArrowUp, ArrowDown, Check,
  Image as ImageIcon, Info, Sparkles, DollarSign, Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';

export const laptopSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(2, 'Model name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  grade: z.enum(['A_PLUS', 'A', 'B']),
  status: z.enum(['AVAILABLE', 'HIDDEN', 'SOLD', 'RESERVED']),
  warrantyMonths: z.coerce.number().min(1, 'Warranty duration required'),
  conditionNotes: z.string().optional(),
  // Pricing in rupees
  mrp: z.coerce.number().min(1, 'MRP is required'),
  sellingPrice: z.coerce.number().min(1, 'Selling price is required'),
  costPrice: z.coerce.number().min(0, 'Cost price is required'),
  gstRate: z.coerce.number().default(18),
  // Specs
  cpu: z.string().min(1, 'CPU spec is required'),
  ram: z.string().min(1, 'RAM spec is required'),
  storage: z.string().min(1, 'Storage spec is required'),
  display: z.string().min(1, 'Display spec is required'),
  gpu: z.string().default('Integrated Graphics'),
  os: z.string().default('Windows 11 Pro'),
  battery: z.string().default('Healthy (80%+ capacity)'),
  ports: z.array(z.object({ name: z.string(), value: z.string() })).default([]),
  // Bulk price tiers
  bulkPricing: z.array(
    z.object({
      minQty: z.coerce.number().min(2),
      maxQty: z.coerce.number().min(2),
      pricePerUnit: z.coerce.number().min(1),
    })
  ).default([]),
  // Description & SEO
  description: z.string().min(10, 'Description must be at least 10 characters'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type LaptopFormData = z.infer<typeof laptopSchema>;

export interface LaptopInitialData extends Partial<LaptopFormData> {
  id?: string;
  images?: { url: string; isPrimary: boolean }[];
}

interface LaptopFormProps {
  initialData?: LaptopInitialData;
  onSave: (data: LaptopFormData & { images: { url: string; isPrimary: boolean }[]; mrpPaise: number; sellingPricePaise: number; costPricePaise: number }) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function LaptopForm({ initialData, onSave, onCancel, isSaving = false }: LaptopFormProps) {
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>(
    initialData?.images || [
      { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=60', isPrimary: false },
    ]
  );

  const [imageUrlInput, setImageUrlInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LaptopFormData>({
    resolver: zodResolver(laptopSchema) as any,
    defaultValues: {
      brand: initialData?.brand || 'Dell',
      model: initialData?.model || '',
      sku: initialData?.sku || '',
      grade: initialData?.grade || 'A_PLUS',
      status: initialData?.status || 'AVAILABLE',
      warrantyMonths: initialData?.warrantyMonths ?? 12,
      conditionNotes: initialData?.conditionNotes || 'Minor signs of gentle usage, 100% tested and certified.',
      mrp: initialData?.mrp || 75000,
      sellingPrice: initialData?.sellingPrice || 24999,
      costPrice: initialData?.costPrice || 16500,
      gstRate: initialData?.gstRate || 18,
      cpu: initialData?.cpu || 'Intel Core i5-8350U (Quad Core, up to 3.6GHz)',
      ram: initialData?.ram || '16GB DDR4 2400MHz',
      storage: initialData?.storage || '512GB M.2 NVMe SSD',
      display: initialData?.display || '14.0" FHD (1920x1080) Anti-Glare IPS',
      gpu: initialData?.gpu || 'Intel UHD Graphics 620',
      os: initialData?.os || 'Windows 11 Pro 64-bit Genuine',
      battery: initialData?.battery || 'Original 60Wh, health > 85%',
      ports: initialData?.ports || [
        { name: 'USB', value: '3x USB 3.1 Type-A, 1x Thunderbolt 3' },
        { name: 'Display', value: '1x HDMI 1.4, 1x Type-C DisplayPort' },
        { name: 'Audio/Card', value: '3.5mm combo jack, MicroSD reader' },
      ],
      bulkPricing: initialData?.bulkPricing || [
        { minQty: 5, maxQty: 10, pricePerUnit: 23500 },
        { minQty: 11, maxQty: 50, pricePerUnit: 21999 },
      ],
      description: initialData?.description || '<p>The <strong>Dell Latitude 7490</strong> is a premium enterprise ultrabook engineered for high reliability and business productivity. Extensively inspected via our 40-step QA protocol.</p>',
      metaTitle: initialData?.metaTitle || 'Refurbished Dell Latitude 7490 | NextGen IT Hub',
      metaDescription: initialData?.metaDescription || 'Buy certified refurbished Dell Latitude 7490 laptop at ₹24,999 with 1 Year Warranty, Express Shipping & GST invoice.',
    },
  });

  const {
    fields: portFields,
    append: appendPort,
    remove: removePort,
  } = useFieldArray({ control, name: 'ports' });

  const {
    fields: bulkFields,
    append: appendBulk,
    remove: removeBulk,
  } = useFieldArray({ control, name: 'bulkPricing' });

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, { url: imageUrlInput.trim(), isPrimary: prev.length === 0 }]);
    setImageUrlInput('');
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const handleMoveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const onSubmit = (values: LaptopFormData) => {
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    // Convert INR to Paise on save
    const mrpPaise = Math.round(values.mrp * 100);
    const sellingPricePaise = Math.round(values.sellingPrice * 100);
    const costPricePaise = Math.round(values.costPrice * 100);

    onSave({
      ...values,
      images,
      mrpPaise,
      sellingPricePaise,
      costPricePaise,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
      {/* 1. Basic Information */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" /> Basic Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand *</label>
            <select
              {...register('brand')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="Dell">Dell</option>
              <option value="Lenovo">Lenovo</option>
              <option value="HP">HP</option>
              <option value="Apple">Apple</option>
              <option value="Asus">Asus</option>
              <option value="Acer">Acer</option>
              <option value="Microsoft">Microsoft Surface</option>
            </select>
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Model Name *</label>
            <input
              type="text"
              placeholder="e.g. Latitude 7490 Core i7"
              {...register('model')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">SKU / Code *</label>
            <input
              type="text"
              placeholder="e.g. NGH-DL-7490-A"
              {...register('sku')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Condition Grade *</label>
            <select
              {...register('grade')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="A_PLUS">Grade A+ (Flawless / Like New)</option>
              <option value="A">Grade A (Minor cosmetic marks)</option>
              <option value="B">Grade B (Normal usage wear, 100% functional)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stock Status *</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="AVAILABLE">AVAILABLE (Published)</option>
              <option value="HIDDEN">HIDDEN (Draft)</option>
              <option value="RESERVED">RESERVED (Under hold)</option>
              <option value="SOLD">SOLD OUT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Warranty (Months) *</label>
            <input
              type="number"
              {...register('warrantyMonths')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Condition Notes</label>
          <input
            type="text"
            placeholder="e.g. Battery health 91%, clean keyboard, no dents"
            {...register('conditionNotes')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2. Hardware Specs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Cpu className="h-4 w-4 text-purple-500" /> Hardware Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">CPU / Processor *</label>
            <input
              type="text"
              {...register('cpu')}
              placeholder="e.g. Intel Core i5 8th Gen"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.cpu && <p className="text-xs text-red-500 mt-1">{errors.cpu.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">RAM *</label>
            <input
              type="text"
              {...register('ram')}
              placeholder="e.g. 16GB DDR4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.ram && <p className="text-xs text-red-500 mt-1">{errors.ram.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Storage *</label>
            <input
              type="text"
              {...register('storage')}
              placeholder="e.g. 512GB NVMe SSD"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.storage && <p className="text-xs text-red-500 mt-1">{errors.storage.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Display *</label>
            <input
              type="text"
              {...register('display')}
              placeholder='e.g. 14" FHD IPS Anti-Glare'
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.display && <p className="text-xs text-red-500 mt-1">{errors.display.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GPU Graphics</label>
            <input
              type="text"
              {...register('gpu')}
              placeholder="e.g. Intel UHD 620"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Operating System</label>
            <input
              type="text"
              {...register('os')}
              placeholder="e.g. Windows 11 Pro Genuine"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dynamic Ports */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Ports & Connectivity Pairs</span>
            <button
              type="button"
              onClick={() => appendPort({ name: '', value: '' })}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Port Field
            </button>
          </div>
          {portFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                placeholder="Port Group (e.g. USB / Video)"
                {...register(`ports.${index}.name` as const)}
                className="w-1/3 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
              <input
                placeholder="Values (e.g. 2x USB 3.0, 1x HDMI)"
                {...register(`ports.${index}.value` as const)}
                className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => removePort(index)}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pricing, GST & Bulk Tiers */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-500" /> Pricing, Margins & Bulk Tiers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Original MRP (₹) *</label>
            <input
              type="number"
              {...register('mrp')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.mrp && <p className="text-xs text-red-500 mt-1">{errors.mrp.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹) *</label>
            <input
              type="number"
              {...register('sellingPrice')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-bold text-emerald-600 dark:text-emerald-400 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cost Price (₹, Internal) *</label>
            <input
              type="number"
              {...register('costPrice')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GST Rate (%)</label>
            <select
              {...register('gstRate')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="18">18% (Standard Electronics)</option>
              <option value="12">12%</option>
              <option value="0">0% (Exempt)</option>
            </select>
          </div>
        </div>

        {/* Bulk Pricing Tiers */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Bulk Quantity Pricing Tiers</span>
              <p className="text-[11px] text-gray-400">Discounted rates applied when B2B buyers purchase larger quantities.</p>
            </div>
            <button
              type="button"
              onClick={() => appendBulk({ minQty: 5, maxQty: 10, pricePerUnit: 22000 })}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Tier
            </button>
          </div>

          {bulkFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <label className="text-[10px] text-gray-500">Min Units</label>
                <input
                  type="number"
                  {...register(`bulkPricing.${index}.minQty` as const)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Max Units</label>
                <input
                  type="number"
                  {...register(`bulkPricing.${index}.maxQty` as const)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Unit Price (₹)</label>
                <input
                  type="number"
                  {...register(`bulkPricing.${index}.pricePerUnit` as const)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex justify-end pt-3 sm:pt-0">
                <button
                  type="button"
                  onClick={() => removeBulk(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Multi-Image Management */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-sky-500" /> Multi-Image Gallery
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload or specify image URLs. Drag or reorder to set showcase images. First image marked as primary will display in shop catalogs.
        </p>

        {/* Add URL Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste public image URL (or Cloudinary / S3 URL)..."
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Image
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative group rounded-xl overflow-hidden border-2 bg-gray-100 dark:bg-gray-900 transition-all ${
                img.isPrimary ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <img src={img.url} alt={`Laptop photo ${i + 1}`} className="w-full h-32 object-cover" />

              {img.isPrimary && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  PRIMARY
                </span>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => handleMoveImage(i, i - 1)}
                      className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowUp className="h-3.5 w-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={i === images.length - 1}
                      onClick={() => handleMoveImage(i, i + 1)}
                      className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    </button>
                  </div>

                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(i)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded"
                    >
                      Set Primary
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Description & Rich Content */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" /> Description & Rich Content
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Product Description (Supports HTML / Markdown) *
          </label>
          <textarea
            rows={5}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* 6. SEO Meta Fields */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">SEO & Search Optimization</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
            <input
              type="text"
              {...register('metaTitle')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meta Description</label>
            <textarea
              rows={2}
              {...register('metaDescription')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Laptop'}
        </button>
      </div>
    </form>
  );
}
