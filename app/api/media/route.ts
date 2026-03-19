import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

const mediaPaths: Record<string, string[]> = {
  'club-atmosphere': ['images/club-atmosphere', 'imgs/club-atmosphere'],
  schedule: ['images/schedule', 'imgs/schedule']
};

const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

const toPublicPath = (baseDir: string, fileName: string) => `/${baseDir}/${encodeURIComponent(fileName)}`;
const isPlaceholderSvg = (fileName: string) => /^club-\d+\.svg$/i.test(fileName);

async function collectImages(baseDir: string) {
  const absoluteDir = path.join(process.cwd(), 'public', baseDir);

  try {
    const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
    const fileNames = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()));

    if (!fileNames.length) return [];

    const hasRasterImages = fileNames.some((fileName) => path.extname(fileName).toLowerCase() !== '.svg');
    const filtered = hasRasterImages ? fileNames.filter((fileName) => !isPlaceholderSvg(fileName)) : fileNames;

    return filtered.map((fileName) => toPublicPath(baseDir, fileName));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') ?? 'club-atmosphere';
  const bases = mediaPaths[type];

  if (!bases) {
    return NextResponse.json({ files: [] }, { status: 400 });
  }

  const files: string[] = [];

  for (const baseDir of bases) {
    const dirFiles = await collectImages(baseDir);
    if (dirFiles.length) {
      files.push(...dirFiles);
      break;
    }
  }

  const uniqueSorted = Array.from(new Set(files)).sort((a, b) => collator.compare(a, b));

  return NextResponse.json({ files: uniqueSorted });
}
