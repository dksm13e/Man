import { promises as fs } from 'fs';
import path from 'path';

export const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

export const PERMANENT_CLUB_IMAGES = [
  'https://i.ibb.co/1JhVc8BH/5-6.jpg',
  'https://i.ibb.co/zhgG96z0/5-7.jpg',
  'https://i.ibb.co/Xfc5BZwW/5-8.jpg',
  'https://i.ibb.co/chCm7J9N/5-9.jpg',
  'https://i.ibb.co/ZR1fYtM7/5-10.jpg',
  'https://i.ibb.co/393ZHwhS/5-11.jpg',
  'https://i.ibb.co/PzPhdvDH/5-12.jpg',
  'https://i.ibb.co/wrWH7kCY/5-13.jpg',
  'https://i.ibb.co/bgZSF6Tr/5-14.jpg',
  'https://i.ibb.co/6c4bV9VF/5-15.jpg'
] as const;

const mediaPaths: Record<string, string[]> = {
  'club-atmosphere': ['images/club-atmosphere'],
  schedule: ['images/schedule']
};

const placeholderPatterns: Record<'club-atmosphere' | 'schedule', RegExp[]> = {
  'club-atmosphere': [/^club-\d+\.svg$/i],
  schedule: [/^schedule-main\.svg$/i]
};

const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });
const toPublicPath = (baseDir: string, fileName: string) => `/${baseDir}/${encodeURIComponent(fileName)}`;

function isPlaceholderFile(type: 'club-atmosphere' | 'schedule', fileName: string) {
  return placeholderPatterns[type].some((pattern) => pattern.test(fileName));
}

async function collectImages(type: 'club-atmosphere' | 'schedule', baseDir: string) {
  const absoluteDir = path.join(process.cwd(), 'public', baseDir);

  try {
    const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
    const fileNames = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()));

    if (!fileNames.length) return [];

    const hasRasterImages = fileNames.some((fileName) => path.extname(fileName).toLowerCase() !== '.svg');
    const filtered = hasRasterImages ? fileNames.filter((fileName) => !isPlaceholderFile(type, fileName)) : fileNames;

    return filtered.map((fileName) => toPublicPath(baseDir, fileName));
  } catch {
    return [];
  }
}

export async function listMediaFiles(type: 'club-atmosphere' | 'schedule') {
  const bases = mediaPaths[type];
  const files: string[] = [];

  for (const baseDir of bases) {
    const dirFiles = await collectImages(type, baseDir);
    if (dirFiles.length) {
      files.push(...dirFiles);
      break;
    }
  }

  return Array.from(new Set(files)).sort((a, b) => collator.compare(a, b));
}
