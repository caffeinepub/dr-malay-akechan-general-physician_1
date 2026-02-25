import React, { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent, useListImages } from '../../hooks/useQueries';
import ImagePickerModal from './ImagePickerModal';
import InlineEditable from '../InlineEditable';
import { Service } from '../../backend';
import { Plus, Trash2, Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function ServicesEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();
  const { data: images = [] } = useListImages();

  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePickerIndex, setImagePickerIndex] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (content?.services && !initialized) {
      setServices(content.services.map((s) => ({ ...s })));
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

  const saveServices = async (updated: Service[]) => {
    if (!actor) return;
    await actor.setServices(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleInlineSave = async (index: number, field: keyof Service, value: string) => {
    const updated = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setServices(updated);
    await saveServices(updated);
  };

  const handleAdd = () => {
    setServices([...services, { title: 'New Service', description: '', iconImageId: undefined }]);
  };

  const handleRemove = async (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
    await saveServices(updated);
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setServices(services);
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
          Services ({services.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add Service
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

      {services.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">No services yet. Click "Add Service" to begin.</div>
      )}

      {services.map((service, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-start gap-3">
            {/* Icon image */}
            <div
              className="group relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-blue-400/50 transition-all flex-shrink-0"
              onClick={() => setImagePickerIndex(index)}
            >
              {getImageUrl(service.iconImageId) ? (
                <img src={getImageUrl(service.iconImageId)!} alt="Icon" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                  <ImageIcon size={16} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">Edit</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <InlineEditable
                label="Title"
                value={service.title}
                onSave={(v) => handleInlineSave(index, 'title', v)}
                fieldType="text"
                placeholder="Service title..."
              />
              <InlineEditable
                label="Description"
                value={service.description}
                onSave={(v) => handleInlineSave(index, 'description', v)}
                fieldType="textarea"
                placeholder="Service description..."
              />
            </div>

            <button
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0"
              title="Remove service"
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
            const updated = services.map((s, i) =>
              i === imagePickerIndex ? { ...s, iconImageId: id } : s
            );
            setServices(updated);
            saveServices(updated);
            setImagePickerIndex(null);
          }}
          onClose={() => setImagePickerIndex(null)}
          selectedId={services[imagePickerIndex]?.iconImageId}
        />
      )}
    </div>
  );
}
