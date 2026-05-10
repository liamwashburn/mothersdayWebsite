import { familyPhotos } from 'virtual:family-photos';
import { galleryImages as editableGalleryImages, memories } from '../data/siteContent.js';

export function normalizeImagePath(src = '') {
  try {
    const url = new URL(src, window.location.origin);
    return decodeURIComponent(url.pathname)
      .replace(/^\/Family-Photo\//i, '/Family-Photos/')
      .toLowerCase();
  } catch {
    return decodeURIComponent(src)
      .replace(/^\/Family-Photo\//i, '/Family-Photos/')
      .split('?')[0]
      .split('#')[0]
      .toLowerCase();
  }
}

function isPortraitPhoto(image) {
  return image.orientation === 'portrait' || (image.aspectRatio !== null && image.aspectRatio < 0.9);
}

function decorateGalleryImage(image, index) {
  const isPortrait = isPortraitPhoto(image);

  return {
    ...image,
    label: image.label || 'Family Memory',
    tall: image.tall ?? isPortrait,
    wide: false,
    portrait: isPortrait,
  };
}

export function getFamilyPhotoMeta(src) {
  const normalizedSrc = normalizeImagePath(src);
  const photo = familyPhotos.find((image) => normalizeImagePath(image.src) === normalizedSrc);

  if (!photo) {
    return {
      aspectRatio: null,
      portrait: false,
    };
  }

  return {
    ...photo,
    portrait: isPortraitPhoto(photo),
  };
}

export function getGalleryImages() {
  const usedMemoryPaths = new Set(memories.map((memory) => normalizeImagePath(memory.image)));
  const usedGalleryPaths = new Set();

  const curatedImages = editableGalleryImages
    .filter((image) => {
      const normalizedPath = normalizeImagePath(image.src);

      if (usedMemoryPaths.has(normalizedPath) || usedGalleryPaths.has(normalizedPath)) {
        return false;
      }

      usedGalleryPaths.add(normalizedPath);
      return true;
    })
    .map(decorateGalleryImage);

  const autoFamilyImages = familyPhotos
    .filter((image) => {
      const normalizedPath = normalizeImagePath(image.src);

      if (usedMemoryPaths.has(normalizedPath) || usedGalleryPaths.has(normalizedPath)) {
        return false;
      }

      usedGalleryPaths.add(normalizedPath);
      return true;
    })
    .map((image, index) => decorateGalleryImage(image, curatedImages.length + index));

  return [...curatedImages, ...autoFamilyImages];
}
