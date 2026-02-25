import React from 'react';
import { Clinic } from '../backend';
import { MapPin, Phone, ExternalLink } from 'lucide-react';

interface ClinicsSectionProps {
  clinics: Clinic[];
  photoUrls: Record<string, string>;
}

export default function ClinicsSection({ clinics, photoUrls }: ClinicsSectionProps) {
  return (
    <section
      id="clinics"
      className="relative py-24 overflow-hidden section-clinics-bg"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-500 dark:text-fuchsia-400 mb-3">
            Find Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold section-heading">
            Our Clinics
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-cobalt-500 via-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        {clinics.length === 0 ? (
          <div className="text-center py-16 rounded-2xl section-glass-card">
            <p className="font-sans section-muted-text">No clinic locations listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((clinic, index) => (
              <div
                key={index}
                className="group rounded-2xl overflow-hidden card-hover-lift section-glass-card"
              >
                {/* Clinic photo */}
                {clinic.photoImageId && photoUrls[clinic.photoImageId] ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={photoUrls[clinic.photoImageId]}
                      alt={clinic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(217,70,239,0.2))' }}
                  >
                    <MapPin className="text-violet-400/50" size={40} />
                  </div>
                )}

                {/* Clinic info */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold section-heading mb-4 group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300 transition-colors duration-200">
                    {clinic.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-sm section-body-text">{clinic.address}</span>
                    </div>
                    {clinic.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-violet-500 dark:text-violet-400 flex-shrink-0" />
                        <a
                          href={`tel:${clinic.phone}`}
                          className="font-sans text-sm section-body-text hover:text-fuchsia-500 dark:hover:text-fuchsia-300 transition-colors duration-200"
                        >
                          {clinic.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {clinic.mapLink && (
                    <a
                      href={clinic.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium font-sans text-fuchsia-500 dark:text-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors duration-200 group/link"
                    >
                      View on Map
                      <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform duration-200" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
