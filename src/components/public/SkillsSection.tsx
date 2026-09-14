import React from 'react';
import { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="keahlian" className="py-16 border-b border-neutral-100 bg-neutral-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
            Keahlian & Kompetensi
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Perangkat lunak, keterampilan teknis, dan keahlian profesional yang dikuasai
          </p>
        </div>

        {/* Layout flex-wrap chip sederhana tanpa level */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <div
              key={skill.id}
              id={`skill-chip-${skill.id}`}
              className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200/90 text-neutral-800 text-sm sm:text-base font-medium shadow-xs hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default"
            >
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
