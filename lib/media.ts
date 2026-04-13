import { promises as fs } from 'fs';
import path from 'path';

export const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

export const PERMANENT_CLUB_IMAGES = [
  'https://i.ibb.co/1JhVc8BH/5-6.jpg',
  'https://i.ibb.co/FbYBckrM/4120.jpg',
  'https://i.ibb.co/zhgG96z0/5-7.jpg',
  'https://i.ibb.co/Xfc5BZwW/5-8.jpg',
  'https://i.ibb.co/chCm7J9N/5-9.jpg',
  'https://i.ibb.co/ZR1fYtM7/5-10.jpg',
  'https://i.ibb.co/393ZHwhS/5-11.jpg',
  'https://i.ibb.co/bgZSF6Tr/5-14.jpg',
  'https://i.ibb.co/6c4bV9VF/5-15.jpg',
  'https://i.ibb.co/jPHrMwCJ/2679.jpg',
  'https://i.ibb.co/Jw2ss2NX/2703.jpg',
  'https://i.ibb.co/Df7h7Z8w/2712.jpg',
  'https://i.ibb.co/6J0CHTdy/2715.jpg',
  'https://i.ibb.co/dsrGjJd3/2779.jpg',
  'https://i.ibb.co/v4pSvbW6/2806.jpg',
  'https://i.ibb.co/3mDyZPGc/2808.jpg',
  'https://i.ibb.co/fzxSrQdJ/2819.jpg',
  'https://i.ibb.co/YBc04Jcg/2841.jpg',
  'https://i.ibb.co/4wFtC3Zm/2857.jpg',
  'https://i.ibb.co/MyC52Zp4/2862.jpg',
  'https://i.ibb.co/xKFRsvXb/2865.jpg',
  'https://i.ibb.co/20Lygg09/2879.jpg',
  'https://i.ibb.co/39wLSkq7/2892.jpg',
  'https://i.ibb.co/7xt7P6TX/2926.jpg',
  'https://i.ibb.co/bgXyqK9m/2952.jpg',
  'https://i.ibb.co/PvpJxCRF/2983.jpg',
  'https://i.ibb.co/xKLKCchx/2990.jpg',
  'https://i.ibb.co/gMZRvdf9/3000.jpg',
  'https://i.ibb.co/S4h1kjSJ/3027.jpg',
  'https://i.ibb.co/6c0f1Ysp/3114.jpg',
  'https://i.ibb.co/Rk6mxmMK/3523.jpg',
  'https://i.ibb.co/27byTBmb/3530.jpg',
  'https://i.ibb.co/CshH4znb/3544.jpg',
  'https://i.ibb.co/5hpn0NxF/3559.jpg',
  'https://i.ibb.co/7tRCRVxz/3583.jpg',
  'https://i.ibb.co/S4wNmPTB/3641.jpg',
  'https://i.ibb.co/tP1yGhmz/3784.jpg',
  'https://i.ibb.co/qFpfKSJy/3849.jpg',
  'https://i.ibb.co/5q3RKm8/3881.jpg',
  'https://i.ibb.co/JRQ3HDwt/3917.jpg',
  'https://i.ibb.co/xSYNwnCf/3973.jpg',
  'https://i.ibb.co/8gp8DpgZ/4023.jpg',
  'https://i.ibb.co/gZKFchB9/4103.jpg',
  'https://i.ibb.co/RpScsJh5/4123.jpg'
] as const;
export const PERMANENT_SCHEDULE_IMAGES = ['https://i.ibb.co/Vp9Tyr7W/3.jpg'] as const;

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
