import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ProjectGrid } from '@/app/components/portfolio/ProjectGrid';
import { SPACING, COLORS } from '@/app/data/constants';

export default function HomePage() {
  const headerInfo = {
    name: 'Inga',
    //title: 'Software Designer, Creative Technologist',
    location: 'TEXAS',
  };

  const footerInfo = {
    name: 'Inga',
    copyright: 'Copyright 2026',
    tagline: '🇵🇪 HECHO EN PERU',
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 md:px-8 lg:px-[30px]"
      style={{
        backgroundColor: COLORS.background,
        paddingTop: `${SPACING.containerPadding}px`,
        paddingBottom: `${SPACING.containerPadding}px`,
        gap: `${SPACING.tileGap}px`,
      }}
    >
      <Header {...headerInfo} />
      <ProjectGrid />
      <Footer {...footerInfo} />
    </div>
  );
}
