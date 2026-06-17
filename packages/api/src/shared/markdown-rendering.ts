import { markdownToHastJson, RENDERING_VERSION } from '@xbrk/md/processor';

export async function buildContentRendering(source: string | null | undefined): Promise<{
  contentRendering: string | null;
  contentRenderingVersion: number;
}> {
  return {
    contentRendering: source ? await markdownToHastJson(source) : null,
    contentRenderingVersion: RENDERING_VERSION,
  };
}
