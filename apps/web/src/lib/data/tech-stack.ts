/**
 * Tech Stack Configuration
 * Defines all technologies displayed in the portfolio
 * Migrated from temp/src/constants/stacks.tsx and enhanced with categories
 */

import type { SimpleIcon } from 'simple-icons';
import {
  siAmazonwebservices,
  siCplusplus,
  siDocker,
  siDotnet,
  siExpress,
  siFramer,
  siGin,
  siGit,
  siGo,
  siJavascript,
  siJest,
  siMdx,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siRabbitmq,
  siReact,
  siReactquery,
  siRedis,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siUnity,
  siVercel,
} from 'simple-icons';

export interface TechStack {
  /** Category for grouping */
  category: 'language' | 'framework' | 'database' | 'tool' | 'platform';
  /** Brand color in hex format */
  color: string;
  /** Optional description for the technology */
  description?: string;
  /** Simple Icon object */
  icon: SimpleIcon;
  name: string;
}

/**
 * Main tech stack list
 * Add or remove technologies as needed
 */
export const techStacks: TechStack[] = [
  // Languages
  {
    name: 'TypeScript',
    icon: siTypescript,
    color: '#3178C6',
    category: 'language',
    description: 'Typed superset of JavaScript',
  },
  {
    name: 'JavaScript',
    icon: siJavascript,
    color: '#F7DF1E',
    category: 'language',
    description: 'Dynamic programming language for web',
  },
  {
    name: 'Python',
    icon: siPython,
    color: '#3776AB',
    category: 'language',
    description: 'High-level programming language',
  },
  {
    name: 'Go',
    icon: siGo,
    color: '#00ADD8',
    category: 'language',
    description: 'Fast and efficient compiled language',
  },
  {
    name: 'C++',
    icon: siCplusplus,
    color: '#00599C',
    category: 'language',
    description: 'High-performance systems programming',
  },
  {
    name: 'C#',
    icon: siDotnet,
    color: '#68217A',
    category: 'language',
    description: 'Modern object-oriented language',
  },

  // Frontend Frameworks & Libraries
  {
    name: 'React',
    icon: siReact,
    color: '#61DAFB',
    category: 'framework',
    description: 'JavaScript library for building UIs',
  },
  {
    name: 'Next.js',
    icon: siNextdotjs,
    color: '#000000',
    category: 'framework',
    description: 'React framework for production',
  },
  {
    name: 'TanStack Router',
    icon: siReactquery,
    color: '#FF4154',
    category: 'framework',
    description: 'Type-safe routing for React',
  },
  {
    name: 'Tailwind CSS',
    icon: siTailwindcss,
    color: '#06B6D4',
    category: 'framework',
    description: 'Utility-first CSS framework',
  },
  {
    name: 'Framer Motion',
    icon: siFramer,
    color: '#0055FF',
    category: 'framework',
    description: 'Animation library for React',
  },
  {
    name: 'shadcn/ui',
    icon: siShadcnui,
    color: '#000000',
    category: 'framework',
    description: 'Re-usable component library',
  },
  {
    name: 'MDX',
    icon: siMdx,
    color: '#000000',
    category: 'framework',
    description: 'Markdown with JSX components',
  },

  // Backend Frameworks
  {
    name: 'Node.js',
    icon: siNodedotjs,
    color: '#339933',
    category: 'framework',
    description: 'JavaScript runtime for server',
  },
  {
    name: 'Express.js',
    icon: siExpress,
    color: '#000000',
    category: 'framework',
    description: 'Fast Node.js web framework',
  },
  {
    name: 'Gin',
    icon: siGin,
    color: '#00ADD8',
    category: 'framework',
    description: 'Go web framework',
  },

  // Databases & ORMs
  {
    name: 'PostgreSQL',
    icon: siPostgresql,
    color: '#4169E1',
    category: 'database',
    description: 'Advanced relational database',
  },
  {
    name: 'MongoDB',
    icon: siMongodb,
    color: '#47A248',
    category: 'database',
    description: 'NoSQL document database',
  },
  {
    name: 'Redis',
    icon: siRedis,
    color: '#FF4438',
    category: 'database',
    description: 'In-memory data store',
  },
  {
    name: 'Supabase',
    icon: siSupabase,
    color: '#3FCF83',
    category: 'database',
    description: 'Open source Firebase alternative',
  },
  {
    name: 'Prisma',
    icon: siPrisma,
    color: '#2D3748',
    category: 'database',
    description: 'Next-generation ORM',
  },

  // Tools & Platforms
  {
    name: 'Docker',
    icon: siDocker,
    color: '#2496ED',
    category: 'tool',
    description: 'Container platform',
  },
  {
    name: 'Git',
    icon: siGit,
    color: '#F05032',
    category: 'tool',
    description: 'Version control system',
  },
  {
    name: 'Postman',
    icon: siPostman,
    color: '#FF6C37',
    category: 'tool',
    description: 'API development platform',
  },
  {
    name: 'Jest',
    icon: siJest,
    color: '#C21325',
    category: 'tool',
    description: 'JavaScript testing framework',
  },
  {
    name: 'RabbitMQ',
    icon: siRabbitmq,
    color: '#FF6600',
    category: 'tool',
    description: 'Message broker',
  },
  {
    name: 'Unity',
    icon: siUnity,
    color: '#000000',
    category: 'platform',
    description: 'Game development platform',
  },
  {
    name: 'AWS',
    icon: siAmazonwebservices,
    color: '#FF9900',
    category: 'platform',
    description: 'Cloud computing platform',
  },
  {
    name: 'Vercel',
    icon: siVercel,
    color: '#000000',
    category: 'platform',
    description: 'Deployment and hosting platform',
  },
];

/**
 * Group tech stacks by category
 */
export const techStacksByCategory = {
  languages: techStacks.filter((t) => t.category === 'language'),
  frameworks: techStacks.filter((t) => t.category === 'framework'),
  databases: techStacks.filter((t) => t.category === 'database'),
  tools: techStacks.filter((t) => t.category === 'tool'),
  platforms: techStacks.filter((t) => t.category === 'platform'),
};

/**
 * Featured tech stacks for hero section
 * Limit to 6-8 for best visual impact
 */
export const featuredTechStacks = techStacks.slice(0, 8);

/**
 * Core tech stacks - primary technologies used in the portfolio
 * Equivalent to CORE_STACKS from temp folder
 */
export const coreTechStacks: TechStack[] = [
  'Next.js',
  'React',
  'Tailwind CSS',
  'MDX',
  'Framer Motion',
  'TypeScript',
  'Vercel',
  'shadcn/ui',
  'Prisma',
]
  .map((name) => techStacks.find((t) => t.name === name))
  .filter((stack): stack is TechStack => stack !== undefined);

/**
 * Get tech stacks by names
 */
export const getTechStacksByNames = (names: string[]): TechStack[] => {
  return techStacks.filter((tech) => names.includes(tech.name));
};
