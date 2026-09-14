import { supabase, isSupabaseConfigured } from './supabase';

const ADMIN_SESSION_KEY = 'portfolio_admin_session';

export interface AdminUser {
  id: string;
  email: string;
  isDemo?: boolean;
}

export async function loginAdmin(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (data.user) {
        const admin: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          isDemo: false,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
        return { user: admin, error: null };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Autentikasi gagal';
      return { user: null, error: msg };
    }
  }

  // Fallback demo admin mode when Supabase credentials are not yet configured in .env
  if (password.length >= 6) {
    const admin: AdminUser = {
      id: 'local-admin-1',
      email: email.trim() || 'admin@portfolio.local',
      isDemo: true,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    return { user: admin, error: null };
  } else {
    return { user: null, error: 'Password minimal 6 karakter' };
  }
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event('admin-auth-changed'));
}
