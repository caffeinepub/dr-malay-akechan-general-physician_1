import React, { useState, useEffect } from 'react';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useGetContent } from '../../hooks/useQueries';
import InlineEditable from '../InlineEditable';
import { PatientReview } from '../../backend';
import { Plus, Trash2, Star, Save, Loader2 } from 'lucide-react';

export default function ReviewsEditor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content } = useGetContent();

  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (content?.patientReviews && !initialized) {
      setReviews(content.patientReviews.map((r) => ({ ...r })));
      setInitialized(true);
    }
  }, [content, initialized]);

  const saveReviews = async (updated: PatientReview[]) => {
    if (!actor) return;
    await actor.setPatientReviews(updated);
    await queryClient.invalidateQueries({ queryKey: ['content'] });
  };

  const handleInlineSave = async (index: number, field: keyof PatientReview, value: string) => {
    const updated = reviews.map((r, i) => {
      if (i !== index) return r;
      if (field === 'rating') return { ...r, rating: BigInt(Math.min(5, Math.max(1, parseInt(value) || 5))) };
      if (field === 'date') return { ...r, date: BigInt(new Date(value).getTime()) };
      return { ...r, [field]: value };
    });
    setReviews(updated);
    await saveReviews(updated);
  };

  const handleAdd = () => {
    setReviews([
      ...reviews,
      {
        patientName: 'New Patient',
        reviewText: '',
        rating: BigInt(5),
        date: BigInt(Date.now()),
      },
    ]);
  };

  const handleRemove = async (index: number) => {
    const updated = reviews.filter((_, i) => i !== index);
    setReviews(updated);
    await saveReviews(updated);
  };

  const handleRatingChange = async (index: number, rating: number) => {
    const updated = reviews.map((r, i) =>
      i === index ? { ...r, rating: BigInt(rating) } : r
    );
    setReviews(updated);
    await saveReviews(updated);
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.setPatientReviews(reviews);
      await queryClient.invalidateQueries({ queryKey: ['content'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (ts: bigint) => {
    const d = new Date(Number(ts));
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Patient Reviews ({reviews.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs transition-colors"
          >
            <Plus size={12} /> Add Review
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

      {reviews.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">No reviews yet. Click "Add Review" to begin.</div>
      )}

      {reviews.map((review, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <InlineEditable
                label="Patient Name"
                value={review.patientName}
                onSave={(v) => handleInlineSave(index, 'patientName', v)}
                fieldType="text"
                placeholder="Patient name..."
              />
              <InlineEditable
                label="Review Text"
                value={review.reviewText}
                onSave={(v) => handleInlineSave(index, 'reviewText', v)}
                fieldType="textarea"
                placeholder="Review text..."
              />
              <div className="px-3 py-2">
                <div className="text-xs text-blue-300/70 mb-1 font-medium">Rating</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(index, star)}
                      className="transition-colors"
                    >
                      <Star
                        size={18}
                        className={Number(review.rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <InlineEditable
                label="Date"
                value={formatDate(review.date)}
                onSave={(v) => handleInlineSave(index, 'date', v)}
                fieldType="text"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0"
              title="Remove review"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
