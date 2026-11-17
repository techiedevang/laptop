'use client';

import React, { useState } from 'react';
import {
  Megaphone, Plus, Check, Edit2, Trash2, Calendar, Eye,
  Power, Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface AnnouncementBanner {
  id: string;
  text: string;
  link?: string;
  linkLabel?: string;
  color: 'bg-blue-600' | 'bg-red-600' | 'bg-emerald-600' | 'bg-amber-500' | 'bg-purple-600';
  isEnabled: boolean;
  scheduledStart?: string;
  scheduledEnd?: string;
}

const INITIAL_BANNERS: AnnouncementBanner[] = [
  {
    id: 'b-1',
    text: '⚡ Diwali Fest: Extra ₹1,500 Instant Discount on all ThinkPad & Latitude laptops with coupon DIWALI1500',
    link: '/shop',
    linkLabel: 'Shop Sale',
    color: 'bg-blue-600',
    isEnabled: true,
  },
  {
    id: 'b-2',
    text: '📢 Bulk Order Alert: Special clearance pricing for startups & education institutions. Minimum 5 units.',
    link: '/bulk-order',
    linkLabel: 'Enquire Now',
    color: 'bg-purple-600',
    isEnabled: false,
    scheduledStart: '2024-12-01T00:00',
    scheduledEnd: '2024-12-15T23:59',
  },
  {
    id: 'b-3',
    text: '🚨 Cyclone Warning Delivery Notice: Shipments to coastal Andhra Pradesh may experience 24hr weather delays.',
    link: '/shipping-policy',
    linkLabel: 'Track Status',
    color: 'bg-amber-500',
    isEnabled: false,
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AnnouncementBanner[]>(INITIAL_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AnnouncementBanner | null>(null);

  const [formData, setFormData] = useState<Omit<AnnouncementBanner, 'id'>>({
    text: '',
    link: '/shop',
    linkLabel: 'Explore Now',
    color: 'bg-blue-600',
    isEnabled: true,
    scheduledStart: '',
    scheduledEnd: '',
  });

  const activeBanner = banners.find((b) => b.isEnabled);

  const handleToggle = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextState = !b.isEnabled;
          return { ...b, isEnabled: nextState };
        }
        // If enabling, disable others to keep one primary active bar
        return { ...b, isEnabled: false };
      })
    );
    toast.success('Active announcement bar updated');
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      text: '',
      link: '/shop',
      linkLabel: 'Shop Now',
      color: 'bg-blue-600',
      isEnabled: true,
      scheduledStart: '',
      scheduledEnd: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: AnnouncementBanner) => {
    setEditingBanner(banner);
    setFormData({
      text: banner.text,
      link: banner.link || '',
      linkLabel: banner.linkLabel || '',
      color: banner.color,
      isEnabled: banner.isEnabled,
      scheduledStart: banner.scheduledStart || '',
      scheduledEnd: banner.scheduledEnd || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      toast.error('Announcement text is required');
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBanner.id ? { ...b, ...formData } : b))
      );
      toast.success('Announcement updated');
    } else {
      const created: AnnouncementBanner = {
        ...formData,
        id: Math.random().toString(),
      };
      setBanners((prev) => [created, ...prev]);
      toast.success('New announcement banner created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this banner announcement?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Banner deleted');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-blue-600" /> Header Announcement Banners
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage the top promotional bar displayed across public storefront pages.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
        >
          <Plus className="h-4 w-4" /> Create Banner
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-500" /> Live Preview on Site
          </h3>
          <span className="text-xs text-gray-400">Renders at topmost edge of header</span>
        </div>

        {activeBanner ? (
          <div
            className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-semibold flex items-center justify-between shadow-md transition-colors ${activeBanner.color}`}
          >
            <span className="truncate">{activeBanner.text}</span>
            {activeBanner.link && (
              <span className="ml-3 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-[11px] font-bold underline flex-shrink-0">
                {activeBanner.linkLabel || 'Click Here'} →
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-xs text-gray-400">
            No announcement banner is currently active. Storefront header is clean.
          </div>
        )}
      </div>

      {/* Banners List */}
      <div className="space-y-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 shadow-sm space-y-3 text-xs transition-all ${
              banner.isEnabled
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${banner.color}`} />
                <p className="font-bold text-sm text-gray-900 dark:text-white">{banner.text}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(banner.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    banner.isEnabled
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  {banner.isEnabled ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="p-1.5 text-gray-400 hover:text-amber-600"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700 text-[11px]">
              {banner.link && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> Link: {banner.link} ({banner.linkLabel})
                </span>
              )}
              {banner.scheduledStart && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Scheduled: {banner.scheduledStart.slice(0, 10)} to {banner.scheduledEnd?.slice(0, 10) || 'Indefinite'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editingBanner ? 'Edit Announcement Banner' : 'Create New Announcement'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Announcement Message *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Free Laptop Backpack + Wireless Mouse on orders above ₹30,000!"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formData.linkLabel}
                    onChange={(e) => setFormData({ ...formData, linkLabel: e.target.value })}
                    placeholder="e.g. Claim Now"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Target URL</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="e.g. /shop or /bulk-order"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Background Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'bg-blue-600', label: 'Blue' },
                    { key: 'bg-emerald-600', label: 'Green' },
                    { key: 'bg-amber-500', label: 'Orange' },
                    { key: 'bg-red-600', label: 'Red' },
                    { key: 'bg-purple-600', label: 'Purple' },
                  ].map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: col.key as any })}
                      className={`py-2 rounded-lg text-white font-bold text-center text-[10px] ${col.key} ${
                        formData.color === col.key ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'opacity-80'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Schedule Start</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Schedule End</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledEnd}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Set as Active Announcement Bar Immediately
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Save Announcement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
