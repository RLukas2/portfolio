import { db } from '@xbrk/db/client';
import { articles } from '@xbrk/db/schema';

async function main() {
  const allArticles = await db.select().from(articles);
  console.log(allArticles);
}
main().catch(console.error);
