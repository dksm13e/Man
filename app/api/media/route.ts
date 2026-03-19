import { NextResponse } from 'next/server';
import { listMediaFiles } from '../../../lib/media';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type !== 'club-atmosphere' && type !== 'schedule') {
    return NextResponse.json({ files: [] }, { status: 400 });
  }

  const files = await listMediaFiles(type);

  return NextResponse.json({ files });
}
