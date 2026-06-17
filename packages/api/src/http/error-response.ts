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

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}
