import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { fetchPortfolioData, getLocalData } from './lib/dataStore';
import { getCurrentAdmin } from './lib/auth';
import { Header } from './components/public/Header';
import { HeroSection } from './components/public/HeroSection';
import { SkillsSection } from './components/public/SkillsSection';
import { PortfolioSection } from './components/public/PortfolioSection';
import { ExperienceSection } from './components/public/ExperienceSection';
import { CourseSection } from './components/public/CourseSection';
import { LanguagesSection } from './components/public/LanguagesSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield, ExternalLink } from 'lucide-react';

type RouteState = 'home' | 'admin_login' | 'admin_dashboard';

export default function App() {
  const [data, setData] = useState<PortfolioData>(getLocalData());
  const [currentRoute, setCurrentRoute] = useState<RouteState>('home');
  const [showDevRouteHelper, setShowDevRouteHelper] = useState(false);

  // Initialize path from browser URL or hash
  useEffect(() => {
    const parseRouteFromLocation = (): RouteState => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.includes('/admin/dashboard') || hash.includes('admin/dashboard')) {
        const admin = getCurrentAdmin();
        return admin ? 'admin_dashboard' : 'admin_login';
      }
      if (path.includes('/admin') || hash.includes('admin')) {
        const admin = getCurrentAdmin();
        return admin ? 'admin_dashboard' : 'admin_login';
      }
      return 'home';
    };

    setCurrentRoute(parseRouteFromLocation());

    const handlePopState = () => {
      setCurrentRoute(parseRouteFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch from Supabase or localStorage
  useEffect(() => {
    fetchPortfolioData().then((fetched) => {
      if (fetched) setData(fetched);
    });

    const handleDataUpdated = () => {
      setData(getLocalData());
    };

    window.addEventListener('portfolio-data-updated', handleDataUpdated);
    return () => window.removeEventListener('portfolio-data-updated', handleDataUpdated);
  }, []);

  // Dynamic document title update (PRD Section 7.1)
  useEffect(() => {
    if (data.profile?.name) {
      document.title = `${data.profile.name} | Personal Portfolio Website`;
    }
  }, [data.profile?.name]);

  // Keyboard shortcut listener: Ctrl+Shift+A or Cmd+Shift+A to jump to /admin/login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigateTo('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    if (path.includes('/admin/dashboard')) {
      const admin = getCurrentAdmin();
      setCurrentRoute(admin ? 'admin_dashboard' : 'admin_login');
    } else if (path.includes('/admin/login') || path.includes('/admin')) {
      const admin = getCurrentAdmin();
      setCurrentRoute(admin ? 'admin_dashboard' : 'admin_login');
    } else {
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    navigateTo('/admin/dashboard');
  };

  const handleLogout = () => {
    navigateTo('/admin/login');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-['Geist',sans-serif]">
      {/* Route Views */}
      {currentRoute === 'home' && (
        <>
          <Header profile={data.profile} />
          <main className="flex-1">
            <HeroSection profile={data.profile} />
            <SkillsSection skills={data.skills} />
            <PortfolioSection projects={data.projects} />
            <ExperienceSection experiences={data.experiences} />
            <CourseSection courses={data.courses} />
            <LanguagesSection languages={data.languages} />
            <ContactSection contacts={data.contacts} />
          </main>
          <Footer profile={data.profile} />

          {/* Discrete route switcher badge for preview environment */}
          <div className="fixed bottom-3 right-3 z-40">
            {showDevRouteHelper ? (
              <div className="bg-neutral-900 text-white rounded-2xl shadow-xl p-3 text-xs border border-neutral-700 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between gap-4 font-semibold pb-1.5 border-b border-neutral-800">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Shield className="w-3.5 h-3.5" /> Akses Langsung URL
                  </span>
                  <button
                    onClick={() => setShowDevRouteHelper(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <p className="text-neutral-300 text-2xs leading-relaxed max-w-[210px]">
                  Sesuai PRD 7.9, link admin tersembunyi dari publik dan diakses via URL <code className="text-blue-300">/admin/login</code>.
                </p>
                <button
                  onClick={() => navigateTo('/admin/login')}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
                >
                  <span>Buka /admin/login</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDevRouteHelper(true)}
                title="Buka navigasi rute /admin/login (Ctrl+Shift+A)"
                className="opacity-40 hover:opacity-100 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs transition-opacity shadow-md backdrop-blur-xs flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="text-2xs font-medium hidden sm:inline">/admin</span>
              </button>
            )}
          </div>
        </>
      )}

      {currentRoute === 'admin_login' && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => navigateTo('/')}
        />
      )}

      {currentRoute === 'admin_dashboard' && (
        <AdminDashboard
          data={data}
          onDataChange={(newData) => setData(newData)}
          onNavigateHome={() => navigateTo('/')}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
