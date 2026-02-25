import React, { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent, useListImages } from '../../hooks/useQueries';
import ImagePickerModal from './ImagePickerModal';
import InlineEditable from '../InlineEditable';
import { Clinic } from '../../backend';
import { Plus, Trash2, Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function ClinicsEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();
  const { data: images = [] } = useListImages();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (content?.clinics && !initialized) {
      setClinics(content.clinics.map((c) => ({ ...c })));
      setInitialized(true);
    }
  }, [content, initialized]);

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return null;
    const img = images.find((i) => i.id === id);
    if (!img) return null;
    const blob = new Blob([new Uint8Array(img.data)], { type: img.mimeType });
    return URL.createObjectURL(blob);
  };

  const saveClinics = async (updated: Clinic[]) => {
    if (!actor) return;
    await actor.setClinics(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleInlineSave = async (index: number, field: keyof Clinic, value: string) => {
    const updated = clinics.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    setClinics(updated);
    await saveClinics(updated);
  };

  const handleAdd = () => {
    setClinics([
      ...clinics,
      { name: 'New Clinic', address: '', phone: '', mapLink: '', photoImageId: undefined },
    ]);
  };

  const handleRemove = async (index: number) => {
    const updated = clinics.filter((_, i) => i !== index);
    setClinics(updated);
    await saveClinics(updated);
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setClinics(clinics);
      await queryClient.invalidateQueries({ queryKey: ['content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Clinics ({clinics.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add Clinic
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      {clinics.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">No clinics yet. Click "Add Clinic" to begin.</div>
      )}

      {clinics.map((clinic, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-start gap-3">
            {/* Photo */}
            <div
              className="group relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-400/50 transition-all flex-shrink-0"
              onClick={() => setImagePickerIndex(index)}
            >
              {getImageUrl(clinic.photoImageId) ? (
                <img src={getImageUrl(clinic.photoImageId)!} alt="Clinic" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                  <ImageIcon size={16} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">Edit</span>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <InlineEditable
                label="Clinic Name"
                value={clinic.name}
                onSave={(v) => handleInlineSave(index, 'name', v)}
                fieldType="text"
                placeholder="Clinic name..."
              />
              <InlineEditable
                label="Address"
                value={clinic.address}
                onSave={(v) => handleInlineSave(index, 'address', v)}
                fieldType="textarea"
                placeholder="Address..."
              />
              <InlineEditable
                label="Phone"
                value={clinic.phone}
                onSave={(v) => handleInlineSave(index, 'phone', v)}
                fieldType="tel"
                placeholder="Phone number..."
              />
              <InlineEditable
                label="Map Link"
                value={clinic.mapLink}
                onSave={(v) => handleInlineSave(index, 'mapLink', v)}
                fieldType="url"
                placeholder="Google Maps URL..."
              />
            </div>

            <button
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0"
              title="Remove clinic"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {imagePickerIndex !== null && (
        <ImagePickerModal
          open={true}
          onSelect={(id) => {
            const updated = clinics.map((c, i) =>
              i === imagePickerIndex ? { ...c, photoImageId: id } : c
            );
            setClinics(updated);
            saveClinics(updated);
            setImagePickerIndex(null);
          }}
          onClose={() => setImagePickerIndex(null)}
          selectedId={clinics[imagePickerIndex]?.photoImageId}
        />
      )}
    </div>
  );
}
