import { Shield, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function GrievanceOfficerPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Statutory Compliance (IT Act 2000 & DPDP Act 2023)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Grievance Redressal Officer
          </h1>
          <p className="text-xs text-slate-400">Formal grievance escalation channel for Indian consumer and data protection queries</p>
        </div>

        <section className="space-y-3">
          <p>
            In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023, the details of the designated Grievance Officer for NextGen IT Hub Private Limited are published below:
          </p>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Mr. Rajesh Deshmukh</h2>
              <p className="text-xs text-slate-500">Designated Grievance & Data Protection Officer</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Email: <a href="mailto:grievance@nextgenithub.in" className="text-blue-600 dark:text-blue-400 font-semibold underline">grievance@nextgenithub.in</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phone: +91 9155282776 (Direct Compliance Desk)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Registered Address: NextGen IT Hub Pvt Ltd, Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Working Hours: Monday to Friday, 10:00 AM – 6:00 PM IST</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Grievance Resolution Timelines (SLA)</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Acknowledgment:</strong> Within 24 hours of ticket receipt.</li>
            <li><strong>Investigation & Redressal:</strong> Within 15 business days in accordance with Indian statutory rules.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
