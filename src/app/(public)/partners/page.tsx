import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle2, Handshake, Award, TrendingUp, Users } from 'lucide-react';
import { PartnerLogos } from '@/components/home/PartnerLogos';

export const metadata: Metadata = {
  title: 'Corporate Partners & B2B Case Studies | NextGen IT Hub',
  description:
    'Discover how 250+ startups, enterprises, and educational institutions power their teams with certified refurbished enterprise hardware from NextGen IT Hub.',
};

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  location: string;
  logo: string;
  stats: { label: string; value: string }[];
  headline: string;
  quote: string;
  author: string;
  role: string;
  details: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    client: 'HyperLogix Tech Labs',
    industry: 'FinTech & AI Startup',
    location: 'Bengaluru, Karnataka',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60',
    stats: [
      { label: 'Units Deployed', value: '140+ Laptops' },
      { label: 'Procurement Savings', value: '₹42 Lakhs (58%)' },
      { label: 'Deployment Turnaround', value: '48 Hours' },
    ],
    headline: 'Scaling engineering headcount from 30 to 170 engineers in 6 months without capital strain',
    quote:
      'NextGen IT Hub supplied Grade A+ ThinkPads and MacBooks configured to our exact security image. Zero hardware failures in 12 months, backed by priority same-day swap SLA.',
    author: 'Vikramaditya Rao',
    role: 'VP Engineering & Infrastructure',
    details:
      'By choosing certified Grade A+ enterprise refurbished units over new retail machines, HyperLogix saved 58% on IT Capex while retaining full enterprise hardware specifications (32GB RAM, NVMe SSDs).',
  },
  {
    id: 'cs-2',
    client: 'Apex Global BPO Solutions',
    industry: 'Customer Operations & IT Services',
    location: 'Pune & Hyderabad',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=60',
    stats: [
      { label: 'Workstations Deployed', value: '350+ Units' },
      { label: 'Annual AMC Uptime', value: '99.8%' },
      { label: 'GST Input Credit Saved', value: '₹14.2 Lakhs' },
    ],
    headline: 'Deploying robust 24x7 enterprise Dell Latitude fleets across dual delivery centres',
    quote:
      'Their GST e-invoicing and transparent unit condition grading made our corporate audit completely seamless. NextGen is our sole IT hardware provider.',
    author: 'Sunita Deshmukh',
    role: 'Chief Operating Officer',
    details:
      'Apex required standardized 14-inch Dell laptops with RJ-45 Gigabit Ethernet and TPM 2.0 encryption. NextGen pre-tested battery degradation ensuring every unit delivered >85% original battery cycle life.',
  },
  {
    id: 'cs-3',
    client: 'Kaveri Academy of Technology',
    industry: 'Higher Education Institute',
    location: 'Chennai, Tamil Nadu',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=60',
    stats: [
      { label: 'Lab Laptops', value: '200 Units' },
      { label: 'Budget Stretch', value: '2.4x more students equipped' },
      { label: 'Warranty Coverage', value: '12 Months Comprehensive' },
    ],
    headline: 'Modernizing student data science computing laboratories under tight state grant budgets',
    quote:
      'We were able to equip two full computer labs with Intel Core i7 workstations within the sanctioned grant where retail dealers offered only entry-level Core i3s.',
    author: 'Dr. K. Ramanathan',
    role: 'Dean of Computing Sciences',
    details:
      'Delivered fully sanitized HP EliteBook 840 G6 laptops with custom campus asset tagging, pre-installed Ubuntu LTS, and dedicated on-campus swap spares.',
  },
];

const CORPORATE_PARTNERS = [
  { name: 'Tata Consultancy Services Vendor Fleet', domain: 'IT Services' },
  { name: 'Infosys BPM Vendor Partner', domain: 'Enterprise BPO' },
  { name: 'Razorpay Partner Ecosystem', domain: 'Fintech' },
  { name: 'Swiggy Operations Hub', domain: 'Logistics' },
  { name: 'Zomato Dark Stores IT Fleet', domain: 'Hyperlocal' },
  { name: 'Delhivery Hub Operations', domain: 'Supply Chain' },
  { name: 'Unacademy Remote Educator Fleet', domain: 'EdTech' },
  { name: 'Cars24 Inspection Squad', domain: 'Automotive' },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Header */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
            <Handshake className="w-3.5 h-3.5" />
            <span>Trusted Enterprise Partner Program</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Powering India's Fastest Growing Enterprises
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
            From Series A tech startups to multi-city BPO operations, see why companies trust NextGen IT Hub for bulk refurbished laptop deployments with GST input credit and enterprise SLAs.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/bulk-order"
              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-md flex items-center gap-2"
            >
              <span>Request Corporate Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/video-demo"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Book Fleet Inspection Call
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Logo Grid */}
      <section className="py-14 border-b border-blue-100 dark:border-gray-800 bg-blue-50/30 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Verified Enterprise Rigs
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Deployed Across 250+ Indian Companies & Institutions
            </h2>
            <p className="text-xs text-slate-500">
              Trusted by tech leads, procurement managers & operations heads across India.
            </p>
          </div>
          <PartnerLogos limit={8} showLink={false} />
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Enterprise Case Studies</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Real deployments, measured Capex savings, and verified SLA metrics.
          </p>
        </div>

        <div className="space-y-12">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Details */}
              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {study.industry}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">📍 {study.location}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {study.headline}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {study.details}
                  </p>

                  {/* Quote block */}
                  <blockquote className="border-l-4 border-blue-600 dark:border-blue-400 pl-4 py-1 italic text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 rounded-r-lg mb-6">
                    "{study.quote}"
                    <footer className="mt-2 text-xs font-semibold text-gray-900 dark:text-gray-200 not-italic">
                      — {study.author}, <span className="font-normal text-gray-500 dark:text-gray-400">{study.role}</span> ({study.client})
                    </footer>
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Verified Corporate Delivery
                  </span>
                  <Link
                    href={`/bulk-order?ref=${study.id}`}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Deploy Similar Fleet <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Key Metrics Box */}
              <div className="lg:col-span-4 bg-gray-50 dark:bg-gray-900/60 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col justify-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
                  Key Engagement Metrics
                </h4>
                <div className="space-y-6">
                  {study.stats.map((stat, i) => (
                    <div key={i}>
                      <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-400 block">
                        {stat.value}
                      </span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-blue-700 dark:bg-blue-800 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Need 5 or 500 Laptops For Your Team?</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Get personalized volume tier quotations, 18% GST invoice with serial tracking, and zero-downtime hardware replacement guarantees.
          </p>
          <div className="pt-2">
            <Link
              href="/bulk-order"
              className="inline-block bg-white text-blue-800 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg text-sm"
            >
              Get Custom Corporate Proposal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
