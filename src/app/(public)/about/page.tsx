import Link from "next/link";
import { Laptop, ShieldCheck, Award, Users, CheckCircle2, ArrowRight, Clock, Building, Camera } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Founded in 2020 | Delhi, India</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Democratizing Enterprise Computing Across India
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            NextGen IT Hub bridges the gap between expensive brand-new laptops and questionable second-hand markets by delivering enterprise-certified, fully-warranted refurbished hardware.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Story & Purpose</h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              In 2020, we realized that thousands of Indian software engineers, college students, and bootstrapping startups were struggling with steep hardware costs. A brand new commercial laptop like a Dell Latitude or ThinkPad cost well over ₹80,000 to ₹1,50,000. At the same time, top IT firms return pristine corporate lease laptops after 24 to 36 months of desk use.
            </p>
            <p>
              We established NextGen IT Hub in Delhi with a single core mission: <strong>build India&apos;s most credible refurbished tech platform</strong>. By combining rigorous 50-point diagnostic procedures, transparent cosmetic grading (Grade A+/A/B), 6-month warranties, and live video demo inspections, we created an ecosystem where customers never have to compromise on reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">12,450+</div>
              <p className="text-xs text-slate-500 mt-0.5">Laptops Rehomed</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">620+</div>
              <p className="text-xs text-slate-500 mt-0.5">B2B Corporate Clients</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">4.9 / 5</div>
              <p className="text-xs text-slate-500 mt-0.5">Google Customer Rating</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">8.5 Tonnes</div>
              <p className="text-xs text-slate-500 mt-0.5">E-Waste Prevented</p>
            </div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Journey (2020 – 2024)</h2>
            <p className="text-xs text-slate-500">How NextGen IT Hub grew into India&apos;s most trusted refurbished hardware partner.</p>
          </div>

          <div className="relative border-l-2 border-blue-200 dark:border-blue-900 ml-4 sm:ml-8 space-y-8 py-2">
            {[
              {
                year: "2020",
                title: "Founded in Delhi",
                desc: "Started as a dedicated testing facility on Mother Dairy Road, Shakarpur, East Delhi, sourcing off-lease Dell Latitude and Lenovo ThinkPad machines for professionals and students.",
              },
              {
                year: "2021",
                title: "50-Point Diagnostic Standard Established",
                desc: "Standardized our strict hardware diagnostic protocol with thermal repasting, SSD surface testing, and guaranteed >80% battery capacity.",
              },
              {
                year: "2022",
                title: "Pioneered Live 1-on-1 Video Demos",
                desc: "Introduced transparent video inspection calls, eliminating customer uncertainty by demonstrating physical ports and screen condition live on camera.",
              },
              {
                year: "2023",
                title: "Corporate B2B Fleet Expansion",
                desc: "Crossed 500+ corporate clients across Bengaluru, Hyderabad, Mumbai, and Delhi-NCR with customized OS imaging and GST invoice input credits.",
              },
              {
                year: "2024",
                title: "Pan-India Free Express Shipping & 12,000+ Laptops",
                desc: "Expanded delivery network to all 28 states with Bluedart transit insurance and instant 7-day replacement guarantee.",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900" />
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{step.year}</span>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mt-0.5">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Pillars */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
            Our 4 Core Operating Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Full Transparency & Live Demos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We pioneered the 1-on-1 live video demo in India. Customers inspect the exact machine, ports, and display on camera before a single rupee is charged.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Genuine Commercial Hardware Only</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We only source mil-spec tested enterprise lines (Dell Latitude/Precision, Lenovo ThinkPad, HP EliteBook, Apple MacBook). We never sell fragile consumer laptops.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Legal GST Compliance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every retail and bulk purchase comes with a formal GST tax invoice with serial number tracking, enabling businesses to claim 18% input credit legitimately.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dedicated After-Sales Engineering</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our in-house technical team assists with driver upgrades, OS re-installation, battery replacements, and remote diagnostics during your entire 6-month warranty.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section Placeholders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">The Engineering & QC Team</h2>
            <p className="text-xs text-slate-500">The experienced technicians and customer advocates behind every restored laptop.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { role: "Head of Hardware Diagnostics", name: "Lead Hardware Engineer [PLACEHOLDER]", exp: "12+ yrs experience" },
              { role: "Thermal & Refurbishment Specialist", name: "Senior Tech Engineer [PLACEHOLDER]", exp: "8+ yrs experience" },
              { role: "B2B Solutions & Enterprise Fleet", name: "Enterprise Account Manager [PLACEHOLDER]", exp: "10+ yrs experience" },
              { role: "Customer Support & Video Demos", name: "Demo Specialist [PLACEHOLDER]", exp: "6+ yrs experience" },
            ].map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm space-y-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto text-xl font-bold">
                  👨‍💻
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{member.role}</p>
                <p className="text-[10px] text-slate-400">{member.exp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Placeholders (Lab & Showroom) */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Delhi Facility & Testing Lab</h2>
            <p className="text-xs text-slate-500">Equipped with automated diagnostic rigs, clean room workstations, and staging racks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-300 dark:border-slate-700 text-center">
              <Camera className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">50-Point Testing Station</p>
              <span className="text-[10px] text-slate-400 mt-0.5">[PLACEHOLDER PHOTO: QC Testing Benches]</span>
            </div>
            <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-300 dark:border-slate-700 text-center">
              <Building className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cleanroom Thermal Lab</p>
              <span className="text-[10px] text-slate-400 mt-0.5">[PLACEHOLDER PHOTO: Ultrasonic Cleaning & Repaste]</span>
            </div>
            <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-300 dark:border-slate-700 text-center">
              <Laptop className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Live Video Demo Studio</p>
              <span className="text-[10px] text-slate-400 mt-0.5">[PLACEHOLDER PHOTO: Customer Video Inspection Booth]</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-700 dark:bg-blue-800 text-white p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Ready to Experience Refurbished Excellence?</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Browse our ready inventory or schedule a live video demo with our Delhi warehouse engineer.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow"
            >
              Shop Laptops
            </Link>
            <Link
              href="/contact"
              className="bg-blue-900/80 hover:bg-blue-900 text-white font-semibold px-6 py-2.5 rounded-xl border border-blue-400/30 text-xs sm:text-sm transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
