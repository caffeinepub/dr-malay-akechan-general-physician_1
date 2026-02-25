import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Check, Image as ImageIcon } from 'lucide-react';
import { useListImages } from '../../hooks/useQueries';

interface ImagePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageId: string) => void;
  selectedId?: string;
}

export default function ImagePickerModal({ open, onClose, onSelect, selectedId }: ImagePickerModalProps) {
  const { data: images, isLoading } = useListImages();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] flex flex-col"
        style={{
          background: 'rgba(15, 8, 45, 0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(120, 80, 255, 0.25)',
          boxShadow: '0 16px 48px rgba(80, 40, 200, 0.3)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-white">Select Image</DialogTitle>
          <DialogDescription className="font-sans text-white/50">
            Choose an image from your uploaded library.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="animate-spin text-violet-400" />
            </div>
          ) : !images || images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ImageIcon size={40} className="text-white/20 mb-3" />
              <p className="font-sans text-white/50 text-sm">No images uploaded yet.</p>
              <p className="font-sans text-white/30 text-xs mt-1">Go to Image Manager to upload images first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-1">
              {images.map((image) => {
                const url = URL.createObjectURL(new Blob([new Uint8Array(image.data)], { type: image.mimeType }));
                const isSelected = selectedId === image.id;
                const isHovered = hoveredId === image.id;
                return (
                  <button
                    key={image.id}
                    onClick={() => onSelect(image.id)}
                    onMouseEnter={() => setHoveredId(image.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="relative aspect-square rounded-xl overflow-hidden transition-all duration-150"
                    style={{
                      border: isSelected
                        ? '2px solid rgba(217,70,239,0.8)'
                        : isHovered
                        ? '2px solid rgba(139,92,246,0.6)'
                        : '2px solid rgba(120, 80, 255, 0.2)',
                      boxShadow: isSelected ? '0 0 16px rgba(217,70,239,0.3)' : undefined,
                    }}
                  >
                    <img src={url} alt={image.filename} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(217,70,239,0.25)' }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(217,70,239,0.9)' }}
                        >
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                    {isHovered && !isSelected && (
                      <div
                        className="absolute inset-0"
                        style={{ background: 'rgba(139,92,246,0.15)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
