import React from 'react';
import { PatientReview } from '../backend';
import { Star, Quote } from 'lucide-react';

interface PatientReviewsSectionProps {
  reviews: PatientReview[];
}

export default function PatientReviewsSection({ reviews }: PatientReviewsSectionProps) {
  return (
    <section
      id="reviews"
      className="relative py-24 overflow-hidden section-reviews-bg"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.6) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-500 dark:text-fuchsia-400 mb-3">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold section-heading">
            Patient Reviews
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-cobalt-500 via-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 rounded-2xl section-glass-card">
            <p className="font-sans section-muted-text">No reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="group rounded-2xl p-6 card-hover-lift section-glass-card"
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="text-fuchsia-400/40 dark:text-fuchsia-500/40" size={28} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Number(review.rating) ? 'text-fuchsia-400 fill-fuchsia-400' : 'section-star-empty'}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="font-sans text-sm section-body-text leading-relaxed mb-5 italic">
                  "{review.reviewText}"
                </p>

                {/* Patient info */}
                <div className="flex items-center gap-3 pt-4 section-divider-border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(217,70,239,0.6))' }}
                  >
                    {review.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium section-heading">{review.patientName}</p>
                    <p className="font-sans text-xs section-muted-text">
                      {new Date(Number(review.date)).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
