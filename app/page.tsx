import HomeClient from './home-client';
import { PERMANENT_CLUB_IMAGES, listMediaFiles } from '../lib/media';

export default async function Page() {
  const scheduleImages = await listMediaFiles('schedule');

  return <HomeClient initialClubImages={[...PERMANENT_CLUB_IMAGES]} initialScheduleImages={scheduleImages} />;
}
