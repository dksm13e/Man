import SitePage from '@/components/site-page';
import { loadSchedule } from '@/lib/schedule';

export default function HomePage() {
  const { rows, source } = loadSchedule();

  return <SitePage scheduleRows={rows} scheduleSource={source} />;
}
