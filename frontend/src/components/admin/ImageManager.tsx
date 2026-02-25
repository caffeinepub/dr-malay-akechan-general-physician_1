import React, { useState, useRef } from 'react';
import { useListImages, useUploadImage, useDeleteImage } from '../../hooks/useQueries';
import { Upload, Trash2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ImageManager() {
  const { data: images, isLoading } = useListImages();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;
    for (const file of Array.from(files)) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await uploadImage.mutateAsync({ filename: file.name, mimeType: file.type || 'image/jpeg', data: uint8Array });
        successCount++;
      } catch {
        errorCount++;
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (successCount > 0) toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded!`);
    if (errorCount > 0) toast.error(`${errorCount} image${errorCount > 1 ? 's' : ''} failed.`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteImage.mutateAsync(id);
      toast.success('Image deleted.');
    } catch {
      toast.error('Failed to delete image.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (uploadedAt: bigint) =>
    new Date(Number(uploadedAt) / 1_000_000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatSize = (data: Uint8Array) => {
    const bytes = data.length;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(15, 8, 45, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(120, 80, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(80, 40, 200, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-semibold text-white">Image Manager</h2>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
            }}
          >
            {uploading ? (
              <><Loader2 size={14} className="animate-spin" /> Uploading…</>
            ) : (
              <><Upload size={14} /> Upload Images</>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      ) : !images || images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(120, 80, 255, 0.2)',
            }}
          >
            <ImageIcon size={28} className="text-violet-400" />
          </div>
          <p className="font-sans text-white/70 font-medium">No images uploaded yet</p>
          <p className="font-sans text-white/40 text-sm mt-1 max-w-xs">
            Upload images to use as backgrounds, doctor photos, clinic photos, and service icons.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
              border: '1px solid rgba(139,92,246,0.4)',
            }}
          >
            <Upload size={14} /> Upload First Image
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => {
              const url = URL.createObjectURL(new Blob([new Uint8Array(image.data)], { type: image.mimeType }));
              const isDeleting = deletingId === image.id;
              return (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden aspect-square"
                  style={{ border: '1px solid rgba(120, 80, 255, 0.2)' }}
                >
                  <img src={url} alt={image.filename} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-xs font-medium text-center px-2 truncate w-full">{image.filename}</p>
                    <p className="text-white/60 text-xs">{formatSize(image.data)}</p>
                    <p className="text-white/60 text-xs">{formatDate(image.uploadedAt)}</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={isDeleting}
                          className="mt-1 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-white transition-all duration-200"
                          style={{
                            background: 'rgba(239,68,68,0.8)',
                            border: '1px solid rgba(239,68,68,0.4)',
                          }}
                        >
                          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <><Trash2 size={12} /> Delete</>}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        style={{
                          background: 'rgba(15, 8, 45, 0.95)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(120, 80, 255, 0.25)',
                        }}
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-white flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-400" /> Delete Image
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-sans text-white/60">
                            Are you sure you want to delete "{image.filename}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-sans text-white/60 hover:text-white bg-white/5 border-white/10">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(image.id)}
                            className="font-sans bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="font-sans text-xs text-white/30 mt-4 text-right">
            {images.length} image{images.length !== 1 ? 's' : ''} stored
          </p>
        </>
      )}
    </div>
  );
}
