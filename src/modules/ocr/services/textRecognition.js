import { createWorker } from 'tesseract.js';
import { preprocessImage } from './imagePreprocessing';
import * as Sentry from '@sentry/browser';

/**
 * Recognizes text in an image using Tesseract OCR
 * 
 * @param {string} imageSource - URL or base64 of the image
 * @param {Object} options - OCR options
 * @param {Object} options.rectangle - Region of interest {x, y, width, height}
 * @param {string} options.language - OCR language
 * @param {Function} options.onProgress - Progress callback
 * @param {boolean} options.enhanceText - Whether to enhance text for better OCR
 * @param {number} options.confidenceThreshold - Minimum confidence threshold
 * @returns {Promise<Object>} - OCR result with text and bounding box
 */
export const recognizeText = async (imageSource, options = {}) => {
  const {
    rectangle = null,
    language = 'eng',
    onProgress = () => {},
    enhanceText = true,
    confidenceThreshold = 60
  } = options;
  
  try {
    console.log(`Setting up OCR with language: ${language}`);
    
    let processedImageSource = imageSource;
    
    // Preprocess image if enhanceText is true
    if (enhanceText) {
      console.log('Enhancing image for better text recognition');
      processedImageSource = await preprocessImage(imageSource);
    }
    
    // Create and initialize Tesseract worker
    const worker = await createWorker({
      logger: progress => {
        if (progress.status === 'recognizing text') {
          onProgress(progress.progress * 100);
        }
      }
    });
    
    await worker.loadLanguage(language);
    await worker.initialize(language);
    
    // Set recognition parameters
    await worker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?\'"-:;()[]{}',
    });
    
    // Recognize text in the specified rectangle or the entire image
    const result = rectangle
      ? await worker.recognize(processedImageSource, { rectangle })
      : await worker.recognize(processedImageSource);
    
    // Filter results by confidence if threshold is provided
    const filteredResult = {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      bbox: rectangle || {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        width: 0,
        height: 0
      }
    };
    
    // Extract proper bounding box if available
    if (result.data.words && result.data.words.length > 0) {
      // Get the bounding box that contains all words
      const words = result.data.words.filter(word => 
        word.confidence >= confidenceThreshold
      );
      
      if (words.length > 0) {
        const minX = Math.min(...words.map(w => w.bbox.x0));
        const minY = Math.min(...words.map(w => w.bbox.y0));
        const maxX = Math.max(...words.map(w => w.bbox.x1));
        const maxY = Math.max(...words.map(w => w.bbox.y1));
        
        filteredResult.bbox = {
          x: rectangle ? rectangle.x + minX : minX,
          y: rectangle ? rectangle.y + minY : minY,
          width: maxX - minX,
          height: maxY - minY,
          x0: minX,
          y0: minY,
          x1: maxX,
          y1: maxY
        };
      }
    }
    
    // Terminate worker to free resources
    await worker.terminate();
    
    return filteredResult;
  } catch (error) {
    console.error('OCR recognition error:', error);
    Sentry.captureException(error);
    throw new Error(`Text recognition failed: ${error.message}`);
  }
};