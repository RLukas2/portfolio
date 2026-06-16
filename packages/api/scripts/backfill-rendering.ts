import { db } from '@xbrk/db/client';
import { articles, project, service, snippet } from '@xbrk/db/schema';
import { markdownToHastJson, RENDERING_VERSION } from '@xbrk/md/processor';
import { eq, isNull, lt, or } from 'drizzle-orm';

interface TableConfig {
  idColumn: typeof articles.id;
  name: string;
  sourceColumn: 'content' | 'code';
  table: typeof articles | typeof project | typeof service | typeof snippet;
}

const tables: TableConfig[] = [
  { name: 'articles', table: articles, sourceColumn: 'content', idColumn: articles.id },
  { name: 'projects', table: project, sourceColumn: 'content', idColumn: project.id },
  { name: 'services', table: service, sourceColumn: 'content', idColumn: service.id },
  { name: 'snippets', table: snippet, sourceColumn: 'code', idColumn: snippet.id },
];

async function processTable(config: TableConfig) {
  const rows = await db
    .select()
    .from(config.table)
    .where(or(isNull(config.table.contentRendering), lt(config.table.contentRenderingVersion, RENDERING_VERSION)));

  if (rows.length === 0) {
    console.log(`  No ${config.name} to process`);
    return;
  }

  console.log(`  Found ${rows.length} ${config.name} to process`);

  for (const row of rows) {
    const source = row[config.sourceColumn] as string | null;
    if (!source) {
      console.log(`    Skipping ${config.name} ${row.id} (no ${config.sourceColumn})`);
      continue;
    }

    try {
      console.log(`    Processing ${config.name} ${row.id}...`);
      const contentRendering = await markdownToHastJson(source);
      await db
        .update(config.table)
        .set({
          contentRendering,
          contentRenderingVersion: RENDERING_VERSION,
        })
        .where(eq(config.idColumn, row.id));
      console.log('    ✓ Done');
    } catch (error) {
      console.error('    ✗ Failed:', error);
    }
  }
}

async function main() {
  for (const table of tables) {
    console.log(`\nProcessing ${table.name}...`);
    await processTable(table);
  }

  console.log('\nBackfill completed');
  process.exit(0);
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
