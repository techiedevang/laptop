'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Plus, Eye, Edit2, Trash2, Calendar, CheckCircle2,
  XCircle, Clock, ExternalLink
} from 'lucide-react';
import { BlogEditor, BlogPostData } from '@/components/admin/BlogEditor';
import toast from 'react-hot-toast';

const INITIAL_BLOGS: BlogPostData[] = [
  {
    id: 'b-1',
    title: 'Top 5 ThinkPad Models for Coders & Software Engineers in 2024',
    slug: 'top-thinkpads-for-programmers',
    category: 'Buying Guide',
    excerpt: 'Detailed comparison of T14, X1 Carbon, and T480 keyboards and Linux compatibility.',
    content: 'Full comprehensive review of ThinkPad models with thermals, RAM upgradability, and dual battery runtime.',
    featuredImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=60',
    isPublished: true,
    publishedAt: '12 Nov 2024',
    views: 1420,
  },
  {
    id: 'b-2',
    title: 'Why Refurbished Enterprise Laptops Outlast Cheap Consumer Laptops',
    slug: 'refurbished-enterprise-vs-consumer',
    category: 'Buying Guide',
    excerpt: 'Magnesium alloys vs plastic cases: understand what MIL-STD 810G certification means.',
    content: 'Enterprise grade laptops undergo military drop testing, moisture resistance, and 24/7 reliability stress tests.',
    featuredImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60',
    isPublished: true,
    publishedAt: '05 Nov 2024',
    views: 2890,
  },
  {
    id: 'b-3',
    title: 'How to Calibrate and Maximize Refurbished Laptop Battery Life',
    slug: 'how-to-calibrate-laptop-battery',
    category: 'Hardware Maintenance',
    excerpt: 'Simple steps to reset battery gauge and optimize Windows power plans for extra hours.',
    content: 'Battery calibration cycle instructions for Lenovo Vantage and Dell Power Manager.',
    featuredImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60',
    isPublished: false,
    scheduledAt: '2024-11-20T10:00',
    views: 0,
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPostData[]>(INITIAL_BLOGS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);

  const handleTogglePublish = (id?: string) => {
    if (!id) return;
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isPublished: !b.isPublished,
              publishedAt: !b.isPublished ? new Date().toISOString().slice(0, 10) : b.publishedAt,
            }
          : b
      )
    );
    toast.success('Publication status changed');
  };

  const handleDelete = (id?: string) => {
    if (!id || !confirm('Are you sure you want to delete this blog post?')) return;
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success('Post deleted');
  };

  const handleSavePost = (data: BlogPostData) => {
    if (editingPost) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === editingPost.id ? { ...data, id: editingPost.id } : b))
      );
      toast.success('Post updated');
    } else {
      const newPost: BlogPostData = {
        ...data,
        id: Math.random().toString(),
        views: 0,
      };
      setBlogs((prev) => [newPost, ...prev]);
      toast.success('New blog post created');
    }
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" /> Blog & Editorial Articles
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Publish educational articles, refurb laptop buying guides, and technical tutorials for SEO ranking.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPost(null);
            setIsEditorOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
        >
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Published / Schedule</th>
                <th className="py-3.5 px-4 text-center">Views</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {blogs.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-12 h-9 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                        <p className="text-[11px] font-mono text-gray-400">/{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-gray-700 dark:text-gray-300">
                    {post.category}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-opacity hover:opacity-80 ${
                        post.isPublished
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : post.scheduledAt
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {post.isPublished ? 'Published' : post.scheduledAt ? 'Scheduled' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500">
                    {post.publishedAt || (post.scheduledAt ? `Scheduled: ${post.scheduledAt.slice(0, 10)}` : '—')}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-gray-700 dark:text-gray-300">
                    {post.views?.toLocaleString('en-IN') ?? 0}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-blue-600 inline-block"
                      title="Preview live"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setIsEditorOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-amber-600"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingPost ? `Edit Article: ${editingPost.title}` : 'Write New Blog Article'}
              </h2>
              <button
                onClick={() => {
                  setIsEditorOpen(false);
                  setEditingPost(null);
                }}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <BlogEditor
              initialData={editingPost || undefined}
              onSave={handleSavePost}
              onCancel={() => {
                setIsEditorOpen(false);
                setEditingPost(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
