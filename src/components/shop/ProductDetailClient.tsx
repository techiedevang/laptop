"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Shield, 
  RotateCcw, 
  Truck, 
  CheckCircle, 
  MessageCircle, 
  Video, 
  ShoppingCart, 
  Zap, 
  Package, 
  FileText, 
  Cpu, 
  HardDrive, 
  Monitor, 
  BatteryCharging, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { LaptopData } from "@/data/laptops";

interface ProductDetailClientProps {
  laptop: LaptopData;
  relatedLaptops: LaptopData[];
}

export function ProductDetailClient({ laptop, relatedLaptops }: ProductDetailClientProps) {
  // Gallery state
  const galleryImages = [
    { url: laptop.imageUrl, alt: `${laptop.model} Front Studio Angle`, label: "Front Angle" },
    { url: laptop.hoverImageUrl || laptop.secondaryImageUrl, alt: `${laptop.model} Technical Specifications View`, label: "Specs View" },
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Upgrade configurator state
  const [selectedRamId, setSelectedRamId] = useState<string>(
    laptop.upgradeOptions.ram[0]?.id || "ram-base"
  );
  const [selectedStorageId, setSelectedStorageId] = useState<string>(
    laptop.upgradeOptions.storage[0]?.id || "ssd-base"
  );
  const [selectedWarrantyId, setSelectedWarrantyId] = useState<string>(
    laptop.upgradeOptions.warranty[0]?.id || "war-base"
  );

  // Active QC accordion
  const [openQcCategory, setOpenQcCategory] = useState<number>(0);

  // Delivery check state
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Calculate dynamic price based on selected upgrades
  const selectedRam = laptop.upgradeOptions.ram.find((r) => r.id === selectedRamId);
  const selectedStorage = laptop.upgradeOptions.storage.find((s) => s.id === selectedStorageId);
  const selectedWarranty = laptop.upgradeOptions.warranty.find((w) => w.id === selectedWarrantyId);

  const ramExtra = selectedRam?.additionalPrice || 0;
  const storageExtra = selectedStorage?.additionalPrice || 0;
  const warrantyExtra = selectedWarranty?.additionalPrice || 0;

  const totalPrice = laptop.sellingPrice + ramExtra + storageExtra + warrantyExtra;
  const totalMrp = laptop.mrp + ramExtra + storageExtra;
  const totalSavings = totalMrp - totalPrice;
  const discountPercent = Math.round((totalSavings / totalMrp) * 100);

  const formatINR = (paise: number) => {
    return "₹" + (paise / 100).toLocaleString("en-IN");
  };

  const itcAmount = Math.round(totalPrice * (18 / 118));

  // Add to Cart
  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("ngh_cart") || "[]");
      existingCart.push({
        laptopId: laptop.id,
        model: laptop.model,
        brand: laptop.brand,
        sellingPrice: totalPrice,
        grade: laptop.grade,
        imageUrl: laptop.imageUrl,
        selectedConfig: {
          ram: selectedRam?.label,
          storage: selectedStorage?.label,
          warranty: selectedWarranty?.label,
        },
        quantity: 1,
      });
      localStorage.setItem("ngh_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cart_updated"));
      toast.success(`${laptop.model} (Customized) added to cart!`);
    } catch {
      toast.success("Added to cart!");
    }
  };

  // WhatsApp Inquiry URL with pre-filled message
  const whatsappText = encodeURIComponent(
    `Hi NextGen IT Hub! I'm interested in the certified refurbished ${laptop.model} (Grade ${laptop.grade.replace("_", "+")}).
Configuration: ${selectedRam?.label || laptop.ram} | ${selectedStorage?.label || laptop.storage} | ${selectedWarranty?.label || "6M Warranty"}.
Total Price: ${formatINR(totalPrice)}.
Is it in stock at your Shakarpur, Delhi store for same-day dispatch?`
  );
  const whatsappUrl = `https://wa.me/919155282776?text=${whatsappText}`;

  // Pincode validation check
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    if (pincode.startsWith("11")) {
      setPincodeStatus("⚡ Express Same-Day Delivery available in Delhi NCR from Shakarpur HQ!");
    } else {
      setPincodeStatus("✓ Free Insured Delivery via BlueDart / Delhivery in 2–4 business days.");
    }
  };

  const gradeInfo = {
    A_PLUS: {
      label: "Grade A+ (Like New)",
      color: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300",
      description: "Cosmetic 9.5/10. Zero screen scratches or blemishes. Looks practically brand new.",
    },
    A: {
      label: "Grade A (Excellent)",
      color: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-blue-950/80 dark:text-blue-300",
      description: "Cosmetic 8.5–9/10. Light unnoticeable micro-wear on casing. Screen is 100% spotless.",
    },
    B: {
      label: "Grade B (Great Value)",
      color: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300",
      description: "Cosmetic 7.5–8/10. Light cosmetic scuffs on outer chassis. 100% certified hardware.",
    },
  }[laptop.grade] || {
    label: "Grade A+ (Like New)",
    color: "bg-emerald-50 text-emerald-800 border-emerald-300",
    description: "Flawless condition.",
  };

  return (
    <div className="bg-slate-50/40 dark:bg-slate-950 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-600">Refurbished Laptops</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate">{laptop.model}</span>
        </nav>

        {/* Top Product Hero: Gallery + Purchasing Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Multi-Angle Interactive Photo Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </span>
              </div>
              <div className="relative w-full h-full">
                <Image
                  src={galleryImages[activeImageIndex].url}
                  alt={galleryImages[activeImageIndex].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnail Selection Strip */}
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] bg-white dark:bg-slate-900 rounded-2xl p-2 border-2 transition-all overflow-hidden ${
                    activeImageIndex === idx 
                      ? "border-blue-600 shadow-md ring-2 ring-blue-100" 
                      : "border-slate-200 hover:border-blue-300 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img.url} alt={img.alt} fill className="object-contain" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            {/* In-Store Live Inspection Reassurance */}
            <div className="bg-sky-50/70 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Inspect Live Before Payment
                </p>
                <p>
                  Book a free private video call with our testing engineer or visit our Shakarpur, East Delhi center to test this exact serial number in person.
                </p>
                <Link
                  href={`/video-demo?laptop=${encodeURIComponent(laptop.model)}`}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline pt-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Book Free 1-on-1 Video Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Specs, Pricing, and Interactive Configurator (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {laptop.brand} Certified Refurbished
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                  ✓ {laptop.qcPassedCount}-Point QC Certified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {laptop.model}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {laptop.shortDescription}
              </p>
            </div>

            {/* Dynamic Pricing Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {formatINR(totalPrice)}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    {formatINR(totalMrp)}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    {discountPercent}% OFF
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>Save {formatINR(totalSavings)}</span>
                  <span>•</span>
                  <span>18% GST Tax Invoice Included</span>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">
                  🏢 B2B GST Credit:
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  Claim ~{formatINR(itcAmount)} ITC
                </span>
              </div>
            </div>

            {/* INTERACTIVE HARDWARE UPGRADE CONFIGURATOR */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Customize Memory (RAM)</span>
                </h2>
                <span className="text-[11px] text-slate-500">Fast OEM DDR4</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {laptop.upgradeOptions.ram.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRamId(opt.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedRamId === opt.id
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 shadow-xs ring-1 ring-blue-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{opt.label}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {opt.additionalPrice === 0 ? "Included" : `+${formatINR(opt.additionalPrice)}`}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {opt.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage (SSD) Configurator */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>Customize Storage (NVMe SSD)</span>
                </h2>
                <span className="text-[11px] text-slate-500">100% SMART Health</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {laptop.upgradeOptions.storage.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStorageId(opt.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedStorageId === opt.id
                        ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 shadow-xs ring-1 ring-emerald-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{opt.label}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {opt.additionalPrice === 0 ? "Included" : `+${formatINR(opt.additionalPrice)}`}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {opt.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Warranty Extension Configurator */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Doorstep Warranty Plan</span>
                </h2>
                <span className="text-[11px] text-slate-500">Pan-India Support</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {laptop.upgradeOptions.warranty.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedWarrantyId(opt.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedWarrantyId === opt.id
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs ring-1 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{opt.label}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {opt.additionalPrice === 0 ? "Included" : `+${formatINR(opt.additionalPrice)}`}
                      </span>
                    </div>
                    {opt.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {opt.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Add to Cart & WhatsApp Instant Inquiry */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Customized Laptop to Cart</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Inquiry</span>
                </a>
              </div>

              {/* Express Buy Now Link */}
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold py-3 px-4 rounded-xl text-xs transition-colors text-center"
              >
                <span>Express Checkout (UPI / COD / Netbanking)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pincode & Delivery Availability Checker */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Check Delivery Time to Your City
                </span>
                <span className="text-[11px] text-emerald-600">Free Insured Transit</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN code (e.g. 110092)"
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 pt-1">
                  {pincodeStatus}
                </p>
              )}
            </div>

          </div>

        </div>

        {/* TRUST BANNER: 4 PILLARS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <Shield className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">6–12M Warranty</h4>
              <p className="text-[11px] text-slate-500">Comprehensive hardware protection</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <RotateCcw className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">7 Days Replacement</h4>
              <p className="text-[11px] text-slate-500">Free reverse pickup guarantee</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <Truck className="w-8 h-8 text-indigo-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Same-Day Dispatch</h4>
              <p className="text-[11px] text-slate-500">From Mother Dairy Rd, Shakarpur</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <FileText className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">GST Tax Invoice</h4>
              <p className="text-[11px] text-slate-500">18% Input Tax Credit claimable</p>
            </div>
          </div>
        </div>

        {/* SECTION: WHAT'S IN THE BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Unboxing Inclusions
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              What Comes in the Box?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every machine is securely packed in reinforced tamper-evident eco-cushioning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {laptop.whatsInTheBox.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 text-center space-y-2 hover:border-blue-400 transition-colors"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: 40-POINT QC DIAGNOSTIC CHECKLIST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Quality Assurance
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                40-Point Rigorous Diagnostic Inspection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conducted by certified hardware engineers at our Shakarpur facility before dispatch.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              100% Passed Tests
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {laptop.qcChecklist.map((group, gIdx) => (
              <div 
                key={gIdx} 
                className="bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{group.category}</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {group.items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: FULL TECHNICAL SPECIFICATIONS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Technical Data
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Complete Hardware Specifications
            </h3>
          </div>

          <div className="space-y-6">
            {laptop.specs.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {group.group}
                </h4>
                <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className="sm:col-span-2 text-slate-900 dark:text-white font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: RELATED LAPTOPS */}
        {relatedLaptops.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Similar Models
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Customers Also Viewed
                </h3>
              </div>
              <Link href="/shop" className="text-xs font-bold text-blue-600 hover:underline">
                View All Refurbished Laptops →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLaptops.slice(0, 4).map((rel) => {
                const relDisc = Math.round(((rel.mrp - rel.sellingPrice) / rel.mrp) * 100);
                return (
                  <Link
                    key={rel.id}
                    href={`/shop/${rel.slug}`}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800 rounded-xl mb-3 overflow-hidden p-2">
                      <Image
                        src={rel.imageUrl}
                        alt={rel.model}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {rel.brand} Certified
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600">
                        {rel.model}
                      </h4>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {formatINR(rel.sellingPrice)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatINR(rel.mrp)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {relDisc}% OFF
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
