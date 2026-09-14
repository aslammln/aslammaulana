import React from 'react';
import { Award, Calendar, MapPin } from 'lucide-react';
import { Course } from '../../types';

interface CourseSectionProps {
  courses: Course[];
}

export const CourseSection: React.FC<CourseSectionProps> = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <section id="pelatihan" className="py-20 border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Pengembangan Diri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
            Pelatihan & Kursus
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            Sertifikasi, lokakarya, dan program peningkatan kompetensi yang telah diselesaikan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((crs) => (
            <div
              key={crs.id}
              id={`course-card-${crs.id}`}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-200 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {crs.name}
                  </h3>
                </div>
                <div className="text-sm font-medium text-blue-600 mb-3">
                  {crs.organizer}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-3.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>{crs.year}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{crs.location}</span>
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {crs.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
