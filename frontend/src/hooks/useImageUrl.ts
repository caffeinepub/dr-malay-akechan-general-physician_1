import { useState, useEffect } from 'react';
import { useGetImage } from './useQueries';
import { imageToUrl } from '../lib/imageUtils';

export function useImageUrl(imageId: string | undefined): string | null {
  const { data: image } = useGetImage(imageId);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image && image.data) {
      const objectUrl = imageToUrl(image.data, image.mimeType);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setUrl(null);
    }
  }, [image]);

  return url;
}
