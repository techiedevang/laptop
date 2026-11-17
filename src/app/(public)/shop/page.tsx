"use client";

import { useState, useMemo } from "react";
import { LaptopCard } from "@/components/shop/LaptopCard";
import { ALL_LAPTOPS } from "@/data/laptops";
import { Search, SlidersHorizontal, X, ArrowUpDown, ShieldCheck, Zap } from "lucide-react";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [selectedRam, setSelectedRam] = useState<string>("ALL");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredLaptops = useMemo(() => {
    return ALL_LAPTOPS.filter((laptop) => {
      if (
        search && 
        !laptop.model.toLowerCase().includes(search.toLowerCase()) && 
        !laptop.brand.toLowerCase().includes(search.toLowerCase()) &&
        !laptop.processor?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (selectedBrand !== "ALL" && laptop.brand !== selectedBrand) {
        return false;
      }
      if (selectedGrade !== "ALL" && laptop.grade !== selectedGrade) {
        return false;
      }
      if (selectedRam !== "ALL" && !laptop.ram?.includes(selectedRam)) {
        return false;
      }
      if (onlyInStock && laptop.availableUnits <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.sellingPrice - b.sellingPrice;
      if (sortBy === "price_desc") return b.sellingPrice - a.sellingPrice;
      return 0;
    });
  }, [search, selectedBrand, selectedGrade, selectedRam, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("ALL");
    setSelectedGrade("ALL");
    setSelectedRam("ALL");
    setOnlyInStock(false);
    setSortBy("featured");
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-8 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>NextGen Certified Refurbished Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Refurbished Laptops
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Certified Grade A+/A/B laptops thoroughly benchmarked with 40-Point QC diagnostics, 6–12 months pan-India doorstep warranty, and 18% GST input credit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Hover photo to reveal Spec Sheet</span>
            </div>
          </div>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model (e.g. ThinkPad, Latitude, M1)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 bg-sky-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-slate-200 border border-sky-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price_asc" | "price_desc")}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`md:block ${mobileFilterOpen ? "block" : "hidden"} md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Filter Laptops</span>
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Brand
              </label>
              <div className="space-y-1 text-xs">
                {["ALL", "Dell", "Lenovo", "HP", "Apple"].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedBrand === brand
                        ? "bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-sky-200"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:text-blue-600 dark:hover:bg-slate-800"
                    }`}
                  >
                    {brand === "ALL" ? "All Brands (12)" : brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Condition Grade
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: "ALL", label: "All Grades" },
                  { id: "A_PLUS", label: "Grade A+ (Like New)" },
                  { id: "A", label: "Grade A (Excellent)" },
                  { id: "B", label: "Grade B (Great Value)" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGrade(g.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedGrade === g.id
                        ? "bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-sky-200"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:text-blue-600 dark:hover:bg-slate-800"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Memory (RAM)
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {["ALL", "8GB", "16GB", "32GB"].map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={`px-2.5 py-1.5 rounded-lg border text-center font-medium transition-colors ${
                      selectedRam === ram
                        ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {ram === "ALL" ? "Any RAM" : ram}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <label htmlFor="inStock" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                In-Stock Only
              </label>
              <input
                id="inStock"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="md:col-span-3 space-y-6">
            
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Showing <strong>{filteredLaptops.length}</strong> verified enterprise laptops</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">⚡ Same-Day Dispatch from Shakarpur HQ</span>
            </div>

            {filteredLaptops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaptops.map((laptop) => (
                  <LaptopCard key={laptop.id} laptop={laptop} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No laptops found matching your criteria.
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing your filters or contact our Shakarpur store for custom sourcing.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
