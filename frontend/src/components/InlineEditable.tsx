import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface InlineEditableProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  fieldType?: 'text' | 'textarea' | 'number' | 'email' | 'tel' | 'url';
  label?: string;
  className?: string;
  displayClassName?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export default function InlineEditable({
  value,
  onSave,
  fieldType = 'text',
  label,
  className = '',
  displayClassName = '',
  placeholder = 'Click to edit...',
  min,
  max,
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(editValue);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fieldType !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="flex-1">
          {label && <div className="text-xs text-blue-300 mb-1 font-medium">{label}</div>}
          {fieldType === 'textarea' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="w-full bg-white/10 border border-blue-400/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400 resize-none"
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={fieldType}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              className="w-full bg-white/10 border border-blue-400/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
              placeholder={placeholder}
            />
          )}
        </div>
        <div className="flex gap-1 mt-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-400 transition-colors disabled:opacity-50"
            title="Save"
          >
            <Check size={14} />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-start gap-2 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
      title={`Click to edit${label ? ` ${label}` : ''}`}
    >
      <div className="flex-1">
        {label && <div className="text-xs text-blue-300/70 mb-1 font-medium">{label}</div>}
        <div
          className={`text-sm rounded-lg px-3 py-2 transition-all duration-200 ${
            isHovered
              ? 'bg-white/10 ring-1 ring-blue-400/50'
              : 'bg-transparent'
          } ${displayClassName}`}
        >
          {value || <span className="text-white/30 italic">{placeholder}</span>}
        </div>
      </div>
      <div
        className={`mt-1 p-1.5 rounded-lg bg-blue-500/20 text-blue-400 transition-all duration-200 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <Pencil size={12} />
      </div>
    </div>
  );
}
