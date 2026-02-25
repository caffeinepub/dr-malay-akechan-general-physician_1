import React, { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent, useListImages } from '../../hooks/useQueries';
import ImagePickerModal from './ImagePickerModal';
import InlineEditable from '../InlineEditable';
import { HeroSection } from '../../backend';
import { Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function HeroEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();
  const hero = content?.heroSection;

  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [tagline, setTagline] = useState('');
  const [backgroundImageId, setBackgroundImageId] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  React.useEffect(() => {
    if (hero && !formInitialized) {
      setHeadline(hero.headline || '');
      setSubheadline(hero.subheadline || '');
      setTagline(hero.tagline || '');
      setBackgroundImageId(hero.backgroundImageId ?? null);
      setFormInitialized(true);
    }
  }, [hero, formInitialized]);

  const { data: images = [] } = useListImages();

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return null;
    const img = images.find((i) => i.id === id);
    if (!img) return null;
    const blob = new Blob([new Uint8Array(img.data)], { type: img.mimeType });
    return URL.createObjectURL(blob);
  };

  const saveHero = async (updates: Partial<HeroSection>) => {
    if (!actor) return;
    const current = hero || { headline: '', subheadline: '', tagline: '', backgroundImageId: undefined };
    const updated: HeroSection = {
      headline: updates.headline ?? current.headline,
      subheadline: updates.subheadline ?? current.subheadline,
      tagline: updates.tagline ?? current.tagline,
      backgroundImageId: updates.backgroundImageId !== undefined ? updates.backgroundImageId : current.backgroundImageId,
    };
    await actor.setHeroSection(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setHeroSection({
        headline,
        subheadline,
        tagline,
        backgroundImageId: backgroundImageId ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const bgUrl = getImageUrl(backgroundImageId);

  return (
    <div className="space-y-6">
      {/* Hover-to-edit preview */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Quick Edit (hover any field)
        </h3>
        <div className="space-y-1">
          <InlineEditable
            label="Headline"
            value={hero?.headline || ''}
            onSave={async (v) => { setHeadline(v); await saveHero({ headline: v }); }}
            fieldType="text"
            placeholder="Enter headline..."
          />
          <InlineEditable
            label="Subheadline"
            value={hero?.subheadline || ''}
            onSave={async (v) => { setSubheadline(v); await saveHero({ subheadline: v }); }}
            fieldType="textarea"
            placeholder="Enter subheadline..."
          />
          <InlineEditable
            label="Tagline"
            value={hero?.tagline || ''}
            onSave={async (v) => { setTagline(v); await saveHero({ tagline: v }); }}
            fieldType="text"
            placeholder="Enter tagline..."
          />
        </div>

        {/* Background image quick edit */}
        <div className="mt-4">
          <div className="text-xs text-blue-300/70 mb-2 font-medium">Background Image</div>
          <div
            className="group relative w-full h-28 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-400/50 transition-all"
            onClick={() => setShowImagePicker(true)}
          >
            {bgUrl ? (
              <img src={bgUrl} alt="Background" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                <ImageIcon size={24} />
                <span className="ml-2 text-sm">No background image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change Image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full form editor */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
          Full Form Editor
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="Enter headline..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Subheadline</label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Enter subheadline..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
              placeholder="Enter tagline..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Background Image</label>
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white/80 transition-colors"
            >
              <ImageIcon size={14} />
              {backgroundImageId ? 'Change Image' : 'Select Image'}
            </button>
            {backgroundImageId && (
              <button
                type="button"
                onClick={() => setBackgroundImageId(null)}
                className="ml-2 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      </div>

      {showImagePicker && (
        <ImagePickerModal
          open={showImagePicker}
          onSelect={(id) => { setBackgroundImageId(id); setShowImagePicker(false); }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
