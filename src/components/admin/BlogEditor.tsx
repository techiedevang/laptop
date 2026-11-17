'use client';

import React, { useState } from 'react';
import {
  FileText, Image as ImageIcon, Calendar, Eye, Save, X, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  views?: number;
}

interface BlogEditorProps {
  initialData?: BlogPostData;
  onSave: (data: BlogPostData) => void;
  onCancel: () => void;
}

export function BlogEditor({ initialData, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Buying Guide');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(
    initialData?.content ||
      '## Introduction\nRefurbished enterprise laptops offer up to 70% cost savings compared to brand-new units while maintaining MIL-SPEC durability.\n\n### What to Check Before Buying:\n1. Battery health cycle count\n2. Genuine OEM thermal paste\n3. Display backlight bleeding'
  );
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage ||
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'
  );
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [previewTab, setPreviewTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Title and slug are required');
      return;
    }

    onSave({
      id: initialData?.id,
      title,
      slug,
      category,
      excerpt,
      content,
      featuredImage,
      isPublished,
      scheduledAt: scheduledAt || undefined,
      publishedAt: isPublished ? (initialData?.publishedAt || new Date().toISOString().slice(0, 10)) : undefined,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      views: initialData?.views ?? 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs text-gray-900 dark:text-gray-100">
      {/* Basic Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FileText className="h-4 w-4 text-blue-500" /> Post Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Blog Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. 5 Things to Inspect When Buying a Refurbished ThinkPad"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">URL Slug *</label>
            <input
              type="text"
              required
              placeholder="e.g. refurbished-thinkpad-buying-guide"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            >
              <option value="Buying Guide">Buying Guide</option>
              <option value="Hardware Maintenance">Hardware Maintenance</option>
              <option value="B2B Procurement">B2B Procurement</option>
              <option value="Company News">Company News</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Featured Image URL</label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Schedule Publish Date</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Short Excerpt / Summary</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short punchy summary for the blog card preview..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
          />
        </div>
      </div>

      {/* Rich Editor / Markdown Preview */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" /> Content Editor
          </span>
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setPreviewTab('EDIT')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                previewTab === 'EDIT' ? 'bg-white dark:bg-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('PREVIEW')}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                previewTab === 'PREVIEW' ? 'bg-white dark:bg-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {previewTab === 'EDIT' ? (
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 font-mono text-xs leading-relaxed"
          />
        ) : (
          <div className="min-h-[260px] p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none text-xs whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>

      {/* SEO Optimization */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">SEO & Social Meta Tags</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Defaults to post title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Meta Description</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Defaults to excerpt"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Publish Toggle & Save Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600"
          />
          <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">
            {isPublished ? 'Publicly Published' : 'Save as Draft'}
          </span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Save Post
          </button>
        </div>
      </div>
    </form>
  );
}
