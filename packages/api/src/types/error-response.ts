/**
 * Standard API Error Response Format
 * Used across all API endpoints for consistent error handling
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Standard API Success Response Format
 * Used for consistent success responses
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}
