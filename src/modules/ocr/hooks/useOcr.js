import { useState, useCallback } from 'react';
import { recognizeText } from '../services/textRecognition';
import { useSettings } from '@/modules/settings/hooks/useSettings';
import { eventBus, events } from '@/modules/core/events';
import * as Sentry from '@sentry/browser';

export const useOcr = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { settings } = useSettings();

  const performOcr = useCallback(async (imageSource, region = null) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      eventBus.publish(events.OCR_STARTED, { imageSource, region });
      console.log('Starting OCR process...');
      
      const result = await recognizeText(imageSource, {
        rectangle: region,
        language: settings.ocrLanguage,
        onProgress: (p) => setProgress(p),
        enhanceText: settings.enhanceTextRecognition,
        confidenceThreshold: settings.ocrConfidenceThreshold
      });
      
      console.log('OCR completed successfully:', result);
      eventBus.publish(events.OCR_COMPLETED, result);
      
      setIsProcessing(false);
      setProgress(100);
      
      return result;
    } catch (error) {
      console.error('OCR process failed:', error);
      Sentry.captureException(error);
      eventBus.publish(events.OCR_FAILED, { error });
      
      setIsProcessing(false);
      throw error;
    }
  }, [settings]);

  return {
    performOcr,
    isProcessing,
    progress
  };
};