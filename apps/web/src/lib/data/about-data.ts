import type { LucideIcon } from 'lucide-react';
import { Briefcase, Code2, GraduationCap, Wrench } from 'lucide-react';

export interface WhatIDoItem {
  desc: string;
  title: string;
}

export const whatIDoItems: WhatIDoItem[] = [
  { title: 'Full-Stack Development', desc: 'React, TypeScript, Node.js' },
  { title: 'Desktop Applications', desc: 'Qt Framework, C++' },
  { title: 'Performance Engineering', desc: 'WebAssembly, Optimization' },
  { title: 'Open Source', desc: 'Contributing & Maintaining' },
];

export const categoryIcons: Record<string, LucideIcon> = {
  Frontend: Code2,
  Backend: Briefcase,
  'Desktop & Systems': Wrench,
  'Tools & DevOps': GraduationCap,
};

export const bio = {
  name: 'Nauris Linde',
  role: 'R&D Engineer',
  location: 'Liepaja, Latvia',
  currentInterest: 'Currently into WebAssembly',
  tagline:
    'R&D Engineer by day, side-project tinkerer by night. I like building things with C++, React, and WebAssembly — and writing about whatever catches my attention.',
  story: [
    `Hello World! I'm <strong>Nauris Linde</strong>, a <strong>software engineer</strong> from Liepaja, Latvia, with over a decade of programming experience. My journey began as a Backend Web Developer, where I specialized in Laravel framework while working at a digital agency, delivering multiple successful web projects.`,
    `Currently, I serve as a <strong>R&D Engineer</strong> overseeing the technical aspects of our Floorplan team. My work focuses on developing desktop applications using the Qt Framework for floor plan editing. I'm also deeply involved in writing C++ algorithms and implementing them in web applications through WebAssembly (WASM), bridging the gap between high-performance desktop software and modern web technologies.`,
  ],
};
