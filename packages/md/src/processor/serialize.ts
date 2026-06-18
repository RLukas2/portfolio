import { createProcessor } from './pipeline';

export async function markdownToHastJson(source: string): Promise<string> {
  const processor = createProcessor();
  const file = await processor.process(source);
  return JSON.stringify(file.result, (key, value) => (key === 'position' ? undefined : value));
}
