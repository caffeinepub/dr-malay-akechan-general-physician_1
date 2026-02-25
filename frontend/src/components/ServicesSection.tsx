import React from 'react';
import { Service } from '../backend';
import { Stethoscope } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  iconUrls: Record<string, string>;
}

export default function ServicesSection({ services, iconUrls }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="relative py-24 overflow-hidden section-services-bg"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-500 dark:text-fuchsia-400 mb-3">
            What We Offer
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold section-heading">
            Our Services
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-cobalt-500 via-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 rounded-2xl section-glass-card">
            <p className="font-sans section-muted-text">No services listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group rounded-2xl p-6 card-hover-lift cursor-default section-glass-card"
              >
                {/* Icon */}
                <div className="mb-5">
                  {service.iconImageId && iconUrls[service.iconImageId] ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden section-card-border">
                      <img
                        src={iconUrls[service.iconImageId]}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(217,70,239,0.3))',
                        border: '1px solid rgba(120, 80, 255, 0.3)',
                      }}
                    >
                      <Stethoscope className="text-violet-400 dark:text-violet-300" size={24} />
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-xl font-semibold section-heading mb-3 group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="font-sans text-sm section-body-text leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-300"
                  style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.8), rgba(217,70,239,0.8))' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
