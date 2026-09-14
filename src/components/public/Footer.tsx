import React from 'react';
import { Lock } from 'lucide-react';
import { Profile } from '../../types';

interface FooterProps {
  profile: Profile;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigateAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-100 bg-neutral-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-neutral-800 mb-1">
          {profile.name}
        </p>
        <p className="text-xs text-neutral-500">
          © {currentYear} Personal Portfolio Website. Seluruh hak cipta dilindungi.
        </p>
        {onNavigateAdmin && (
          <div className="mt-4">
            <button
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-neutral-100"
              title="Akses Halaman Login Admin"
            >
              <Lock className="w-3 h-3" />
              <span>Login Admin</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
