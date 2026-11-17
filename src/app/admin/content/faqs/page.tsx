'use client';

import React, { useState } from 'react';
import {
  HelpCircle, Plus, Edit2, Trash2, ArrowUp, ArrowDown, FolderPlus,
  Check, X, ChevronDown, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'f-1',
    category: 'Warranty & Quality',
    question: 'What does the 1-Year NextGen Replacement Warranty cover?',
    answer: 'It covers all internal hardware faults including motherboard, RAM, SSD, display panel failure, and keyboard malfunctions. Free doorstep courier pickup is provided across India.',
    order: 1,
  },
  {
    id: 'f-2',
    category: 'Warranty & Quality',
    question: 'How are laptop battery health and life guaranteed?',
    answer: 'Every refurbished unit is tested with OEM battery diagnostic tools. We guarantee a minimum 80% remaining battery capacity, with typical real-world runtimes of 4 to 6+ hours.',
    order: 2,
  },
  {
    id: 'f-3',
    category: 'Shipping & Delivery',
    question: 'How long does express delivery take within India?',
    answer: 'Orders to Tier-1 metro cities (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Chennai, Pune) arrive within 24 to 48 hours via BlueDart or Delhivery Air Express.',
    order: 1,
  },
  {
    id: 'f-4',
    category: 'Shipping & Delivery',
    question: 'Is Cash on Delivery (COD) available for laptops?',
    answer: 'Yes, COD is supported with a small nominal advance commitment of ₹999 to verify serious delivery intent.',
    order: 2,
  },
  {
    id: 'f-5',
    category: 'B2B & GST Billing',
    question: 'Can I claim 18% GST input tax credit for my business?',
    answer: 'Yes! Simply provide your 15-digit GSTIN during checkout. You will receive an official Tax Invoice compliant with GST rules within 24 hours of dispatch.',
    order: 1,
  },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [categories, setCategories] = useState<string[]>([
    'Warranty & Quality',
    'Shipping & Delivery',
    'B2B & GST Billing',
    'Return & Refund Policy',
  ]);

  // Modals
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqForm, setFaqForm] = useState({ category: 'Warranty & Quality', question: '', answer: '' });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleOpenAddFaq = (category?: string) => {
    setEditingFaq(null);
    setFaqForm({
      category: category || categories[0] || 'General',
      question: '',
      answer: '',
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFaqForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Question and answer required');
      return;
    }

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaq.id ? { ...f, ...faqForm } : f))
      );
      toast.success('FAQ updated');
    } else {
      const newFaq: FAQItem = {
        id: Math.random().toString(),
        category: faqForm.category,
        question: faqForm.question,
        answer: faqForm.answer,
        order: faqs.filter((f) => f.category === faqForm.category).length + 1,
      };
      setFaqs((prev) => [...prev, newFaq]);
      toast.success('FAQ added');
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string) => {
    if (!confirm('Delete this question?')) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success('FAQ deleted');
  };

  const handleMoveFaq = (category: string, index: number, direction: 'UP' | 'DOWN') => {
    const categoryFaqs = faqs.filter((f) => f.category === category);
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categoryFaqs.length) return;

    const itemA = categoryFaqs[index];
    const itemB = categoryFaqs[targetIdx];

    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === itemA.id) return { ...f, order: itemB.order };
        if (f.id === itemB.id) return { ...f, order: itemA.order };
        return f;
      })
    );
    toast.success('Order updated');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      toast.error('Category already exists');
      return;
    }
    setCategories((prev) => [...prev, newCategoryName.trim()]);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
    toast.success('Category added');
  };

  const handleDeleteCategory = (cat: string) => {
    if (!confirm(`Delete category "${cat}" and all its questions?`)) return;
    setCategories((prev) => prev.filter((c) => c !== cat));
    setFaqs((prev) => prev.filter((f) => f.category !== cat));
    toast.success(`Deleted category "${cat}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-600" /> FAQ Knowledge Base
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage customer frequently asked questions, warranty policies, GST billing queries, and categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold shadow-sm"
          >
            <FolderPlus className="h-4 w-4 text-gray-500" /> New Category
          </button>
          <button
            onClick={() => handleOpenAddFaq()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryFaqs = faqs
            .filter((f) => f.category === category)
            .sort((a, b) => a.order - b.order);

          return (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{category}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {categoryFaqs.length} FAQs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddFaq(category)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to {category}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="text-xs text-red-500 hover:underline ml-3"
                  >
                    Delete Category
                  </button>
                </div>
              </div>

              {categoryFaqs.length === 0 ? (
                <p className="text-xs text-gray-400 py-3">No questions in this category yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {categoryFaqs.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/30 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">Q: {faq.question}</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">A: {faq.answer}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveFaq(category, idx, 'UP')}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === categoryFaqs.length - 1}
                          onClick={() => handleMoveFaq(category, idx, 'DOWN')}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditFaq(faq)}
                          className="p-1 text-gray-400 hover:text-amber-600"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveFaq}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Question'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Do these laptops come with genuine Windows 11?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Comprehensive answer explaining warranty, testing, or process..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Create New Category</h3>
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Category Title</label>
              <input
                type="text"
                placeholder="e.g. Battery & Power Accessories"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
