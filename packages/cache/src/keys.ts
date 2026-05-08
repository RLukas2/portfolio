/**
 * Centralized cache key management
 * Provides type-safe cache keys for all entities
 */

/**
 * Cache key builders for articles
 */
export const articleKeys = {
  /** All articles (admin view) */
  all: () => 'articles:all' as const,

  /** Public articles list */
  public: () => 'articles:public' as const,

  /** Single article by slug */
  bySlug: (slug: string) => `articles:slug:${slug}` as const,

  /** Single article by ID */
  byId: (id: string) => `articles:id:${id}` as const,

  /** Article likes count */
  likes: (articleId: string) => `articles:${articleId}:likes` as const,

  /** Article views count */
  views: (articleId: string) => `articles:${articleId}:views` as const,

  /** Check if user liked article */
  isLiked: (articleId: string, visitorId: string) => `articles:${articleId}:liked:${visitorId}` as const,

  /** Invalidate all article-related cache */
  pattern: () => 'articles:*' as const,
};

/**
 * Cache key builders for projects
 */
export const projectKeys = {
  all: () => 'projects:all' as const,
  public: () => 'projects:public' as const,
  bySlug: (slug: string) => `projects:slug:${slug}` as const,
  byId: (id: string) => `projects:id:${id}` as const,
  pattern: () => 'projects:*' as const,
};

/**
 * Cache key builders for services
 */
export const serviceKeys = {
  all: () => 'services:all' as const,
  public: () => 'services:public' as const,
  bySlug: (slug: string) => `services:slug:${slug}` as const,
  byId: (id: string) => `services:id:${id}` as const,
  pattern: () => 'services:*' as const,
};

/**
 * Cache key builders for snippets
 */
export const snippetKeys = {
  all: () => 'snippets:all' as const,
  public: () => 'snippets:public' as const,
  bySlug: (slug: string) => `snippets:slug:${slug}` as const,
  byId: (id: string) => `snippets:id:${id}` as const,
  byCategory: (category: string) => `snippets:category:${category}` as const,
  pattern: () => 'snippets:*' as const,
};

/**
 * Cache key builders for experiences
 */
export const experienceKeys = {
  all: () => 'experiences:all' as const,
  public: () => 'experiences:public' as const,
  byId: (id: string) => `experiences:id:${id}` as const,
  byType: (type: string) => `experiences:type:${type}` as const,
  pattern: () => 'experiences:*' as const,
};

/**
 * Cache key builders for comments
 */
export const commentKeys = {
  byArticle: (articleId: string) => `comments:article:${articleId}` as const,
  byParent: (parentId: string) => `comments:parent:${parentId}` as const,
  pattern: (articleId?: string) => (articleId ? `comments:article:${articleId}:*` : 'comments:*'),
};

/**
 * Cache key builders for guestbook
 */
export const guestbookKeys = {
  all: () => 'guestbook:all' as const,
  pattern: () => 'guestbook:*' as const,
};

/**
 * Cache key builders for stats
 */
export const statsKeys = {
  monthlyUsers: (months: number) => `stats:users:monthly:${months}` as const,
  monthlyViews: (months: number) => `stats:views:monthly:${months}` as const,
  pattern: () => 'stats:*' as const,
};

/**
 * Cache key builders for search
 */
export const searchKeys = {
  query: (query: string) => `search:query:${query}` as const,
  pattern: () => 'search:*' as const,
};

/**
 * Cache key builders for sessions (auth)
 */
export const sessionKeys = {
  byId: (sessionId: string) => `session:${sessionId}` as const,
  byUserId: (userId: string) => `session:user:${userId}` as const,
  pattern: (userId?: string) => (userId ? `session:user:${userId}:*` : 'session:*'),
};

/**
 * Cache key builders for rate limiting
 */
export const rateLimitKeys = {
  byIp: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}` as const,
  pattern: (ip?: string) => (ip ? `ratelimit:${ip}:*` : 'ratelimit:*'),
};

/**
 * Helper to invalidate multiple related caches
 */
export const invalidationGroups = {
  /** Invalidate all article-related caches */
  articles: () => [articleKeys.pattern(), statsKeys.pattern(), searchKeys.pattern()],

  /** Invalidate all project-related caches */
  projects: () => [projectKeys.pattern(), searchKeys.pattern()],

  /** Invalidate all service-related caches */
  services: () => [serviceKeys.pattern(), searchKeys.pattern()],

  /** Invalidate all snippet-related caches */
  snippets: () => [snippetKeys.pattern(), searchKeys.pattern()],

  /** Invalidate all experience-related caches */
  experiences: () => [experienceKeys.pattern()],

  /** Invalidate all comment-related caches for an article */
  comments: (articleId: string) => [commentKeys.pattern(articleId)],

  /** Invalidate all stats */
  stats: () => [statsKeys.pattern()],

  /** Invalidate all search results */
  search: () => [searchKeys.pattern()],
};
