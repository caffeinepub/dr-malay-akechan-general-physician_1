import React, { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent } from '../../hooks/useQueries';
import InlineEditable from '../InlineEditable';
import { SocialLink } from '../../backend';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

export default function SocialLinksEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (content?.socialLinks && !initialized) {
      setLinks(content.socialLinks.map((l) => ({ ...l })));
      setInitialized(true);
    }
  }, [content, initialized]);

  const saveLinks = async (updated: SocialLink[]) => {
    if (!actor) return;
    await actor.setSocialLinks(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleInlineSave = async (index: number, field: keyof SocialLink, value: string) => {
    const updated = links.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    );
    setLinks(updated);
    await saveLinks(updated);
  };

  const handleAdd = () => {
    setLinks([...links, { platform: 'Instagram', url: '' }]);
  };

  const handleRemove = async (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    await saveLinks(updated);
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setSocialLinks(links);
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
          Social Links ({links.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add Link
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

      {links.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">No social links yet. Click "Add Link" to begin.</div>
      )}

      {links.map((link, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <InlineEditable
                label="Platform"
                value={link.platform}
                onSave={(v) => handleInlineSave(index, 'platform', v)}
                fieldType="text"
                placeholder="e.g. Instagram, Facebook..."
              />
              <InlineEditable
                label="URL"
                value={link.url}
                onSave={(v) => handleInlineSave(index, 'url', v)}
                fieldType="url"
                placeholder="https://..."
              />
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0"
              title="Remove link"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
