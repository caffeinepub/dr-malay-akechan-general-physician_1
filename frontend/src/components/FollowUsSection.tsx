import React from 'react';
import { SocialLink } from '../backend';
import { ExternalLink } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube, SiTiktok } from 'react-icons/si';

interface FollowUsSectionProps {
  socialLinks: SocialLink[];
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <SiFacebook size={24} />,
  instagram: <SiInstagram size={24} />,
  twitter: <SiX size={24} />,
  x: <SiX size={24} />,
  linkedin: <SiLinkedin size={24} />,
  youtube: <SiYoutube size={24} />,
  tiktok: <SiTiktok size={24} />,
};

const platformGradients: Record<string, string> = {
  facebook: 'linear-gradient(135deg, rgba(24,119,242,0.4), rgba(99,102,241,0.4))',
  instagram: 'linear-gradient(135deg, rgba(217,70,239,0.4), rgba(249,115,22,0.3))',
  twitter: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
  x: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
  linkedin: 'linear-gradient(135deg, rgba(10,102,194,0.4), rgba(99,102,241,0.4))',
  youtube: 'linear-gradient(135deg, rgba(217,70,239,0.4), rgba(239,68,68,0.3))',
  tiktok: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(217,70,239,0.4))',
};

export default function FollowUsSection({ socialLinks }: FollowUsSectionProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section
      id="follow"
      className="relative py-24 overflow-hidden section-follow-bg"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.6) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-fuchsia-500 dark:text-fuchsia-400 mb-3">
            Stay Connected
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold section-heading">
            Follow Us
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-cobalt-500 via-violet-500 to-fuchsia-500 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {socialLinks.map((link, index) => {
            const platformKey = link.platform.toLowerCase();
            const icon = platformIcons[platformKey] || <ExternalLink size={24} />;
            const gradient = platformGradients[platformKey] || 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(217,70,239,0.4))';

            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl p-6 flex flex-col items-center gap-3 card-hover-lift section-glass-card"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                  style={{ background: gradient, border: '1px solid rgba(120, 80, 255, 0.3)' }}
                >
                  {icon}
                </div>
                <span className="font-sans text-sm font-medium section-body-text group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300 transition-colors duration-200 capitalize">
                  {link.platform}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
