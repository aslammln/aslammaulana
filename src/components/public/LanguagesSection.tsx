import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <section id="bahasa" className="py-16 border-b border-neutral-100 bg-neutral-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Komunikasi Global</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            Kemahiran Bahasa
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Bahasa komunikasi yang digunakan dalam lingkungan kerja dan kolaborasi
          </p>
        </div>

        {/* Format teks daftar: {bahasa} — {level}, tanpa progress bar */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
          <ul className="divide-y divide-neutral-100">
            {languages.map((item) => (
              <li
                key={item.id}
                id={`lang-item-${item.id}`}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-base"
              >
                <span className="font-semibold text-neutral-900">
                  {item.language}
                </span>
                <span className="text-sm font-medium text-neutral-600">
                  — {item.level}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
