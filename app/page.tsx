import HomeClient from './home-client';
import { listMediaFiles } from '../lib/media';

export default async function Page() {
  const [clubImages, scheduleImages] = await Promise.all([listMediaFiles('club-atmosphere'), listMediaFiles('schedule')]);

  return <HomeClient initialClubImages={clubImages} initialScheduleImages={scheduleImages} />;
}
