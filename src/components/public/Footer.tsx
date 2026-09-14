import React from 'react';
import { Profile } from '../../types';

interface FooterProps {
  profile: Profile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
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
      </div>
    </footer>
  );
};
