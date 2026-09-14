import { PortfolioData, Profile, Skill, Project, Experience, Course, Language, Contact } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'portfolio_data_v1';

export const initialData: PortfolioData = {
  profile: {
    id: 'prof-1',
    name: 'Rania Aulia',
    tagline: 'Creative Professional & Content Strategist',
    description: 'Saya memiliki pengalaman dalam pengelolaan konten, desain grafis, dan komunikasi visual. Berfokus pada menciptakan karya yang berdampak dan bermakna.',
    status: 'Terbuka untuk Kolaborasi',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    resume_url: 'https://drive.google.com/file/d/sample-resume/view',
    updated_at: new Date().toISOString(),
  },
  skills: [
    { id: 'sk-1', name: 'Canva', order: 1 },
    { id: 'sk-2', name: 'Adobe Illustrator', order: 2 },
    { id: 'sk-3', name: 'Microsoft Word', order: 3 },
    { id: 'sk-4', name: 'Microsoft Excel', order: 4 },
    { id: 'sk-5', name: 'Copywriting', order: 5 },
    { id: 'sk-6', name: 'Manajemen Media Sosial', order: 6 },
    { id: 'sk-7', name: 'Komunikasi Publik', order: 7 },
    { id: 'sk-8', name: 'Riset Konten', order: 8 },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Kampanye Visual UMKM Lokal',
      description: 'Desain materi promosi, banner digital, dan visual storytelling untuk 5 UMKM kuliner di Medan yang berhasil mendongkrak penjualan sebesar 30%.',
      image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop',
      link: 'https://drive.google.com/drive/folders/sample-umkm',
      order: 1,
    },
    {
      id: 'proj-2',
      title: 'Newsletter Bulanan Komunitas',
      description: 'Pengelolaan konten editorial dan perancangan desain tata letak newsletter berkala untuk 500+ pembaca aktif.',
      image_url: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=800&auto=format&fit=crop',
      link: 'https://drive.google.com/drive/folders/sample-newsletter',
      order: 2,
    },
    {
      id: 'proj-3',
      title: 'Brand Identity & Media Kit',
      description: 'Perancangan identitas visual lengkap mencakup palet warna, tipografi, template media sosial, dan materi cetak profesional.',
      image_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
      link: 'https://drive.google.com/drive/folders/sample-brand',
      order: 3,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      institution: 'PT Kreasi Digital Nusantara',
      role: 'Content Creator Intern',
      year: '2023 – 2024',
      location: 'Medan',
      description: 'Merancang strategi konten editorial mingguan, memproduksi materi grafis, serta meningkatkan engagement akun media sosial sebesar 45%.',
      order: 1,
    },
    {
      id: 'exp-2',
      institution: 'Himpunan Mahasiswa Komunikasi',
      role: 'Koordinator Acara',
      year: '2022 – 2023',
      location: 'Medan',
      description: 'Memimpin divisi kepanitiaan dalam menyelenggarakan seminar komunikasi nasional dengan 300+ peserta.',
      order: 2,
    },
  ],
  courses: [
    {
      id: 'crs-1',
      name: 'Digital Content Masterclass',
      organizer: 'Rakamin Academy',
      year: '2023',
      location: 'Online',
      description: 'Pelatihan intensif strategi storytelling digital, analisis performa konten, dan optimasi visual untuk berbagai kanal media sosial.',
      order: 1,
    },
    {
      id: 'crs-2',
      name: 'Workshop Desain Visual Praktis',
      organizer: 'Kemenparekraf & Studio Kreatif',
      year: '2022',
      location: 'Medan',
      description: 'Pendalaman prinsip tata letak visual, tipografi, dan komposisi warna untuk kampanye promosi dan periklanan.',
      order: 2,
    },
  ],
  languages: [
    { id: 'lang-1', language: 'Bahasa Indonesia', level: 'Native', order: 1 },
    { id: 'lang-2', language: 'Bahasa Inggris', level: 'Intermediate', order: 2 },
    { id: 'lang-3', language: 'Bahasa Mandarin', level: 'Beginner', order: 3 },
  ],
  contacts: [
    { id: 'cnt-1', platform: 'WhatsApp', value: 'https://wa.me/6281234567890', order: 1 },
    { id: 'cnt-2', platform: 'Email', value: 'mailto:rania.aulia.creative@gmail.com', order: 2 },
    { id: 'cnt-3', platform: 'Instagram', value: 'https://instagram.com/rania.creative', order: 3 },
    { id: 'cnt-4', platform: 'LinkedIn', value: 'https://linkedin.com/in/rania-aulia', order: 4 },
  ],
};

export function getLocalData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

export function saveLocalData(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('portfolio-data-updated'));
  } catch (err) {
    console.error('Failed to save portfolio data to localStorage:', err);
  }
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (isSupabaseConfigured && supabase) {
    try {
      const [
        { data: profileData },
        { data: skillsData },
        { data: projectsData },
        { data: experiencesData },
        { data: coursesData },
        { data: languagesData },
        { data: contactsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).single(),
        supabase.from('skills').select('*').order('order', { ascending: true }),
        supabase.from('projects').select('*').order('order', { ascending: true }),
        supabase.from('experiences').select('*').order('order', { ascending: true }),
        supabase.from('courses').select('*').order('order', { ascending: true }),
        supabase.from('languages').select('*').order('order', { ascending: true }),
        supabase.from('contacts').select('*').order('order', { ascending: true }),
      ]);

      const local = getLocalData();
      const combined: PortfolioData = {
        profile: profileData || local.profile,
        skills: skillsData && skillsData.length > 0 ? skillsData : local.skills,
        projects: projectsData && projectsData.length > 0 ? projectsData : local.projects,
        experiences: experiencesData && experiencesData.length > 0 ? experiencesData : local.experiences,
        courses: coursesData && coursesData.length > 0 ? coursesData : local.courses,
        languages: languagesData && languagesData.length > 0 ? languagesData : local.languages,
        contacts: contactsData && contactsData.length > 0 ? contactsData : local.contacts,
      };
      saveLocalData(combined);
      return combined;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local data:', err);
      return getLocalData();
    }
  }
  return getLocalData();
}

export async function updateProfile(updated: Partial<Profile>): Promise<Profile> {
  const current = getLocalData();
  const newProfile = { ...current.profile, ...updated, updated_at: new Date().toISOString() };
  const updatedData = { ...current, profile: newProfile };
  saveLocalData(updatedData);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').upsert(newProfile);
    } catch (err) {
      console.error('Supabase profile update error:', err);
    }
  }
  return newProfile;
}

export async function upsertSkill(skill: Skill): Promise<Skill> {
  const current = getLocalData();
  const exists = current.skills.some((s) => s.id === skill.id);
  const newSkills = exists
    ? current.skills.map((s) => (s.id === skill.id ? skill : s))
    : [...current.skills, skill];
  
  newSkills.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, skills: newSkills });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('skills').upsert(skill);
    } catch (err) {
      console.error('Supabase upsert skill error:', err);
    }
  }
  return skill;
}

export async function deleteSkill(id: string): Promise<void> {
  const current = getLocalData();
  const newSkills = current.skills.filter((s) => s.id !== id);
  saveLocalData({ ...current, skills: newSkills });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete skill error:', err);
    }
  }
}

export async function upsertProject(project: Project): Promise<Project> {
  const current = getLocalData();
  const exists = current.projects.some((p) => p.id === project.id);
  const newProjects = exists
    ? current.projects.map((p) => (p.id === project.id ? project : p))
    : [...current.projects, project];

  newProjects.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, projects: newProjects });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').upsert(project);
    } catch (err) {
      console.error('Supabase upsert project error:', err);
    }
  }
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const current = getLocalData();
  const newProjects = current.projects.filter((p) => p.id !== id);
  saveLocalData({ ...current, projects: newProjects });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete project error:', err);
    }
  }
}

export async function upsertExperience(experience: Experience): Promise<Experience> {
  const current = getLocalData();
  const exists = current.experiences.some((e) => e.id === experience.id);
  const newExperiences = exists
    ? current.experiences.map((e) => (e.id === experience.id ? experience : e))
    : [...current.experiences, experience];

  newExperiences.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, experiences: newExperiences });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('experiences').upsert(experience);
    } catch (err) {
      console.error('Supabase upsert experience error:', err);
    }
  }
  return experience;
}

export async function deleteExperience(id: string): Promise<void> {
  const current = getLocalData();
  const newExperiences = current.experiences.filter((e) => e.id !== id);
  saveLocalData({ ...current, experiences: newExperiences });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('experiences').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete experience error:', err);
    }
  }
}

export async function upsertCourse(course: Course): Promise<Course> {
  const current = getLocalData();
  const exists = current.courses.some((c) => c.id === course.id);
  const newCourses = exists
    ? current.courses.map((c) => (c.id === course.id ? course : c))
    : [...current.courses, course];

  newCourses.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, courses: newCourses });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('courses').upsert(course);
    } catch (err) {
      console.error('Supabase upsert course error:', err);
    }
  }
  return course;
}

export async function deleteCourse(id: string): Promise<void> {
  const current = getLocalData();
  const newCourses = current.courses.filter((c) => c.id !== id);
  saveLocalData({ ...current, courses: newCourses });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete course error:', err);
    }
  }
}

export async function upsertLanguage(language: Language): Promise<Language> {
  const current = getLocalData();
  const exists = current.languages.some((l) => l.id === language.id);
  const newLanguages = exists
    ? current.languages.map((l) => (l.id === language.id ? language : l))
    : [...current.languages, language];

  newLanguages.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, languages: newLanguages });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('languages').upsert(language);
    } catch (err) {
      console.error('Supabase upsert language error:', err);
    }
  }
  return language;
}

export async function deleteLanguage(id: string): Promise<void> {
  const current = getLocalData();
  const newLanguages = current.languages.filter((l) => l.id !== id);
  saveLocalData({ ...current, languages: newLanguages });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('languages').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete language error:', err);
    }
  }
}

export async function upsertContact(contact: Contact): Promise<Contact> {
  const current = getLocalData();
  const exists = current.contacts.some((c) => c.id === contact.id);
  const newContacts = exists
    ? current.contacts.map((c) => (c.id === contact.id ? contact : c))
    : [...current.contacts, contact];

  newContacts.sort((a, b) => a.order - b.order);
  saveLocalData({ ...current, contacts: newContacts });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contacts').upsert(contact);
    } catch (err) {
      console.error('Supabase upsert contact error:', err);
    }
  }
  return contact;
}

export async function deleteContact(id: string): Promise<void> {
  const current = getLocalData();
  const newContacts = current.contacts.filter((c) => c.id !== id);
  saveLocalData({ ...current, contacts: newContacts });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contacts').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete contact error:', err);
    }
  }
}

export function resetToDefaultData(): PortfolioData {
  saveLocalData(initialData);
  return initialData;
}
