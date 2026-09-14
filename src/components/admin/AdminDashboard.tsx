import React, { useState } from 'react';
import {
  User,
  FolderGit2,
  Wrench,
  Briefcase,
  Award,
  Globe,
  Mail,
  Database,
  ExternalLink,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { PortfolioData, Profile, Skill, Project, Experience, Course, Language, Contact } from '../../types';
import {
  updateProfile,
  upsertProject,
  deleteProject,
  upsertSkill,
  deleteSkill,
  upsertExperience,
  deleteExperience,
  upsertCourse,
  deleteCourse,
  upsertLanguage,
  deleteLanguage,
  upsertContact,
  deleteContact,
  resetToDefaultData,
} from '../../lib/dataStore';
import { getCurrentAdmin, logoutAdmin } from '../../lib/auth';
import { ProfileForm } from './ProfileForm';
import { ProjectForm } from './ProjectForm';
import { SkillForm } from './SkillForm';
import { ExperienceForm } from './ExperienceForm';
import { CourseForm } from './CourseForm';
import { LanguageForm } from './LanguageForm';
import { ContactForm } from './ContactForm';
import { SupabaseSetupGuide } from './SupabaseSetupGuide';

interface AdminDashboardProps {
  data: PortfolioData;
  onDataChange: (newData: PortfolioData) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
}

type TabType =
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experiences'
  | 'courses'
  | 'languages'
  | 'contacts'
  | 'supabase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onDataChange,
  onNavigateHome,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const admin = getCurrentAdmin();

  const handleUpdateProfile = async (updated: Partial<Profile>) => {
    const newProfile = await updateProfile(updated);
    onDataChange({ ...data, profile: newProfile });
  };

  const handleSaveProject = async (proj: Project) => {
    const saved = await upsertProject(proj);
    const updated = data.projects.some((p) => p.id === saved.id)
      ? data.projects.map((p) => (p.id === saved.id ? saved : p))
      : [...data.projects, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, projects: updated });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    onDataChange({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  const handleSaveSkill = async (skill: Skill) => {
    const saved = await upsertSkill(skill);
    const updated = data.skills.some((s) => s.id === saved.id)
      ? data.skills.map((s) => (s.id === saved.id ? saved : s))
      : [...data.skills, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, skills: updated });
  };

  const handleDeleteSkill = async (id: string) => {
    await deleteSkill(id);
    onDataChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  const handleSaveExperience = async (exp: Experience) => {
    const saved = await upsertExperience(exp);
    const updated = data.experiences.some((e) => e.id === saved.id)
      ? data.experiences.map((e) => (e.id === saved.id ? saved : e))
      : [...data.experiences, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, experiences: updated });
  };

  const handleDeleteExperience = async (id: string) => {
    await deleteExperience(id);
    onDataChange({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
  };

  const handleSaveCourse = async (crs: Course) => {
    const saved = await upsertCourse(crs);
    const updated = data.courses.some((c) => c.id === saved.id)
      ? data.courses.map((c) => (c.id === saved.id ? saved : c))
      : [...data.courses, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, courses: updated });
  };

  const handleDeleteCourse = async (id: string) => {
    await deleteCourse(id);
    onDataChange({ ...data, courses: data.courses.filter((c) => c.id !== id) });
  };

  const handleSaveLanguage = async (lang: Language) => {
    const saved = await upsertLanguage(lang);
    const updated = data.languages.some((l) => l.id === saved.id)
      ? data.languages.map((l) => (l.id === saved.id ? saved : l))
      : [...data.languages, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, languages: updated });
  };

  const handleDeleteLanguage = async (id: string) => {
    await deleteLanguage(id);
    onDataChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  };

  const handleSaveContact = async (cnt: Contact) => {
    const saved = await upsertContact(cnt);
    const updated = data.contacts.some((c) => c.id === saved.id)
      ? data.contacts.map((c) => (c.id === saved.id ? saved : c))
      : [...data.contacts, saved];
    updated.sort((a, b) => a.order - b.order);
    onDataChange({ ...data, contacts: updated });
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    onDataChange({ ...data, contacts: data.contacts.filter((c) => c.id !== id) });
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data ke data default (Rania Aulia)?')) {
      const reset = resetToDefaultData();
      onDataChange(reset);
    }
  };

  const handleLogoutClick = async () => {
    await logoutAdmin();
    onLogout();
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Project', icon: <FolderGit2 className="w-4 h-4" />, count: data.projects.length },
    { id: 'skills', label: 'Keahlian', icon: <Wrench className="w-4 h-4" />, count: data.skills.length },
    { id: 'experiences', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" />, count: data.experiences.length },
    { id: 'courses', label: 'Pelatihan', icon: <Award className="w-4 h-4" />, count: data.courses.length },
    { id: 'languages', label: 'Bahasa', icon: <Globe className="w-4 h-4" />, count: data.languages.length },
    { id: 'contacts', label: 'Kontak', icon: <Mail className="w-4 h-4" />, count: data.contacts.length },
    { id: 'supabase', label: 'Supabase SQL', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-100/70">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-neutral-500 truncate max-w-[180px] sm:max-w-xs">
                  {admin?.email || 'admin@portfolio.local'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors"
                title="Buka Website Publik"
              >
                <span>Lihat Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetData}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
                title="Reset Data ke Contoh Awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Contoh</span>
              </button>

              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                title="Keluar dari Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Horizontal Scrollable on Mobile) */}
        <div className="border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-0.5 text-2xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-8">
          {activeTab === 'profile' && (
            <ProfileForm profile={data.profile} onSave={handleUpdateProfile} />
          )}

          {activeTab === 'projects' && (
            <ProjectForm
              projects={data.projects}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeTab === 'skills' && (
            <SkillForm
              skills={data.skills}
              onSaveSkill={handleSaveSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          )}

          {activeTab === 'experiences' && (
            <ExperienceForm
              experiences={data.experiences}
              onSaveExperience={handleSaveExperience}
              onDeleteExperience={handleDeleteExperience}
            />
          )}

          {activeTab === 'courses' && (
            <CourseForm
              courses={data.courses}
              onSaveCourse={handleSaveCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'languages' && (
            <LanguageForm
              languages={data.languages}
              onSaveLanguage={handleSaveLanguage}
              onDeleteLanguage={handleDeleteLanguage}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactForm
              contacts={data.contacts}
              onSaveContact={handleSaveContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'supabase' && <SupabaseSetupGuide />}
        </div>
      </main>
    </div>
  );
};
