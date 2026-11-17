"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Shield, 
  Heart, 
  ShoppingCart, 
  Eye,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export interface LaptopCardData {
  id: string;
  slug: string;
  model: string;
  brand: string;
  grade: "A_PLUS" | "A" | "B";
  mrp: number; // in paise
  sellingPrice: number; // in paise
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  batteryHealth?: string;
  warranty?: string;
  availableUnits: number;
  imageUrl?: string;
  hoverImageUrl?: string;
  secondaryImageUrl?: string;
  qcPassedCount?: number;
}

interface LaptopCardProps {
  laptop: LaptopCardData;
}

export function LaptopCard({ laptop }: LaptopCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  // Price formatting in Indian Rupees (₹)
  const formatINR = (paise: number) => {
    return "₹" + (paise / 100).toLocaleString("en-IN");
  };

  const discountPercent = Math.round(
    ((laptop.mrp - laptop.sellingPrice) / laptop.mrp) * 100
  );

  const gradeDetails = {
    A_PLUS: { 
      label: "Grade A+ (Like New)", 
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800",
      dotColor: "bg-emerald-500"
    },
    A: { 
      label: "Grade A (Excellent)", 
      badgeColor: "bg-sky-50 text-sky-700 border-sky-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800",
      dotColor: "bg-sky-500"
    },
    B: { 
      label: "Grade B (Great Value)", 
      badgeColor: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
      dotColor: "bg-amber-500"
    },
  };

  const gradeInfo = gradeDetails[laptop.grade] || gradeDetails.A;
  const isSoldOut = laptop.availableUnits <= 0;
  const isLowStock = laptop.availableUnits > 0 && laptop.availableUnits <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSoldOut) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem("ngh_cart") || "[]");
      const existingItem = existingCart.find((i: { laptopId: string }) => i.laptopId === laptop.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        existingCart.push({
          laptopId: laptop.id,
          model: laptop.model,
          brand: laptop.brand,
          sellingPrice: laptop.sellingPrice,
          grade: laptop.grade,
          imageUrl: laptop.imageUrl || "/images/laptops/dell-latitude-7490-front.jpg",
          quantity: 1,
        });
      }
      localStorage.setItem("ngh_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cart_updated"));
      toast.success(`${laptop.model} added to your cart!`);
    } catch {
      toast.success("Added to cart!");
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist!", {
      icon: isWishlisted ? "💔" : "❤️",
    });
  };

  const frontImg = laptop.imageUrl || "/images/laptops/dell-latitude-7490-front.jpg";
  const hoverImg = laptop.hoverImageUrl || laptop.secondaryImageUrl || frontImg;

  return (
    <div 
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onTouchStart={() => setIsTapped(!isTapped)}
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${gradeInfo.badgeColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${gradeInfo.dotColor}`} />
            {gradeInfo.label}
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="pointer-events-auto p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition-colors border border-slate-200/80 dark:border-slate-700 hover:scale-110 active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      {/* DUAL-IMAGE CONTAINER (EZYREFURB SPECIFICATION HOVER PATTERN) */}
      <Link 
        href={`/shop/${laptop.slug}`}
        className="relative block aspect-[4/3] bg-gradient-to-b from-sky-50/40 via-slate-50 to-white dark:from-slate-800/90 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer"
      >
        {/* IMAGE 1: Primary Studio Front View */}
        <div 
          className={`absolute inset-0 p-3 sm:p-4 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isTapped 
              ? "opacity-0 scale-95" 
              : "opacity-100 group-hover:opacity-0 group-hover:scale-95"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={frontImg}
              alt={laptop.model}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
              priority={false}
            />
          </div>
        </div>

        {/* IMAGE 2: Hover View (Laptop Photo + Specification Card Right Behind It) */}
        <div 
          className={`absolute inset-0 p-2 sm:p-3 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isTapped 
              ? "opacity-100 scale-100" 
              : "opacity-0 group-hover:opacity-100 group-hover:scale-100"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={hoverImg}
              alt={`${laptop.model} with Specifications`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
              priority={false}
            />
          </div>
        </div>

        {/* Bottom hover hint badge */}
        <div className="absolute bottom-2 right-2 pointer-events-none transition-opacity duration-200 group-hover:opacity-0 opacity-80">
          <span className="text-[10px] font-semibold bg-white/90 dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200/70 shadow-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Hover for Specs
          </span>
        </div>

        {/* Sold Out / Low Stock Alerts */}
        {isSoldOut ? (
          <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md shadow-md tracking-wider">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-12 left-3 z-20">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              🔥 Only {laptop.availableUnits} left
            </span>
          </div>
        ) : null}
      </Link>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Warranty Line */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {laptop.brand} Certified
            </span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>{laptop.warranty || "6 Months Warranty"}</span>
            </div>
          </div>

          {/* Model Title */}
          <Link href={`/shop/${laptop.slug}`} className="block">
            <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
              {laptop.model}
            </h3>
          </Link>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
            {laptop.processor && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono truncate max-w-[170px]">
                {laptop.processor.split("(")[0].trim()}
              </span>
            )}
            {laptop.ram && (
              <span className="bg-blue-50/80 dark:bg-slate-800 text-blue-900 dark:text-blue-300 border border-blue-200/60 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                {laptop.ram.split("(")[0].trim()}
              </span>
            )}
            {laptop.storage && (
              <span className="bg-emerald-50/80 dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                {laptop.storage.split(" ")[0]} SSD
              </span>
            )}
            {laptop.display && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                {laptop.display.split(" ")[0]}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatINR(laptop.sellingPrice)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="line-through">{formatINR(laptop.mrp)}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Save {formatINR(laptop.mrp - laptop.sellingPrice)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                GST Invoice Incl.
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Free Express Delivery
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-semibold py-2.5 px-2 rounded-xl transition-colors shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isSoldOut ? "Sold Out" : "Add to Cart"}</span>
            </button>

            <Link
              href={`/shop/${laptop.slug}`}
              className="flex items-center justify-center gap-1 w-full bg-sky-50 hover:bg-sky-100/90 text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold py-2.5 px-2 rounded-xl border border-sky-200/80 dark:border-slate-700 transition-colors text-center"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>View Specs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
