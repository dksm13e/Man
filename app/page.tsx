import { AboutSection } from '@/components/AboutSection';
import { ContactsSection } from '@/components/ContactsSection';
import { CtaSection } from '@/components/CtaSection';
import { FaqSection } from '@/components/FaqSection';
import { GallerySection } from '@/components/GallerySection';
import { HeroSection } from '@/components/HeroSection';
import { PricingSection } from '@/components/PricingSection';
import { ProgramsSection } from '@/components/ProgramsSection';
import { ScheduleSection } from '@/components/ScheduleSection';
import { galleryImages, programs } from '@/lib/content';
import { getScheduleData } from '@/lib/schedule';

export default async function HomePage() {
  const scheduleData = await getScheduleData();

  return (
    <main className="bg-carbon text-softLight">
      <HeroSection />
      <GallerySection images={galleryImages} />
      <AboutSection />
      <ProgramsSection categories={programs} />
      <ScheduleSection items={scheduleData} />
      <PricingSection />
      <CtaSection />
      <ContactsSection />
      <FaqSection />
    </main>
  );
}
