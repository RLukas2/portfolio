import { HttpError } from './http-error';

export function isHttpError(error: unknown): error is HttpError {
  return (
    error instanceof HttpError ||
    (error !== null && typeof error === 'object' && 'code' in error && 'statusCode' in error && 'message' in error)
  );
}
