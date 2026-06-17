import { NotFoundError } from '@xbrk/errors';

export function assertPublishedOrAdmin<T extends { isDraft: boolean }>(
  entity: T | null | undefined,
  entityName: string,
  session?: { user: { role: string } } | null,
): asserts entity is T {
  if (!entity) {
    throw new NotFoundError(`${entityName} not found`);
  }

  if (entity.isDraft && session?.user.role !== 'admin') {
    throw new NotFoundError(`${entityName} is not public`);
  }
}
