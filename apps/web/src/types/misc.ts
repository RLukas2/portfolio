import type { SimpleIcon } from 'simple-icons';

export type { CommentWithRelations } from './comment';

export interface TOC {
  depth: number;
  title: string;
  url: string;
}

export interface Collection {
  _id: string;
  count: number;
  description: string;
  slug: string;
  title: string;
}

export interface Bookmark {
  _id: string;
  cover: string;
  domain: string;
  excerpt: string;
  link: string;
  note: string;
  tags: string[];
  title: string;
}

export interface UseData {
  description: string;
  icon: SimpleIcon;
  link: string;
  name: string;
}
