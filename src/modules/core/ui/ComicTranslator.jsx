import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaUndo, FaMagic, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useOcr } from '@/modules/ocr/hooks/useOcr';
import { useTranslation } from '@/modules/translation/hooks/useTranslation';
import { useSettings } from '@/modules/settings/hooks/useSettings';
import TextBubbleEditor from '@/modules/overlay/ui/TextBubbleEditor';
import { detectTextBubbles } from '@/modules/ocr/services/bubbleDetection';
import * as Sentry from '@sentry/browser';

const ComicTranslator = ({ selectedImage, onClear }) => {
  const canvasRef = useRef(null);
  const [textRegions, setTextRegions] = useState([]);
  const [processingStage, setProcessingStage] = useState('idle');
  const [translatedImage, setTranslatedImage] = useState(null);
  const { performOcr } = useOcr();
  const { translateText } = useTranslation();
  const { settings } = useSettings();
  
  // Process the image when it's first loaded
  useEffect(() => {
    if (!selectedImage) return;
    
    const processImage = async () => {
      try {
        setProcessingStage('detecting');
        console.log('Starting text detection in comic panel...');
        
        // First try to detect bubbles automatically
        const detectedBubbles = await detectTextBubbles(selectedImage.source);
        
        // Then perform OCR on each bubble or the entire image if no bubbles detected
        let ocrResults = [];
        if (detectedBubbles.length > 0) {
          console.log(`Found ${detectedBubbles.length} text bubbles`);
          ocrResults = await Promise.all(
            detectedBubbles.map(bubble => 
              performOcr(selectedImage.source, bubble)
            )
          );
        } else {
          console.log('No text bubbles detected, scanning entire image');
          const fullResult = await performOcr(selectedImage.source);
          if (fullResult.text.trim()) {
            ocrResults = [fullResult];
          }
        }
        
        // Filter out empty results and prepare data
        const validRegions = ocrResults
          .filter(result => result.text.trim().length > 0)
          .map((result, index) => ({
            id: `region-${index}`,
            ...result,
            originalText: result.text,
            translatedText: '',
            isProcessing: false,
            isEditing: false
          }));
        
        if (validRegions.length === 0) {
          toast.info('No text was detected in this image. Try a clearer image or manually add text regions.');
          setProcessingStage('idle');
        } else {
          console.log(`Extracted ${validRegions.length} text regions`);
          setTextRegions(validRegions);
          setProcessingStage('extracted');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        Sentry.captureException(error);
        toast.error('Failed to process image: ' + error.message);
        setProcessingStage('idle');
      }
    };
    
    processImage();
  }, [selectedImage, performOcr]);
  
  // Handle translate all text
  const handleTranslateAll = async () => {
    if (textRegions.length === 0) return;
    
    setProcessingStage('translating');
    
    try {
      console.log(`Translating ${textRegions.length} text regions to ${settings.targetLanguage}`);
      
      // Create a copy of regions to update
      const updatedRegions = [...textRegions];
      
      // Translate each region
      for (let i = 0; i < updatedRegions.length; i++) {
        const region = updatedRegions[i];
        
        // Skip if empty or already translated
        if (!region.originalText.trim()) continue;
        
        // Mark as processing
        updatedRegions[i] = { ...region, isProcessing: true };
        setTextRegions(updatedRegions);
        
        // Translate
        const translated = await translateText(
          region.originalText,
          settings.targetLanguage
        );
        
        // Update with translation
        updatedRegions[i] = {
          ...region,
          translatedText: translated,
          isProcessing: false
        };
        setTextRegions(updatedRegions);
      }
      
      setProcessingStage('translated');
      toast.success(`Translation to ${settings.targetLanguage} complete!`);
    } catch (error) {
      console.error('Translation error:', error);
      Sentry.captureException(error);
      toast.error('Translation failed: ' + error.message);
      setProcessingStage('extracted');
    }
  };
  
  // Handle download translated image
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    try {
      const link = document.createElement('a');
      link.download = `translated-comic-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      Sentry.captureException(error);
      toast.error('Failed to download image: ' + error.message);
    }
  };
  
  // Update a single text region
  const updateTextRegion = (id, updates) => {
    setTextRegions(prev => 
      prev.map(region => 
        region.id === id ? { ...region, ...updates } : region
      )
    );
  };
  
  // Delete a text region
  const deleteTextRegion = (id) => {
    setTextRegions(prev => prev.filter(region => region.id !== id));
  };
  
  // Render loading state
  if (processingStage === 'detecting') {
    return (
      <div className="card h-96 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Detecting Text...</h3>
        <p className="text-gray-600">Analyzing image to find text regions</p>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comic Translator</h2>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="btn btn-secondary btn-sm flex items-center"
          >
            <FaUndo className="mr-1" /> New Image
          </button>
          
          {processingStage === 'extracted' && (
            <button
              onClick={handleTranslateAll}
              className="btn btn-primary btn-sm flex items-center"
              disabled={processingStage === 'translating'}
            >
              {processingStage === 'translating' ? (
                <>
                  <FaSpinner className="animate-spin mr-1" /> Translating...
                </>
              ) : (
                <>
                  <FaMagic className="mr-1" /> Translate All
                </>
              )}
            </button>
          )}
          
          {processingStage === 'translated' && (
            <button
              onClick={handleDownload}
              className="btn btn-primary btn-sm flex items-center"
            >
              <FaDownload className="mr-1" /> Download
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        {selectedImage && (
          <div className="relative border rounded-lg overflow-hidden">
            <img 
              src={selectedImage.source} 
              alt="Original comic" 
              className="max-w-full h-auto"
            />
            
            {textRegions.map(region => (
              <TextBubbleEditor
                key={region.id}
                region={region}
                onUpdate={(updates) => updateTextRegion(region.id, updates)}
                onDelete={() => deleteTextRegion(region.id)}
                isTranslated={processingStage === 'translated'}
              />
            ))}
            
            {/* Hidden canvas for exporting */}
            <canvas 
              ref={canvasRef} 
              width={selectedImage.width}
              height={selectedImage.height}
              className="hidden"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {textRegions.length === 0 ? (
            'No text regions detected. Try a clearer image or adjust OCR settings.'
          ) : (
            `${textRegions.length} text regions found. ${
              processingStage === 'translated' 
                ? 'Text has been translated. You can adjust the translations if needed.'
                : 'Click "Translate All" to translate detected text.'
            }`
          )}
        </p>
      </div>
    </div>
  );
};

export default ComicTranslator;