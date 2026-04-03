import { type SimpleIcon } from 'simple-icons';

export interface Skill {
  icon: SimpleIcon;
  name: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [];

// Flat array for backwards compatibility
export const skillsData = skillCategories.flatMap((category) => category.skills.map((skill) => skill.name));
