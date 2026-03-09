import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

const mediaPaths: Record<string, string[]> = {
  'club-atmosphere': ['imgs/club-atmosphere', 'images/club-atmosphere'],
  schedule: ['imgs/schedule', 'images/schedule']
};

const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

const toPublicPath = (baseDir: string, fileName: string) => `/${baseDir}/${encodeURIComponent(fileName)}`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') ?? 'club-atmosphere';
  const bases = mediaPaths[type];

  if (!bases) {
    return NextResponse.json({ files: [] }, { status: 400 });
  }

  const files: string[] = [];

  for (const baseDir of bases) {
    const absoluteDir = path.join(process.cwd(), 'public', baseDir);

    try {
      const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;
        files.push(toPublicPath(baseDir, entry.name));
      }
    } catch {
      // ignore missing directory and continue with other sources
    }
  }

  const uniqueSorted = Array.from(new Set(files)).sort((a, b) => collator.compare(a, b));

  return NextResponse.json({ files: uniqueSorted });
}
