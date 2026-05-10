const LOCAL_IMAGE_PREFIX = '/Family-Photos/';

function isLocalFamilyImage(src = '') {
  return src.startsWith(LOCAL_IMAGE_PREFIX);
}

function getNetlifyImageUrl(src, width, quality = 72) {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
    fit: 'contain',
  });

  return `/.netlify/images?${params.toString()}`;
}

export function getResponsiveImageProps(src, widths, { fallbackWidth, sizes, quality = 72 } = {}) {
  const shouldUseNetlifyImageCdn = import.meta.env.PROD && isLocalFamilyImage(src);

  if (!shouldUseNetlifyImageCdn) {
    return {
      src,
      sizes,
    };
  }

  const uniqueWidths = [...new Set(widths)].sort((left, right) => left - right);
  const selectedFallbackWidth = fallbackWidth || uniqueWidths[Math.floor(uniqueWidths.length / 2)];

  return {
    src: getNetlifyImageUrl(src, selectedFallbackWidth, quality),
    srcSet: uniqueWidths.map((width) => `${getNetlifyImageUrl(src, width, quality)} ${width}w`).join(', '),
    sizes,
  };
}
