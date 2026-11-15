'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Grade = 'A+' | 'A' | 'B';

interface GradeInfo {
  label: Grade;
  title: string;
  description: string;
  details: string[];
  colorClasses: string;
  badgeClasses: string;
}

const GRADES: GradeInfo[] = [
  {
    label: 'A+',
    title: 'Like New',
    description: 'Practically indistinguishable from a brand-new laptop.',
    details: [
      'No visible scratches or dents',
      'Screen is flawless — no dead pixels, no marks',
      'Battery health ≥ 85%',
      'Full performance, all ports tested and working',
      'Cleaned and sanitized',
    ],
    colorClasses: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    badgeClasses: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  },
  {
    label: 'A',
    title: 'Light Wear',
    description: 'Very light signs of use. Looks great, works perfectly.',
    details: [
      'Minor cosmetic marks visible only up close',
      'Screen fully functional — may have very faint marks',
      'Battery health ≥ 75%',
      'All hardware tested and working',
      'Cleaned and sanitized',
    ],
    colorClasses: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    badgeClasses: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  },
  {
    label: 'B',
    title: 'Visible Wear',
    description: 'Noticeable signs of use but fully functional.',
    details: [
      'Visible scratches or minor dents on body',
      'Screen works perfectly — cosmetic marks possible',
      'Battery health ≥ 60%',
      'All hardware thoroughly tested and working',
      'Cleaned and sanitized',
    ],
    colorClasses: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    badgeClasses: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  },
];

interface GradeExplainerProps {
  highlight?: Grade;
  compact?: boolean;
}

export function GradeBadge({ grade }: { grade: Grade }) {
  const info = GRADES.find((g) => g.label === grade)!;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${info.badgeClasses}`}>
      <span className="font-bold">Grade {grade}</span>
      <span className="text-xs font-normal opacity-80">— {info.title}</span>
    </span>
  );
}

export default function GradeExplainer({ highlight, compact = false }: GradeExplainerProps) {
  const [expanded, setExpanded] = useState<Grade | null>(highlight ?? null);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Understanding Our Laptop Grades
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Every laptop is inspected, tested, and graded before sale.
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {GRADES.map((grade) => {
          const isExpanded = expanded === grade.label;
          const isHighlighted = highlight === grade.label;

          return (
            <div
              key={grade.label}
              className={`${isHighlighted ? grade.colorClasses + ' border-l-4' : ''}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : grade.label)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm ${grade.badgeClasses}`}>
                    {grade.label}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {grade.title}
                    </div>
                    {!compact && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {grade.description}
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {grade.description}
                  </p>
                  <ul className="space-y-1.5">
                    {grade.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/40 border-t border-blue-100 dark:border-blue-900">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          🛡️ All grades come with our <strong>NextGen Quality Guarantee</strong> — 100% tested, with warranty.
        </p>
      </div>
    </div>
  );
}
