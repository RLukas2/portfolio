/**
 * Company information for work experience entries
 */
export interface Company {
  jobType: 'Full-time' | 'Freelance';
  location: string;
  logo: string;
  name: string;
  url: string;
  workingArrangement: 'Remote' | 'Hybrid' | 'On-Site';
}

/**
 * Educational institution information
 */
export interface Institution {
  location: string;
  logo?: string; // Optional - falls back to graduation cap icon
  name: string;
  url?: string; // Optional - link to institution website
}

/**
 * Education entry in career timeline
 */
export interface Education {
  accomplishments?: string[]; // Optional - coursework, achievements, projects, etc.
  degree: string;
  endDate: string | null;
  fieldOfStudy: string;
  institution: Institution;
  startDate: string;
}

/**
 * Work experience entry in career timeline
 */
export interface Experience {
  accomplishments: string[];
  company: Company;
  endDate: string | null;
  role: string;
  stacks: string[]; // Array of tech stack names (e.g., ['TypeScript', 'React'])
  startDate: string;
}

/**
 * Timeline entry types with discriminants
 */
export type ExperienceEntry = Experience & { type: 'experience' };
export type EducationEntry = Education & { type: 'education' };

/**
 * Union type for timeline entries
 */
export type TimelineEntry = ExperienceEntry | EducationEntry;
