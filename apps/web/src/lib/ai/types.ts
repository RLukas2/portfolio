export interface ToolProject {
  demoUrl?: string | null;
  description?: string | null;
  githubUrl?: string | null;
  id: string;
  isFeatured: boolean;
  slug: string;
  stacks?: string[] | null;
  title: string;
}

export interface ToolArticle {
  createdAt: Date;
  description?: string | null;
  id: string;
  likes: number;
  slug: string;
  tags?: string[] | null;
  title: string;
  views: number;
}

export interface ToolExperience {
  description?: string | null;
  endDate?: string | null;
  id: string;
  institution?: string | null;
  isOnGoing: boolean;
  startDate?: string | null;
  title: string;
  type: string | null;
}
