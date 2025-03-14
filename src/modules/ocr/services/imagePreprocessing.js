/**
 * Preprocesses an image to enhance text recognition
 * 
 * @param {string} imageSource - URL or base64 of the image
 * @returns {Promise<string>} - Processed image as base64
 */
export const preprocessImage = async (imageSource) => {
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
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply preprocessing enhancements
        // 1. Convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          // RGB to grayscale conversion using luminance formula
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          
          // Increase contrast
          const contrast = 1.5; // Contrast factor (1.0 = no change)
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const newValue = factor * (gray - 128) + 128;
          
          // Apply thresholding for better text/background separation
          const threshold = 150;
          const finalValue = newValue > threshold ? 255 : 0;
          
          // Set RGB values to the processed value
          data[i] = finalValue;     // R
          data[i + 1] = finalValue; // G
          data[i + 2] = finalValue; // B
          // Alpha remains unchanged
        }
        
        // Put processed image data back to canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Return processed image as base64
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = (error) => {
        reject(new Error(`Failed to load image for preprocessing: ${error.message}`));
      };
      
      img.src = imageSource;
    } catch (error) {
      reject(new Error(`Image preprocessing failed: ${error.message}`));
    }
  });
};