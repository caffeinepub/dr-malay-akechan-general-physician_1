import React, { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent } from '../../hooks/useQueries';
import InlineEditable from '../InlineEditable';
import { DetailedFooter } from '../../backend';
import { Save, Loader2 } from 'lucide-react';

export default function FooterEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();
  const footer = content?.footer;

  const [practiceName, setPracticeName] = useState('');
  const [tagline, setTagline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [copyrightText, setCopyrightText] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (footer && !initialized) {
      setPracticeName(footer.practiceName || '');
      setTagline(footer.tagline || '');
      setShortDescription(footer.shortDescription || '');
      setCopyrightText(footer.copyrightText || '');
      setContactEmail(footer.contactEmail || '');
      setPhone(footer.phone || '');
      setAddress(footer.address || '');
      setOpeningHours(footer.openingHours || '');
      setInitialized(true);
    }
  }, [footer, initialized]);

  const buildFooter = (overrides: Partial<DetailedFooter> = {}): DetailedFooter => ({
    practiceName: overrides.practiceName ?? practiceName,
    tagline: overrides.tagline ?? tagline,
    shortDescription: overrides.shortDescription ?? shortDescription,
    copyrightText: overrides.copyrightText ?? copyrightText,
    contactEmail: overrides.contactEmail ?? contactEmail,
    phone: overrides.phone ?? phone,
    address: overrides.address ?? address,
    openingHours: overrides.openingHours ?? openingHours,
  });

  const saveFooter = async (overrides: Partial<DetailedFooter> = {}) => {
    if (!actor) return;
    await actor.setFooter(buildFooter(overrides));
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await saveFooter();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hover-to-edit quick panel */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Quick Edit (hover any field)
        </h3>
        <div className="space-y-1">
          <InlineEditable
            label="Practice Name"
            value={footer?.practiceName || ''}
            onSave={async (v) => { setPracticeName(v); await saveFooter({ practiceName: v }); }}
            fieldType="text"
            placeholder="Practice name..."
          />
          <InlineEditable
            label="Tagline"
            value={footer?.tagline || ''}
            onSave={async (v) => { setTagline(v); await saveFooter({ tagline: v }); }}
            fieldType="text"
            placeholder="Tagline..."
          />
          <InlineEditable
            label="Short Description"
            value={footer?.shortDescription || ''}
            onSave={async (v) => { setShortDescription(v); await saveFooter({ shortDescription: v }); }}
            fieldType="textarea"
            placeholder="Short description..."
          />
          <InlineEditable
            label="Copyright Text"
            value={footer?.copyrightText || ''}
            onSave={async (v) => { setCopyrightText(v); await saveFooter({ copyrightText: v }); }}
            fieldType="text"
            placeholder="© 2025 Practice Name..."
          />
          <InlineEditable
            label="Contact Email"
            value={footer?.contactEmail || ''}
            onSave={async (v) => { setContactEmail(v); await saveFooter({ contactEmail: v }); }}
            fieldType="email"
            placeholder="contact@example.com"
          />
          <InlineEditable
            label="Phone"
            value={footer?.phone || ''}
            onSave={async (v) => { setPhone(v); await saveFooter({ phone: v }); }}
            fieldType="tel"
            placeholder="+1 (555) 000-0000"
          />
          <InlineEditable
            label="Address"
            value={footer?.address || ''}
            onSave={async (v) => { setAddress(v); await saveFooter({ address: v }); }}
            fieldType="textarea"
            placeholder="123 Medical Drive, City, State..."
          />
          <InlineEditable
            label="Opening Hours"
            value={footer?.openingHours || ''}
            onSave={async (v) => { setOpeningHours(v); await saveFooter({ openingHours: v }); }}
            fieldType="textarea"
            placeholder="Mon–Fri: 9am–6pm&#10;Sat: 10am–4pm&#10;Sun: Closed"
          />
        </div>
      </div>

      {/* Full form editor */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
          Full Form Editor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Practice Name</label>
            <input
              type="text"
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="Practice name..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="Tagline..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-white/60 mb-1">Short Description</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Short description..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Copyright Text</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="© 2025 Practice Name..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none"
              placeholder="123 Medical Drive..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-white/60 mb-1">Opening Hours</label>
            <textarea
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Mon–Fri: 9am–6pm&#10;Sat: 10am–4pm&#10;Sun: Closed"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Footer'}
          </button>
        </div>
      </div>
    </div>
  );
}
