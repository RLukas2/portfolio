/**
 * Query keys for React Query cache management.
 *
 * Provides a hierarchical structure for organizing query keys across different resources.
 * Each resource has methods for generating consistent, type-safe query keys.
 *
 * @example
 * ```ts
 * // Get all blog posts
 * queryKeys.blog.listPublic()
 *
 * // Get specific blog post
 * queryKeys.blog.detail('my-post-slug')
 * ```
 */
export const queryKeys = {
  blog: {
    all: ['blog'] as const,
    lists: () => [...queryKeys.blog.all, 'list'] as const,
    listPublic: () => [...queryKeys.blog.lists(), 'public'] as const,
    listAll: () => [...queryKeys.blog.lists(), 'all'] as const,
    details: () => [...queryKeys.blog.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
    byId: (id: string) => [...queryKeys.blog.all, 'byId', id] as const,
    isLiked: (slug: string) => [...queryKeys.blog.all, 'isLiked', slug] as const,
  },
  comment: {
    all: ['comment'] as const,
    byArticle: (articleId: string) => [...queryKeys.comment.all, 'byArticle', articleId] as const,
    byArticleAndParent: (articleId: string, parentId?: string) =>
      [...queryKeys.comment.all, 'byArticle', articleId, 'parent', parentId ?? 'root'] as const,
  },
  project: {
    all: ['project'] as const,
    lists: () => [...queryKeys.project.all, 'list'] as const,
    listPublic: () => [...queryKeys.project.lists(), 'public'] as const,
    listAll: () => [...queryKeys.project.lists(), 'all'] as const,
    details: () => [...queryKeys.project.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.project.details(), slug] as const,
    byId: (id: string) => [...queryKeys.project.all, 'byId', id] as const,
  },
  snippet: {
    all: ['snippet'] as const,
    lists: () => [...queryKeys.snippet.all, 'list'] as const,
    listPublic: () => [...queryKeys.snippet.lists(), 'public'] as const,
    listAll: () => [...queryKeys.snippet.lists(), 'all'] as const,
    details: () => [...queryKeys.snippet.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.snippet.details(), slug] as const,
    byId: (id: string) => [...queryKeys.snippet.all, 'byId', id] as const,
  },
  service: {
    all: ['service'] as const,
    lists: () => [...queryKeys.service.all, 'list'] as const,
    listPublic: () => [...queryKeys.service.lists(), 'public'] as const,
    listAll: () => [...queryKeys.service.lists(), 'all'] as const,
    details: () => [...queryKeys.service.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.service.details(), slug] as const,
    byId: (id: string) => [...queryKeys.service.all, 'byId', id] as const,
  },
  experience: {
    all: ['experience'] as const,
    lists: () => [...queryKeys.experience.all, 'list'] as const,
    listPublic: () => [...queryKeys.experience.lists(), 'public'] as const,
    listAll: () => [...queryKeys.experience.lists(), 'all'] as const,
    byId: (id: string) => [...queryKeys.experience.all, 'byId', id] as const,
  },
  guestbook: {
    all: ['guestbook'] as const,
    list: () => [...queryKeys.guestbook.all, 'list'] as const,
  },
  search: {
    all: ['search'] as const,
    query: (q: string) => [...queryKeys.search.all, q] as const,
  },
  github: {
    all: ['github'] as const,
    stats: () => [...queryKeys.github.all, 'stats'] as const,
    activity: () => [...queryKeys.github.all, 'activity'] as const,
  },
  endorsement: {
    all: ['endorsement'] as const,
    lists: () => [...queryKeys.endorsement.all, 'list'] as const,
    listApproved: () => [...queryKeys.endorsement.lists(), 'approved'] as const,
    listAll: () => [...queryKeys.endorsement.lists(), 'all'] as const,
    byId: (id: string) => [...queryKeys.endorsement.all, 'byId', id] as const,
  },
  short: {
    all: ['short'] as const,
    lists: () => [...queryKeys.short.all, 'list'] as const,
    listPublic: () => [...queryKeys.short.lists(), 'public'] as const,
    listAll: () => [...queryKeys.short.lists(), 'all'] as const,
    details: () => [...queryKeys.short.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.short.details(), slug] as const,
    byId: (id: string) => [...queryKeys.short.all, 'byId', id] as const,
  },
  view: {
    all: ['view'] as const,
    byArticle: (articleId: string) => [...queryKeys.view.all, 'byArticle', articleId] as const,
  },
  reaction: {
    all: ['reaction'] as const,
    byArticle: (articleId: string) => [...queryKeys.reaction.all, 'byArticle', articleId] as const,
    userReaction: (articleId: string, userId: string) =>
      [...queryKeys.reaction.all, 'userReaction', articleId, userId] as const,
  },
  share: {
    all: ['share'] as const,
    byArticle: (articleId: string) => [...queryKeys.share.all, 'byArticle', articleId] as const,
  },
  spotify: {
    all: ['spotify'] as const,
    nowPlaying: () => [...queryKeys.spotify.all, 'nowPlaying'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    analytics: () => [...queryKeys.dashboard.all, 'analytics'] as const,
  },
  bookmark: {
    all: ['bookmark'] as const,
    lists: () => [...queryKeys.bookmark.all, 'list'] as const,
    listPublic: () => [...queryKeys.bookmark.lists(), 'public'] as const,
  },
} as const;
