import * as Sentry from '@sentry/browser';

/**
 * Detects text bubbles/balloons in comic panels
 * 
 * @param {string} imageSource - URL or base64 of the image
 * @returns {Promise<Array>} - Array of detected bubble regions {x, y, width, height}
 */
export const detectTextBubbles = async (imageSource) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        // Create canvas and context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Basic bubble detection based on light areas surrounded by dark borders
        // This is a simplified approach and may not work perfectly for all comics
        const brightAreas = detectBrightAreas(data, canvas.width, canvas.height);
        
        console.log(`Detected ${brightAreas.length} potential text bubbles`);
        resolve(brightAreas);
      };
      
      img.onerror = (error) => {
        Sentry.captureException(error);
        console.error('Failed to load image for bubble detection:', error);
        // Don't reject, just return empty array to continue with OCR on whole image
        resolve([]);
      };
      
      img.src = imageSource;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Bubble detection failed:', error);
      // Don't reject, just return empty array to continue with OCR on whole image
      resolve([]);
    }
  });
};

/**
 * Detects bright areas in image that might be text bubbles
 * 
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Array} - Array of detected bright areas
 */
function detectBrightAreas(data, width, height) {
  const brightAreas = [];
  const segmentSize = Math.min(width, height) / 6; // Divide image into segments
  
  // For simplicity, divide the image into a grid and check each cell for potential bubbles
  for (let y = 0; y < height; y += segmentSize) {
    for (let x = 0; x < width; x += segmentSize) {
      const segmentWidth = Math.min(segmentSize, width - x);
      const segmentHeight = Math.min(segmentSize, height - y);
      
      // Skip segments that are too small
      if (segmentWidth < 50 || segmentHeight < 30) continue;
      
      // Check if this segment has characteristics of a text bubble
      if (isBrightArea(data, x, y, segmentWidth, segmentHeight, width)) {
        brightAreas.push({
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(segmentWidth),
          height: Math.round(segmentHeight)
        });
      }
    }
  }
  
  // Merge overlapping regions
  return mergeOverlappingRegions(brightAreas);
}

/**
 * Checks if a region is likely to be a bright area with text
 * 
 * @param {Uint8ClampedArray} data - Image data
 * @param {number} startX - Region start X
 * @param {number} startY - Region start Y
 * @param {number} width - Region width
 * @param {number} height - Region height
 * @param {number} imageWidth - Full image width
 * @returns {boolean} - True if region is likely a text bubble
 */
function isBrightArea(data, startX, startY, width, height, imageWidth) {
  let brightPixels = 0;
  let darkPixels = 0;
  let totalPixels = 0;
  
  // Sample pixels in region (for efficiency, sample only some pixels)
  const sampleStep = 4;
  
  for (let y = startY; y < startY + height; y += sampleStep) {
    for (let x = startX; x < startX + width; x += sampleStep) {
      const index = (y * imageWidth + x) * 4;
      
      // Skip if out of bounds
      if (index >= data.length) continue;
      
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      // Calculate brightness (simple average)
      const brightness = (r + g + b) / 3;
      
      if (brightness > 200) brightPixels++;
      if (brightness < 100) darkPixels++;
      totalPixels++;
    }
  }
  
  // Calculate percentages
  const brightRatio = brightPixels / totalPixels;
  const darkRatio = darkPixels / totalPixels;
  
  // Text bubbles typically have high bright area percentage and some dark (text)
  return brightRatio > 0.6 && darkRatio > 0.05 && darkRatio < 0.4;
}

/**
 * Merges overlapping regions
 * 
 * @param {Array} regions - Array of regions {x, y, width, height}
 * @returns {Array} - Merged regions
 */
function mergeOverlappingRegions(regions) {
  if (regions.length <= 1) return regions;
  
  const merged = [...regions];
  let mergeHappened;
  
  do {
    mergeHappened = false;
    
    for (let i = 0; i < merged.length; i++) {
      for (let j = i + 1; j < merged.length; j++) {
        const region1 = merged[i];
        const region2 = merged[j];
        
        // Check if regions overlap
        if (regionsOverlap(region1, region2)) {
          // Merge regions
          merged[i] = mergeRegions(region1, region2);
          merged.splice(j, 1);
          mergeHappened = true;
          break;
        }
      }
      
      if (mergeHappened) break;
    }
  } while (mergeHappened);
  
  return merged;
}

/**
 * Checks if two regions overlap
 * 
 * @param {Object} r1 - First region
 * @param {Object} r2 - Second region
 * @returns {boolean} - True if regions overlap
 */
function regionsOverlap(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

/**
 * Merges two regions into one
 * 
 * @param {Object} r1 - First region
 * @param {Object} r2 - Second region
 * @returns {Object} - Merged region
 */
function mergeRegions(r1, r2) {
  const x = Math.min(r1.x, r2.x);
  const y = Math.min(r1.y, r2.y);
  const width = Math.max(r1.x + r1.width, r2.x + r2.width) - x;
  const height = Math.max(r1.y + r1.height, r2.y + r2.height) - y;
  
  return { x, y, width, height };
}