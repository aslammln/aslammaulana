import React from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="pengalaman" className="py-20 border-b border-neutral-100 bg-neutral-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Karier & Perjalanan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
            Pengalaman Kerja
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            Jejak karier, tanggung jawab kepemimpinan, dan kontribusi profesional
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              id={`exp-card-${exp.id}`}
              className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs hover:border-blue-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                    {exp.role}
                  </h3>
                  <div className="text-base font-medium text-blue-600">
                    {exp.institution}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-500 shrink-0">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{exp.year}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mt-3 pt-3 border-t border-neutral-100">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
