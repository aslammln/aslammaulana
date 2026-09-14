import React from 'react';
import { Mail, MessageCircle, Instagram, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { Contact } from '../../types';

interface ContactSectionProps {
  contacts: Contact[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contacts }) => {
  if (!contacts || contacts.length === 0) return null;

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('whatsapp') || p.includes('wa')) {
      return <MessageCircle className="w-5 h-5 text-emerald-600" />;
    }
    if (p.includes('mail')) {
      return <Mail className="w-5 h-5 text-blue-600" />;
    }
    if (p.includes('instagram') || p.includes('ig')) {
      return <Instagram className="w-5 h-5 text-pink-600" />;
    }
    if (p.includes('linkedin')) {
      return <Linkedin className="w-5 h-5 text-blue-700" />;
    }
    return <Globe className="w-5 h-5 text-neutral-600" />;
  };

  const formatDisplayValue = (contact: Contact) => {
    const val = contact.value;
    if (val.startsWith('mailto:')) return val.replace('mailto:', '');
    if (val.startsWith('https://wa.me/')) return val.replace('https://wa.me/', '+');
    if (val.startsWith('https://instagram.com/')) return '@' + val.replace('https://instagram.com/', '').replace('/', '');
    if (val.startsWith('https://linkedin.com/in/')) return 'in/' + val.replace('https://linkedin.com/in/', '').replace('/', '');
    return val;
  };

  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Terhubung & Diskusi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-3">
            Hubungi Saya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Terbuka untuk diskusi proyek, tawaran peluang karier, maupun kolaborasi kreatif
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              id={`contact-card-${contact.id}`}
              href={contact.value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getPlatformIcon(contact.platform)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {contact.platform}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-neutral-900 truncate group-hover:text-blue-600 transition-colors">
                    {formatDisplayValue(contact)}
                  </div>
                </div>
              </div>

              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
