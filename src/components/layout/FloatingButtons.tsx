"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";

export function FloatingButtons() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Create friendly message based on path
  const pageName = pathname === "/" ? "refurbished laptops" : pathname.replace(/\//g, " ").replace(/-/g, " ").trim();
  let message = `Hi, I'm interested in ${pageName} on NextGen IT Hub.`;
  if (pathname.includes("/shop/")) {
    message = `Hi, I'm interested in this laptop on NextGen IT Hub and would like to know availability, warranty, or book a live video demo.`;
  } else if (pathname.includes("/bulk-order")) {
    message = "Hi, I'm interested in placing a bulk B2B laptop order for our company.";
  } else if (pathname.includes("/video-demo")) {
    message = "Hi, I'm interested in booking a live video demo to inspect laptop condition before purchase.";
  }

  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "9155282776";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodedMessage}`;
  const telUrl = `tel:+91${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3.5 pointer-events-auto">
      {/* Call Button (circular icon-only with hover tooltip) */}
      <a
        href={telUrl}
        aria-label="Call NextGen IT Hub (+91 9155282776)"
        className="group relative flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.65)] hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Phone className="w-5 h-5 fill-current" />
        
        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Call: +91 {phoneNumber}
        </span>
      </a>

      {/* WhatsApp Bot Glowing Button (circular icon-only with live bot glow) */}
      <div className="relative group flex items-center justify-center">
        {/* Glowing Pulsating Outer Rings / Bot Aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-60 animate-ping pointer-events-none" />
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-35 blur-sm animate-pulse pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with NextGen IT Hub on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.65),0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.9),0_6px_16px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* WhatsApp Official SVG Logo */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 fill-white drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.712 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
          </svg>

          {/* Online status indicator beacon (like live bot) */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-200 border-2 border-[#25D366]"></span>
          </span>
        </a>

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat on WhatsApp
        </span>
      </div>
    </div>
  );
}
