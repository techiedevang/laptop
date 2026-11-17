"use client";

import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export interface PartnerBrand {
  id: string;
  name: string;
  subtitle: string;
  domain: string;
  badgeBg: string;
  logo: React.ReactNode;
}

export const TRUSTED_PARTNERS: PartnerBrand[] = [
  {
    id: "tcs",
    name: "TCS",
    subtitle: "Tata Consultancy",
    domain: "IT Services Fleet",
    badgeBg: "bg-[#005699]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M7 10h18M16 10v14" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="23" cy="18" r="2.5" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: "infosys",
    name: "Infosys",
    subtitle: "BPM Operations",
    domain: "Enterprise Fleet",
    badgeBg: "bg-[#007cc3]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 8h4v16H8zM16 13h4v11h-4zM18 9.5a2 2 0 100-4 2 2 0 000 4z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "wipro",
    name: "Wipro",
    subtitle: "Digital Fleet",
    domain: "IT Infrastructure",
    badgeBg: "bg-white border border-slate-200",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="10" cy="11" r="3.5" fill="#d92d20" />
        <circle cx="22" cy="11" r="3.5" fill="#027a48" />
        <circle cx="10" cy="21" r="3.5" fill="#f79009" />
        <circle cx="22" cy="21" r="3.5" fill="#1570ef" />
      </svg>
    ),
  },
  {
    id: "razorpay",
    name: "Razorpay",
    subtitle: "Fintech Ops",
    domain: "Partner Ecosystem",
    badgeBg: "bg-[#0c2340]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M17 5l-10 13h9l-2 9 11-13h-9l2-9z" fill="#0284c7" />
      </svg>
    ),
  },
  {
    id: "swiggy",
    name: "Swiggy",
    subtitle: "Hub Logistics",
    domain: "Operations Hub",
    badgeBg: "bg-[#fc8019]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 6c-4.2 0-7.5 3.2-7.5 7.2 0 5.4 7.5 12.8 7.5 12.8s7.5-7.4 7.5-12.8C23.5 9.2 20.2 6 16 6zm0 10a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "delhivery",
    name: "Delhivery",
    subtitle: "Supply Chain",
    domain: "Courier Hub IT",
    badgeBg: "bg-[#dc2626]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M7 11l9-5 9 5v10l-9 5-9-5V11z" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
        <path d="M16 6v19M7 11l9 5 9-5" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
    subtitle: "Enterprise Rigs",
    domain: "Global Vendor",
    badgeBg: "bg-[#b91c1c]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 10h5l3 6 3-6h5v12h-3.5v-7l-3.2 6.2h-2.6L11.5 15v7H8V10z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "zomato",
    name: "Zomato",
    subtitle: "Dark Stores",
    domain: "Hyperlocal Fleet",
    badgeBg: "bg-[#e11d48]",
    logo: (
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 9h16l-12 14h13" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

interface PartnerLogosProps {
  limit?: number;
  showLink?: boolean;
}

export function PartnerLogos({ limit = 8, showLink = true }: PartnerLogosProps) {
  const displayPartners = TRUSTED_PARTNERS.slice(0, limit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayPartners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700/80 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            {/* Logo Emblem */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${partner.badgeBg} group-hover:scale-105 transition-transform`}
            >
              {partner.logo}
            </div>

            {/* Name and Subtitle */}
            <div className="text-left min-w-0 flex-1">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {partner.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                {partner.subtitle}
              </p>
              <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 block mt-0.5 truncate">
                {partner.domain}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showLink && (
        <div className="pt-2 text-center">
          <Link
            href="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All Corporate Case Studies & Deployment Stats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
