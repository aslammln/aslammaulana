export interface Profile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  avatar_url: string;
  resume_url: string | null;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  order: number;
  created_at?: string;
}

export interface Experience {
  id: string;
  institution: string;
  role: string;
  year: string;
  location: string;
  description: string;
  order: number;
  created_at?: string;
}

export interface Course {
  id: string;
  name: string;
  organizer: string;
  year: string;
  location: string;
  description: string;
  order: number;
  created_at?: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
  order: number;
  created_at?: string;
}

export interface Contact {
  id: string;
  platform: string;
  value: string;
  order: number;
  created_at?: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  courses: Course[];
  languages: Language[];
  contacts: Contact[];
}
