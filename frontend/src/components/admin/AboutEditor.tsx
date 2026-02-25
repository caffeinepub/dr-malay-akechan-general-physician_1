import React, { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent, useListImages } from '../../hooks/useQueries';
import ImagePickerModal from './ImagePickerModal';
import InlineEditable from '../InlineEditable';
import { AboutSection } from '../../backend';
import { Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function AboutEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();
  const about = content?.aboutSection;

  const [bioText, setBioText] = useState('');
  const [photoImageId, setPhotoImageId] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  React.useEffect(() => {
    if (about && !formInitialized) {
      setBioText(about.bioText || '');
      setPhotoImageId(about.photoImageId ?? null);
      setFormInitialized(true);
    }
  }, [about, formInitialized]);

  const { data: images = [] } = useListImages();

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return null;
    const img = images.find((i) => i.id === id);
    if (!img) return null;
    const blob = new Blob([new Uint8Array(img.data)], { type: img.mimeType });
    return URL.createObjectURL(blob);
  };

  const saveAbout = async (updates: Partial<AboutSection>) => {
    if (!actor) return;
    const current = about || { bioText: '', photoImageId: undefined };
    const updated: AboutSection = {
      bioText: updates.bioText ?? current.bioText,
      photoImageId: updates.photoImageId !== undefined ? updates.photoImageId : current.photoImageId,
    };
    await actor.setAboutSection(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setAboutSection({
        bioText,
        photoImageId: photoImageId ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const photoUrl = getImageUrl(photoImageId);

  return (
    <div className="space-y-6">
      {/* Hover-to-edit preview */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Quick Edit (hover any field)
        </h3>
        <InlineEditable
          label="Bio Text"
          value={about?.bioText || ''}
          onSave={async (v) => { setBioText(v); await saveAbout({ bioText: v }); }}
          fieldType="textarea"
          placeholder="Enter bio text..."
        />
        <div className="mt-4">
          <div className="text-xs text-blue-300/70 mb-2 font-medium">Doctor Photo</div>
          <div
            className="group relative w-32 h-32 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-400/50 transition-all"
            onClick={() => setShowImagePicker(true)}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Doctor" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30">
                <ImageIcon size={20} />
                <span className="text-xs mt-1">No photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
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
            <label className="block text-xs text-white/60 mb-1">Bio Text</label>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={6}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Enter bio text..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Doctor Photo</label>
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white/80 transition-colors"
            >
              <ImageIcon size={14} />
              {photoImageId ? 'Change Photo' : 'Select Photo'}
            </button>
            {photoImageId && (
              <button
                type="button"
                onClick={() => setPhotoImageId(null)}
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
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save About Section'}
          </button>
        </div>
      </div>

      {showImagePicker && (
        <ImagePickerModal
          open={showImagePicker}
          onSelect={(id) => { setPhotoImageId(id); setShowImagePicker(false); }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
