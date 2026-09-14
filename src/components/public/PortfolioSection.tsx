import React from 'react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { Project } from '../../types';

interface PortfolioSectionProps {
  projects: Project[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="project" className="py-20 border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Karya & Portofolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Project Unggulan
            </h2>
          </div>
          <p className="text-neutral-500 text-sm sm:text-base mt-2 sm:mt-0 max-w-md">
            Dokumentasi proyek kerja sama, hasil perancangan, dan inisiatif kreatif
          </p>
        </div>

        {/* Grid 1 kolom di mobile, 2-3 kolom di desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((proj) => (
            <article
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              {/* Gambar Project jika ada */}
              {proj.image_url ? (
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center text-neutral-400 border-b border-neutral-100">
                  <FolderGit2 className="w-10 h-10 stroke-[1.5]" />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors mb-2">
                  {proj.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-5 flex-1">
                  {proj.description}
                </p>

                {proj.link && (
                  <div className="pt-2 border-t border-neutral-100">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>Lihat Detail Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
