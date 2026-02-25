import React from 'react';
import { HeroSection as HeroSectionType } from '../backend';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  data?: HeroSectionType;
  backgroundImageUrl?: string;
}

export default function HeroSection({ data, backgroundImageUrl }: HeroSectionProps) {
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section-bg"
    >
      {/* Background */}
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 hero-default-bg" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Radial glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.5) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="hero-card rounded-2xl p-10 md:p-16 animate-fade-in">
          {data?.tagline && (
            <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-400 mb-4">
              {data.tagline}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold hero-heading mb-6 leading-tight">
            {data?.headline || (
              <>
                Excellence in{' '}
                <span className="bg-gradient-to-r from-cobalt-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Medical Care
                </span>
              </>
            )}
          </h1>
          {data?.subheadline && (
            <p className="font-sans text-lg md:text-xl hero-subheading max-w-2xl mx-auto leading-relaxed">
              {data.subheadline}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToAbout}
              className="px-8 py-3 rounded-xl font-sans font-medium text-white transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              Learn More
            </button>
            <button
              onClick={() => document.querySelector('#clinics')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-xl font-sans font-medium hero-btn-outline transition-all duration-300 hover:-translate-y-1"
            >
              Find a Clinic
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-scroll-indicator hover:text-fuchsia-400 transition-colors duration-200 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
