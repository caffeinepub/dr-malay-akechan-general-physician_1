import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'date';
  placeholder?: string;
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialValues: Record<string, string | number>;
  onSave: (values: Record<string, string | number>) => Promise<void>;
}

export default function EditModal({
  open,
  onClose,
  title,
  fields,
  initialValues,
  onSave,
}: EditModalProps) {
  const [values, setValues] = useState<Record<string, string | number>>(initialValues);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(values);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{
          background: 'rgba(15, 8, 45, 0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(120, 80, 255, 0.25)',
          boxShadow: '0 16px 48px rgba(80, 40, 200, 0.3)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-white">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block font-sans text-sm font-medium text-white/70 mb-1.5">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={String(values[field.key] ?? '')}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={4}
                  className="admin-input resize-none text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(120, 80, 255, 0.25)',
                    borderRadius: '0.5rem',
                    padding: '0.625rem 0.75rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: 'white',
                    outline: 'none',
                  }}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={String(values[field.key] ?? '')}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="admin-input text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(120, 80, 255, 0.25)',
                    borderRadius: '0.5rem',
                    padding: '0.625rem 0.75rem',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: 'white',
                    outline: 'none',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="font-sans text-white/60 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="font-sans"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
              border: '1px solid rgba(139,92,246,0.4)',
              color: 'white',
            }}
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Saving…
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
