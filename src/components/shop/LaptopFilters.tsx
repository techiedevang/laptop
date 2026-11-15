'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  brands: string[];
  priceMin: number;
  priceMax: number;
  ram: string[];
  storage: string[];
  processor: string[];
  screenSize: string[];
  grade: string[];
  inStockOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  brands: [],
  priceMin: 0,
  priceMax: 200000,
  ram: [],
  storage: [],
  processor: [],
  screenSize: [],
  grade: [],
  inStockOnly: false,
};

const RAM_OPTIONS = ['4GB', '8GB', '16GB', '32GB'];
const STORAGE_OPTIONS = ['128GB SSD', '256GB SSD', '512GB SSD', '1TB HDD', '1TB SSD'];
const PROCESSOR_OPTIONS = [
  'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
  'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7',
  'Apple M1', 'Apple M2',
];
const SCREEN_OPTIONS = ['13"', '14"', '15.6"', '17"'];
const GRADE_OPTIONS = ['A+', 'A', 'B'];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}

function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-700 focus:ring-blue-500 dark:bg-gray-700"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

interface PriceRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}

function PriceRange({ min, max, value, onChange }: PriceRangeProps) {
  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatINR(value[0])}</span>
        <span>{formatINR(value[1])}</span>
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="absolute h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Min ₹</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1000}
            value={value[0]}
            onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 1000), value[1]])}
            className="w-full accent-blue-600 dark:accent-blue-400"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Max ₹</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1000}
            value={value[1]}
            onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 1000)])}
            className="w-full accent-blue-600 dark:accent-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

interface LaptopFiltersProps {
  brands: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function LaptopFilters({ brands, filters, onChange }: LaptopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  }, [filters, onChange]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.brands.length > 0 ||
      filters.ram.length > 0 ||
      filters.storage.length > 0 ||
      filters.processor.length > 0 ||
      filters.screenSize.length > 0 ||
      filters.grade.length > 0 ||
      filters.inStockOnly ||
      filters.priceMin !== DEFAULT_FILTERS.priceMin ||
      filters.priceMax !== DEFAULT_FILTERS.priceMax
    );
  }, [filters]);

  const clearAll = () => onChange({ ...DEFAULT_FILTERS });

  const countActive = () => {
    let n = 0;
    if (filters.brands.length) n += filters.brands.length;
    if (filters.ram.length) n += filters.ram.length;
    if (filters.storage.length) n += filters.storage.length;
    if (filters.processor.length) n += filters.processor.length;
    if (filters.screenSize.length) n += filters.screenSize.length;
    if (filters.grade.length) n += filters.grade.length;
    if (filters.inStockOnly) n += 1;
    if (filters.priceMin !== DEFAULT_FILTERS.priceMin || filters.priceMax !== DEFAULT_FILTERS.priceMax) n += 1;
    return n;
  };

  const FilterContent = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters() && (
            <span className="bg-blue-700 dark:bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {countActive()}
            </span>
          )}
        </span>
        {hasActiveFilters() && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* In Stock Toggle */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">In Stock Only</span>
          <div
            onClick={() => update('inStockOnly', !filters.inStockOnly)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              filters.inStockOnly ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                filters.inStockOnly ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRange
          min={0}
          max={200000}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([min, max]) => onChange({ ...filters, priceMin: min, priceMax: max })}
        />
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <CheckboxGroup options={brands} selected={filters.brands} onChange={(v) => update('brands', v)} />
        </FilterSection>
      )}

      {/* Grade */}
      <FilterSection title="Grade">
        <CheckboxGroup options={GRADE_OPTIONS} selected={filters.grade} onChange={(v) => update('grade', v)} />
      </FilterSection>

      {/* RAM */}
      <FilterSection title="RAM">
        <CheckboxGroup options={RAM_OPTIONS} selected={filters.ram} onChange={(v) => update('ram', v)} />
      </FilterSection>

      {/* Storage */}
      <FilterSection title="Storage">
        <CheckboxGroup options={STORAGE_OPTIONS} selected={filters.storage} onChange={(v) => update('storage', v)} />
      </FilterSection>

      {/* Processor */}
      <FilterSection title="Processor" defaultOpen={false}>
        <CheckboxGroup options={PROCESSOR_OPTIONS} selected={filters.processor} onChange={(v) => update('processor', v)} />
      </FilterSection>

      {/* Screen Size */}
      <FilterSection title="Screen Size" defaultOpen={false}>
        <CheckboxGroup options={SCREEN_OPTIONS} selected={filters.screenSize} onChange={(v) => update('screenSize', v)} />
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters() && (
            <span className="bg-white text-blue-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {countActive()}
            </span>
          )}
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
              <span className="font-bold text-gray-900 dark:text-gray-100">Filters</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <FilterContent />
            <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
