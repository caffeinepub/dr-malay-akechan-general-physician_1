import React from 'react';
import { DetailedFooter, SocialLink } from '../backend';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronUp,
  Heart,
  ExternalLink,
} from 'lucide-react';
import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiLinkedin,
  SiYoutube,
  SiTiktok,
} from 'react-icons/si';

interface FooterProps {
  footer?: DetailedFooter;
  socialLinks?: SocialLink[];
}

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  instagram: <SiInstagram size={18} />,
  facebook: <SiFacebook size={18} />,
  twitter: <SiX size={18} />,
  x: <SiX size={18} />,
  linkedin: <SiLinkedin size={18} />,
  youtube: <SiYoutube size={18} />,
  tiktok: <SiTiktok size={18} />,
};

const getSocialIcon = (platform: string) => {
  const key = platform.toLowerCase();
  return SOCIAL_ICON_MAP[key] || <ExternalLink size={18} />;
};

const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'Follow Us', href: '#follow' },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToSection = (href: string) => {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export default function Footer({ footer, socialLinks = [] }: FooterProps) {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'medical-practice');

  const practiceName = footer?.practiceName || 'Medical Practice';
  const tagline = footer?.tagline || 'Compassionate Care, Expert Healing';
  const shortDescription =
    footer?.shortDescription ||
    'Dedicated to providing exceptional medical care with a patient-first approach.';
  const copyrightText = footer?.copyrightText || `© ${year} ${practiceName}. All rights reserved.`;
  const contactEmail = footer?.contactEmail || '';
  const phone = footer?.phone || '';
  const address = footer?.address || '';
  const openingHours = footer?.openingHours || '';

  return (
    <footer className="footer-bg relative overflow-hidden" id="footer">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 rounded-full bg-fuchsia-600/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* ── Top branded section ── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-fuchsia-500 mb-4 shadow-lg shadow-purple-500/30">
            <span className="text-white font-bold text-xl">
              {practiceName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold footer-heading mb-2 tracking-tight">
            {practiceName}
          </h2>
          <p className="text-base footer-tagline font-medium mb-3">{tagline}</p>
          <p className="text-sm footer-description max-w-md leading-relaxed">{shortDescription}</p>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider mb-12" />

        {/* ── Four-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="footer-col-heading mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="footer-link text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-fuchsia-400 transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-col-heading mb-5">Contact Info</h4>
            <ul className="space-y-3">
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="footer-link text-sm flex items-start gap-3 group"
                  >
                    <Mail size={15} className="mt-0.5 flex-shrink-0 text-blue-400 group-hover:text-fuchsia-400 transition-colors" />
                    <span className="break-all">{contactEmail}</span>
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="footer-link text-sm flex items-start gap-3 group"
                  >
                    <Phone size={15} className="mt-0.5 flex-shrink-0 text-blue-400 group-hover:text-fuchsia-400 transition-colors" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="footer-link text-sm flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-blue-400" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {!contactEmail && !phone && !address && (
                <li className="text-sm footer-muted italic">No contact info yet.</li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="footer-col-heading mb-5">Opening Hours</h4>
            {openingHours ? (
              <div className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <p className="text-sm footer-body whitespace-pre-line leading-relaxed">
                  {openingHours}
                </p>
              </div>
            ) : (
              <p className="text-sm footer-muted italic">Hours not set.</p>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h4 className="footer-col-heading mb-5">Follow Us</h4>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="footer-social-btn"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm footer-muted italic">No social links yet.</p>
            )}

            {/* Newsletter teaser */}
            <div className="mt-6 p-4 rounded-xl footer-newsletter-card">
              <p className="text-xs footer-newsletter-text font-medium mb-2">Stay Updated</p>
              <p className="text-xs footer-muted leading-relaxed">
                Follow us on social media for health tips and clinic news.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs footer-muted text-center sm:text-left">{copyrightText}</p>

          <p className="text-xs footer-muted flex items-center gap-1">
            Built with{' '}
            <Heart size={12} className="text-fuchsia-400 fill-fuchsia-400 mx-0.5" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-fuchsia-400 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>

          <button
            onClick={scrollToTop}
            className="footer-back-to-top flex items-center gap-2 text-xs font-medium"
            aria-label="Back to top"
          >
            <ChevronUp size={14} />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
