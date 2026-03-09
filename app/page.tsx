import { ContactsSection } from '@/components/ContactsSection';
import { CtaSection } from '@/components/CtaSection';
import { FaqSection } from '@/components/FaqSection';
import { GallerySection } from '@/components/GallerySection';
import { Hero } from '@/components/Hero';
import { ScheduleSection } from '@/components/ScheduleSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <GallerySection />
      <ScheduleSection />
      <ContactsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
