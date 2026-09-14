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

  // Initialize path from browser URL, hash, or query params
  useEffect(() => {
    const parseRouteFromLocation = (): RouteState => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();

      const isAdminDashboard =
        path.includes('/admin/dashboard') ||
        hash.includes('admin/dashboard') ||
        search.includes('route=admin/dashboard');

      const isAdminLoginOrAny =
        path.includes('/admin') ||
        hash.includes('admin') ||
        hash.includes('login') ||
        search.includes('admin');

      if (isAdminDashboard) {
        const admin = getCurrentAdmin();
        return admin ? 'admin_dashboard' : 'admin_login';
      }

      if (isAdminLoginOrAny) {
        const admin = getCurrentAdmin();
        return admin ? 'admin_dashboard' : 'admin_login';
      }

      return 'home';
    };

    setCurrentRoute(parseRouteFromLocation());

    const handleRouteChange = () => {
      setCurrentRoute(parseRouteFromLocation());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
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
    // Normalisasi rute
    const isDashboard = path.includes('/admin/dashboard') || path.includes('admin/dashboard');
    const isAdmin = path.includes('/admin') || path.includes('admin');

    if (isDashboard) {
      window.history.pushState(null, '', '/admin/dashboard');
      window.location.hash = '#/admin/dashboard';
      const admin = getCurrentAdmin();
      setCurrentRoute(admin ? 'admin_dashboard' : 'admin_login');
    } else if (isAdmin) {
      window.history.pushState(null, '', '/admin/login');
      window.location.hash = '#/admin/login';
      const admin = getCurrentAdmin();
      setCurrentRoute(admin ? 'admin_dashboard' : 'admin_login');
    } else {
      window.history.pushState(null, '', '/');
      if (window.location.hash.includes('admin')) {
        window.location.hash = '';
      }
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
          <Header profile={data.profile} onNavigateAdmin={() => navigateTo('/admin/login')} />
          <main className="flex-1">
            <HeroSection profile={data.profile} />
            <SkillsSection skills={data.skills} />
            <PortfolioSection projects={data.projects} />
            <ExperienceSection experiences={data.experiences} />
            <CourseSection courses={data.courses} />
            <LanguagesSection languages={data.languages} />
            <ContactSection contacts={data.contacts} />
          </main>
          <Footer profile={data.profile} onNavigateAdmin={() => navigateTo('/admin/login')} />

          {/* Discrete route switcher badge for preview environment */}
          <div className="fixed bottom-3 right-3 z-40">
            {showDevRouteHelper ? (
              <div className="bg-neutral-900 text-white rounded-2xl shadow-xl p-3.5 text-xs border border-neutral-700 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between gap-4 font-semibold pb-1.5 border-b border-neutral-800">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Shield className="w-3.5 h-3.5" /> Akses Langsung Panel Admin
                  </span>
                  <button
                    onClick={() => setShowDevRouteHelper(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <p className="text-neutral-300 text-2xs leading-relaxed max-w-[240px]">
                  Bisa diakses melalui tombol di bawah, menu header/footer, URL <code className="text-blue-300 font-mono">/admin/login</code> atau <code className="text-blue-300 font-mono">/#/admin/login</code>.
                </p>
                <button
                  onClick={() => navigateTo('/admin/login')}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
                >
                  <span>Masuk ke /admin/login</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDevRouteHelper(true)}
                title="Buka panel navigasi admin (Ctrl+Shift+A)"
                className="opacity-70 hover:opacity-100 py-1.5 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-900 text-neutral-200 hover:text-white text-xs transition-all shadow-md backdrop-blur-xs flex items-center gap-1.5 border border-neutral-800"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold">Login Admin</span>
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
