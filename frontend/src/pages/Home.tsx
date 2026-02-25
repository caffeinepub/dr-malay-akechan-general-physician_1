import React, { useEffect, useState } from 'react';
import { useGetContent, useListImages } from '../hooks/useQueries';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PatientReviewsSection from '../components/PatientReviewsSection';
import ClinicsSection from '../components/ClinicsSection';
import FollowUsSection from '../components/FollowUsSection';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { data: content, isLoading } = useGetContent();
  const { data: images = [] } = useListImages();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    document.title = 'Dr. Malay Akechan - General Physician';
  }, []);

  const getImageUrl = (id: string | undefined | null): string | undefined => {
    if (!id) return undefined;
    const img = images.find((i) => i.id === id);
    if (!img) return undefined;
    const blob = new Blob([new Uint8Array(img.data)], { type: img.mimeType });
    return URL.createObjectURL(blob);
  };

  // Build iconUrls record for ServicesSection
  const iconUrls: Record<string, string> = {};
  content?.services?.forEach((s) => {
    if (s.iconImageId) {
      const url = getImageUrl(s.iconImageId);
      if (url) iconUrls[s.iconImageId] = url;
    }
  });

  // Build photoUrls record for ClinicsSection
  const photoUrls: Record<string, string> = {};
  content?.clinics?.forEach((c) => {
    if (c.photoImageId) {
      const url = getImageUrl(c.photoImageId);
      if (url) photoUrls[c.photoImageId] = url;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-section-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main>
        <HeroSection
          data={content?.heroSection}
          backgroundImageUrl={getImageUrl(content?.heroSection?.backgroundImageId)}
        />

        <AboutSection
          data={content?.aboutSection}
          photoUrl={getImageUrl(content?.aboutSection?.photoImageId)}
        />

        <ServicesSection
          services={content?.services ?? []}
          iconUrls={iconUrls}
        />

        <PatientReviewsSection reviews={content?.patientReviews ?? []} />

        <ClinicsSection
          clinics={content?.clinics ?? []}
          photoUrls={photoUrls}
        />

        <FollowUsSection socialLinks={content?.socialLinks ?? []} />
      </main>

      <Footer
        footer={content?.footer}
        socialLinks={content?.socialLinks ?? []}
      />
    </div>
  );
}
