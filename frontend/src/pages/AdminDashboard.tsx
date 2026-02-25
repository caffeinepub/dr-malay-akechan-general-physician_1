import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import HeroEditor from '../components/admin/HeroEditor';
import AboutEditor from '../components/admin/AboutEditor';
import ServicesEditor from '../components/admin/ServicesEditor';
import ReviewsEditor from '../components/admin/ReviewsEditor';
import ClinicsEditor from '../components/admin/ClinicsEditor';
import SocialLinksEditor from '../components/admin/SocialLinksEditor';
import FooterEditor from '../components/admin/FooterEditor';
import ImageManager from '../components/admin/ImageManager';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Star,
  MapPin,
  Share2,
  FileText,
  Info,
  Stethoscope,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const tabs = [
  { id: 'hero', label: 'Hero', icon: LayoutDashboard },
  { id: 'about', label: 'About', icon: Info },
  { id: 'services', label: 'Services', icon: Stethoscope },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'clinics', label: 'Clinics', icon: MapPin },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'images', label: 'Images', icon: ImageIcon },
];

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    if (actor) {
      try {
        await actor.logout(token);
      } catch {
        // ignore
      }
    }
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hero': return <HeroEditor />;
      case 'about': return <AboutEditor />;
      case 'services': return <ServicesEditor />;
      case 'reviews': return <ReviewsEditor />;
      case 'clinics': return <ClinicsEditor />;
      case 'social': return <SocialLinksEditor />;
      case 'footer': return <FooterEditor />;
      case 'images': return <ImageManager />;
      default: return null;
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #080318 0%, #0f0530 50%, #080318 100%)',
      }}
    >
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} flex flex-col`}
        style={{
          background: 'rgba(10, 5, 35, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(120, 80, 255, 0.15)',
        }}
      >
        {/* Sidebar header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(120, 80, 255, 0.15)' }}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cobalt-500 via-violet-500 to-fuchsia-500 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)' }}
              >
                <span className="text-white font-serif font-bold text-xs">M</span>
              </div>
              <span
                className="font-serif text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #818cf8, #a78bfa, #e879f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(217,70,239,0.15))',
                  border: '1px solid rgba(120, 80, 255, 0.25)',
                } : {}}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={16} className={isActive ? 'text-fuchsia-400' : ''} />
                {sidebarOpen && <span>{label}</span>}
                {sidebarOpen && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(120, 80, 255, 0.15)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{
            background: 'rgba(8, 3, 24, 0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(120, 80, 255, 0.15)',
          }}
        >
          <h1 className="font-serif text-xl font-semibold text-white">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1 rounded-full text-xs font-sans font-medium text-fuchsia-300"
              style={{
                background: 'rgba(217,70,239,0.1)',
                border: '1px solid rgba(217,70,239,0.2)',
              }}
            >
              Admin
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
