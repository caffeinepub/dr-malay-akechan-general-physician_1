import React from 'react';
import { Pencil } from 'lucide-react';

interface EditableWrapperProps {
  children: React.ReactNode;
  onEdit: () => void;
  label?: string;
}

export default function EditableWrapper({ children, onEdit, label }: EditableWrapperProps) {
  return (
    <div className="relative group">
      {children}
      <button
        onClick={onEdit}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-white"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(217,70,239,0.9))',
          border: '1px solid rgba(139,92,246,0.4)',
          boxShadow: '0 4px 12px rgba(80, 40, 200, 0.3)',
        }}
        aria-label={label ? `Edit ${label}` : 'Edit'}
      >
        <Pencil size={12} />
        {label && <span>{label}</span>}
      </button>
      {/* Hover ring */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ border: '1px solid rgba(139,92,246,0.3)' }}
      />
    </div>
  );
}
