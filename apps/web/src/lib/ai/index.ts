import { getArticles, recommendArticle, searchArticles } from './tools/articles';
import { getExperience, recommendExperience, searchExperience } from './tools/experience';
import { getProjects, recommendProject, searchProjects } from './tools/projects';

export * from './types';

export default function getTools() {
  return [
    getProjects,
    searchProjects,
    recommendProject,
    getArticles,
    searchArticles,
    recommendArticle,
    getExperience,
    searchExperience,
    recommendExperience,
  ];
}
