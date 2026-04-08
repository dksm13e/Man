import HomeClient from './home-client';
import { PERMANENT_CLUB_IMAGES, PERMANENT_SCHEDULE_IMAGES } from '../lib/media';

export default async function Page() {
  return <HomeClient initialClubImages={[...PERMANENT_CLUB_IMAGES]} initialScheduleImages={[...PERMANENT_SCHEDULE_IMAGES]} />;
}
