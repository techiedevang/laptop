'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Loader2, Search, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: (selectedIds: string[]) => void;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  bulkActions?: BulkAction[];
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  bulkActions = [],
  pageSize = 20,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found.',
  onSearch,
  searchValue = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [internalSearch, setInternalSearch] = useState('');

  const searchQuery = onSearch ? searchValue : internalSearch;

  const filtered = useMemo(() => {
    if (!onSearch && internalSearch) {
      const q = internalSearch.toLowerCase();
      return data.filter((row) =>
        columns.some((col) => {
          const val = (row as Record<string, unknown>)[col.key];
          return String(val ?? '').toLowerCase().includes(q);
        })
      );
    }
    return data;
  }, [data, internalSearch, onSearch, columns]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      const cmp = String(aVal ?? '') < String(bVal ?? '') ? -1 : String(aVal ?? '') > String(bVal ?? '') ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const allSelected = paged.length > 0 && paged.every((r) => selected.has(r.id));
  const someSelected = paged.some((r) => selected.has(r.id));

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    }
  }

  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) {
      paged.forEach((r) => next.delete(r.id));
    } else {
      paged.forEach((r) => next.add(r.id));
    }
    setSelected(next);
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  const selectedIds = Array.from(selected);

  return (
    <div className="flex flex-col gap-3">
      {/* Search + Bulk Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={onSearch ? searchValue : internalSearch}
            onChange={(e) => {
              if (onSearch) onSearch(e.target.value);
              else { setInternalSearch(e.target.value); setPage(1); }
            }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedIds.length > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-1.5">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selectedIds.length} selected</span>
            {bulkActions.map((action, i) => (
              <button
                key={i}
                onClick={() => { action.onClick(selectedIds); setSelected(new Set()); }}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-md font-medium transition-colors ${
                  action.variant === 'danger'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={toggleAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 ${col.sortable ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white' : ''} ${col.className ?? ''}`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="text-gray-400">
                          {sortKey === col.key && sortDir === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : sortKey === col.key && sortDir === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ width: `${Math.random() * 60 + 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                      <Inbox className="h-10 w-10" />
                      <p className="text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selected.has(row.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-gray-700 dark:text-gray-200 ${col.className ?? ''}`}>
                        {col.render
                          ? col.render((row as Record<string, unknown>)[col.key], row)
                          : String((row as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && sorted.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${page === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
