/**
 * UploadMate — Exact KB Binary Search Compressor
 * Client-side image processing engine using Canvas API.
 * Uses iterative binary search to hit exact file-size targets.
 */

export interface CompressionTarget {
  minSizeKB: number;
  maxSizeKB: number;
  targetWidthPx?: number;
  targetHeightPx?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  maintainAspectRatio?: boolean;
}

export interface ProcessingResult {
  blob: Blob;
  dataUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  format: string;
  quality: number;
  iterations: number;
}

export interface ValidationResult {
  sizeValid: boolean;
  dimensionsValid: boolean;
  formatValid: boolean;
  currentSizeKB: number;
  currentWidth: number;
  currentHeight: number;
  errors: string[];
  warnings: string[];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      format,
      quality
    );
  });
}

/**
 * Resize image on a canvas to target dimensions.
 */
function resizeOnCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas;
}

/**
 * Calculate target dimensions maintaining aspect ratio.
 */
function calcDimensions(
  origW: number,
  origH: number,
  targetW?: number,
  targetH?: number,
  maintainAR = true
): { width: number; height: number } {
  if (!targetW && !targetH) return { width: origW, height: origH };

  if (targetW && targetH && !maintainAR) {
    return { width: targetW, height: targetH };
  }

  if (targetW && targetH) {
    const scaleW = targetW / origW;
    const scaleH = targetH / origH;
    const scale = Math.min(scaleW, scaleH);
    return {
      width: Math.round(origW * scale),
      height: Math.round(origH * scale),
    };
  }

  if (targetW) {
    const scale = targetW / origW;
    return { width: targetW, height: Math.round(origH * scale) };
  }

  const scale = targetH! / origH;
  return { width: Math.round(origW * scale), height: targetH! };
}

/**
 * Exact KB Compressor — Binary search for the quality value
 * that produces an image within [minSizeKB, maxSizeKB].
 */
export async function compressToExactKB(
  file: File,
  target: CompressionTarget,
  onProgress?: (iteration: number, currentKB: number) => void
): Promise<ProcessingResult> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const format = target.format || 'image/jpeg';

  const dims = calcDimensions(
    img.naturalWidth,
    img.naturalHeight,
    target.targetWidthPx,
    target.targetHeightPx,
    target.maintainAspectRatio ?? true
  );

  const canvas = resizeOnCanvas(img, dims.width, dims.height);
  const minBytes = target.minSizeKB * 1024;
  const maxBytes = target.maxSizeKB * 1024;

  let lo = 0.01;
  let hi = 1.0;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let iterations = 0;
  const MAX_ITER = 20;

  while (iterations < MAX_ITER) {
    const mid = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, format, mid);
    iterations++;
    const sizeKB = blob.size / 1024;

    onProgress?.(iterations, parseFloat(sizeKB.toFixed(1)));

    if (blob.size >= minBytes && blob.size <= maxBytes) {
      bestBlob = blob;
      bestQuality = mid;
      break;
    }

    if (blob.size < minBytes) {
      lo = mid;
    } else {
      hi = mid;
    }

    bestBlob = blob;
    bestQuality = mid;

    if (hi - lo < 0.005) break;
  }

  let finalWidth = dims.width;
  let finalHeight = dims.height;

  // If still not in range, try scale-down approach
  if (bestBlob && (bestBlob.size < minBytes || bestBlob.size > maxBytes)) {
    let scale = 1.0;
    for (let i = 0; i < 5; i++) {
      if (bestBlob.size > maxBytes) {
        scale *= 0.9;
      } else {
        break;
      }
      const newW = Math.round(dims.width * scale);
      const newH = Math.round(dims.height * scale);
      const newCanvas = resizeOnCanvas(img, newW, newH);
      bestBlob = await canvasToBlob(newCanvas, format, bestQuality);
      finalWidth = newW;
      finalHeight = newH;
      iterations++;
      onProgress?.(iterations, parseFloat((bestBlob.size / 1024).toFixed(1)));
      if (bestBlob.size >= minBytes && bestBlob.size <= maxBytes) break;
    }
  }

  if (!bestBlob) {
    throw new Error('Compression failed');
  }

  const finalUrl = URL.createObjectURL(bestBlob);

  return {
    blob: bestBlob,
    dataUrl: finalUrl,
    sizeKB: parseFloat((bestBlob.size / 1024).toFixed(2)),
    width: finalWidth,
    height: finalHeight,
    format,
    quality: bestQuality,
    iterations,
  };
}

/**
 * Simple resize without compression target.
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: string = 'image/jpeg',
  quality: number = 0.92,
  maintainAR: boolean = true
): Promise<ProcessingResult> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  const dims = calcDimensions(
    img.naturalWidth,
    img.naturalHeight,
    targetWidth,
    targetHeight,
    maintainAR
  );

  const canvas = resizeOnCanvas(img, dims.width, dims.height);
  const blob = await canvasToBlob(canvas, format, quality);
  const url = URL.createObjectURL(blob);

  return {
    blob,
    dataUrl: url,
    sizeKB: parseFloat((blob.size / 1024).toFixed(2)),
    width: dims.width,
    height: dims.height,
    format,
    quality,
    iterations: 1,
  };
}

/**
 * Validate an image file against exam rules.
 */
export async function validateImage(
  file: File,
  rules: {
    minSizeKB?: number;
    maxSizeKB?: number;
    widthPx?: number;
    heightPx?: number;
    format?: string[];
  }
): Promise<ValidationResult> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const errors: string[] = [];
  const warnings: string[] = [];

  const sizeKB = file.size / 1024;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  let sizeValid = true;
  if (rules.minSizeKB && sizeKB < rules.minSizeKB) {
    sizeValid = false;
    errors.push(`File too small: ${sizeKB.toFixed(1)}KB (min: ${rules.minSizeKB}KB)`);
  }
  if (rules.maxSizeKB && sizeKB > rules.maxSizeKB) {
    sizeValid = false;
    errors.push(`File too large: ${sizeKB.toFixed(1)}KB (max: ${rules.maxSizeKB}KB)`);
  }

  let dimensionsValid = true;
  if (rules.widthPx && img.naturalWidth !== rules.widthPx) {
    dimensionsValid = false;
    warnings.push(`Width: ${img.naturalWidth}px (required: ${rules.widthPx}px)`);
  }
  if (rules.heightPx && img.naturalHeight !== rules.heightPx) {
    dimensionsValid = false;
    warnings.push(`Height: ${img.naturalHeight}px (required: ${rules.heightPx}px)`);
  }

  let formatValid = true;
  if (rules.format && rules.format.length > 0) {
    if (!rules.format.includes(ext)) {
      formatValid = false;
      errors.push(`Format .${ext} not allowed. Required: ${rules.format.join(', ')}`);
    }
  }

  return {
    sizeValid,
    dimensionsValid,
    formatValid,
    currentSizeKB: parseFloat(sizeKB.toFixed(2)),
    currentWidth: img.naturalWidth,
    currentHeight: img.naturalHeight,
    errors,
    warnings,
  };
}

/**
 * Get file metadata quickly.
 */
export async function getImageMeta(file: File) {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  return {
    name: file.name,
    sizeKB: parseFloat((file.size / 1024).toFixed(2)),
    sizeMB: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
    width: img.naturalWidth,
    height: img.naturalHeight,
    type: file.type,
    extension: file.name.split('.').pop()?.toLowerCase() || '',
    lastModified: new Date(file.lastModified),
    dataUrl,
  };
}
