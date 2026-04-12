/** biome-ignore-all lint/performance/noBarrelFile: This is a barrel file */

export type { AuditEntry } from './lib/audit';
export { createAuditor, writeAuditLog } from './lib/audit';
export type { PaginatedResult, PaginationInput } from './lib/base-service';
export { handleImageUpdate, handleImageUpload } from './lib/base-service';
export { createSlug, escapeSearchTerm, isValidBase64, validateSearchQuery } from './lib/validation';
export {
  blogService,
  commentService,
  experienceService,
  guestbookService,
  projectService,
  searchService,
  serviceService,
  snippetService,
  statsService,
  userService,
} from './services';
export { deleteFile, uploadImage } from './storage';

// Error handling
export type { ApiErrorResponse, ApiSuccessResponse } from './types/error-response';
export { createSuccessResponse, handleApiError } from './utils/error-handler';
