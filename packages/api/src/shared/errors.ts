export function reportError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}
