/**
 * Image Compressor Utility
 * Compresses images while maintaining readability of text
 * Uses Canvas API for client-side compression
 */

export interface CompressionOptions {
  maxWidth?: number;      // Max width in pixels (default: 1920)
  maxHeight?: number;     // Max height in pixels (default: 1920)
  quality?: number;       // Quality 0-1 (default: 0.85 for good text readability)
  outputType?: 'webp' | 'jpeg'; // Output format (default: webp)
}

export interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

const defaultOptions: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85, // 85% quality - good balance for text readability
  outputType: 'webp',
};

/**
 * Load an image from a File object
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  // If image is smaller than max dimensions, keep original size
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    // Landscape
    const newWidth = Math.min(width, maxWidth);
    const newHeight = Math.round(newWidth / aspectRatio);
    
    if (newHeight > maxHeight) {
      return {
        width: Math.round(maxHeight * aspectRatio),
        height: maxHeight,
      };
    }
    return { width: newWidth, height: newHeight };
  } else {
    // Portrait or square
    const newHeight = Math.min(height, maxHeight);
    const newWidth = Math.round(newHeight * aspectRatio);
    
    if (newWidth > maxWidth) {
      return {
        width: maxWidth,
        height: Math.round(maxWidth / aspectRatio),
      };
    }
    return { width: newWidth, height: newHeight };
  }
}

/**
 * Compress a single image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImage> {
  const opts = { ...defaultOptions, ...options };
  
  // Skip compression for small files (< 100KB) or non-image files
  if (file.size < 100 * 1024 || !file.type.startsWith('image/')) {
    return {
      blob: file,
      width: 0,
      height: 0,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
    };
  }

  const img = await loadImage(file);
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    opts.maxWidth,
    opts.maxHeight
  );

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Use better quality settings for text readability
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Clean up object URL
  URL.revokeObjectURL(img.src);

  // Convert to blob
  const mimeType = opts.outputType === 'webp' ? 'image/webp' : 'image/jpeg';
  
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      },
      mimeType,
      opts.quality
    );
  });

  // If compressed is larger than original, return original
  if (blob.size >= file.size) {
    return {
      blob: file,
      width: img.width,
      height: img.height,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
    };
  }

  return {
    blob,
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
    compressionRatio: file.size / blob.size,
  };
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressedImage[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}

/**
 * Convert compressed image to File object for upload
 */
export function compressedToFile(
  compressed: CompressedImage,
  originalFileName: string,
  outputType: 'webp' | 'jpeg' = 'webp'
): File {
  const extension = outputType === 'webp' ? '.webp' : '.jpg';
  const baseName = originalFileName.replace(/\.[^/.]+$/, '');
  const newFileName = `${baseName}${extension}`;
  
  return new File([compressed.blob], newFileName, {
    type: outputType === 'webp' ? 'image/webp' : 'image/jpeg',
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

