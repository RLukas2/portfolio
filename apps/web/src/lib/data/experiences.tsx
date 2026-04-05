import type { Experience } from '@/lib/types/resume';

/**
 * Work experience data for career timeline
 *
 * This array contains all professional work experiences in chronological order.
 * Each entry includes company information, role, dates, tech stack, and accomplishments.
 *
 * Tech stack should only contain names - icons are rendered by the component.
 *
 * Update this file to add new work experiences or modify existing ones.
 */
export const EXPERIENCES: Experience[] = [
  {
    company: {
      name: 'Sample Corp',
      logo: '/media/resume/samplecorp.jpg',
      url: 'https://samplecorp.com',
      location: 'Sample City',
      workingArrangement: 'Remote',
      jobType: 'Full-time',
    },
    role: 'Software Engineer',
    startDate: '2025-12',
    endDate: null, // Present
    stacks: ['TypeScript', 'React'],
    accomplishments: [
      'Developed and maintained web applications using React and TypeScript.',
      'Collaborated with cross-functional teams to define, design, and ship new features.',
    ],
  },
];
