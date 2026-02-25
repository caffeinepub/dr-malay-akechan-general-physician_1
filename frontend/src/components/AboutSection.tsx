import React from 'react';
import { AboutSection as AboutSectionType } from '../backend';

interface AboutSectionProps {
  data?: AboutSectionType;
  photoUrl?: string;
}

export default function AboutSection({ data, photoUrl }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden section-about-bg"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.6) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-500 dark:text-fuchsia-400 mb-3">
            Our Story
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold section-heading">
            About Our Practice
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-cobalt-500 via-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          {photoUrl && (
            <div className="relative group">
              <div
                className="rounded-2xl overflow-hidden card-hover-lift section-card-border"
              >
                <img
                  src={photoUrl}
                  alt="About our practice"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(217,70,239,0.1))' }}
                />
              </div>
              {/* Decorative corner accent */}
              <div
                className="absolute -bottom-3 -right-3 w-24 h-24 rounded-xl opacity-30"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(217,70,239,0.5))' }}
              />
            </div>
          )}

          {/* Bio text */}
          <div
            className={`section-glass-card rounded-2xl p-8 md:p-10 ${!photoUrl ? 'lg:col-span-2 max-w-3xl mx-auto' : ''}`}
          >
            <p className="font-sans section-body-text text-lg leading-relaxed">
              {data?.bioText || 'Welcome to our medical practice. We are dedicated to providing exceptional healthcare with compassion and expertise.'}
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '15+', label: 'Years Experience' },
                { value: '5K+', label: 'Patients Served' },
                { value: '3', label: 'Clinic Locations' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl font-bold bg-gradient-to-r from-cobalt-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="font-sans text-xs section-muted-text mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
