import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaCheck, FaSpinner } from 'react-icons/fa';
import { useSettings } from '@/modules/settings/hooks/useSettings';
import { useTranslation } from '@/modules/translation/hooks/useTranslation';

const TextBubbleEditor = ({ region, onUpdate, onDelete, isTranslated }) => {
  const { settings } = useSettings();
  const { translateText, isTranslating } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(region.translatedText || region.originalText);
  const textareaRef = useRef(null);
  
  // Position the bubble div absolutely based on region dimensions
  const bubbleStyle = {
    position: 'absolute',
    left: `${region.bbox.x}px`,
    top: `${region.bbox.y}px`,
    width: `${region.bbox.width}px`,
    height: `${region.bbox.height}px`,
    padding: '8px',
    boxSizing: 'border-box',
    border: isEditing ? '2px dashed #3b82f6' : '1px solid transparent',
    borderRadius: `${settings.borderRadius}px`,
    backgroundColor: isTranslated
      ? `rgba(255, 255, 255, ${settings.overlayOpacity})`
      : 'transparent',
    overflow: 'hidden',
    zIndex: isEditing ? 100 : 10
  };
  
  // Style for the text inside the bubble
  const textStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    color: settings.textColor,
    margin: 0,
    padding: 0,
    wordBreak: 'break-word'
  };
  
  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
  // Handle saving edited text
  const handleSave = () => {
    onUpdate({ translatedText: editText, isEditing: false });
    setIsEditing(false);
  };
  
  // Handle translation request
  const handleTranslate = async () => {
    if (!region.originalText.trim()) return;
    
    try {
      onUpdate({ isProcessing: true });
      const translated = await translateText(region.originalText, settings.targetLanguage);
      onUpdate({ translatedText: translated, isProcessing: false });
    } catch (error) {
      console.error('Translation error:', error);
      onUpdate({ isProcessing: false });
    }
  };
  
  // Stop event propagation to prevent parent handlers
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div style={bubbleStyle} onClick={stopPropagation}>
      {isEditing ? (
        // Edit mode
        <div className="h-full">
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{
              ...textStyle,
              width: '100%',
              height: 'calc(100% - 30px)',
              border: 'none',
              resize: 'none',
              backgroundColor: 'transparent'
            }}
            className="focus:outline-none"
          />
          <div className="flex justify-end space-x-1 mt-1">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-1 rounded"
              title="Save changes"
            >
              <FaCheck size={12} />
            </button>
          </div>
        </div>
      ) : (
        // Display mode
        <div className="h-full relative">
          {/* Show translated text if available */}
          {isTranslated && region.translatedText && (
            <p style={textStyle}>
              {region.translatedText}
              
              {/* Show original text below if enabled */}
              {settings.showOriginalText && (
                <small style={{
                  display: 'block',
                  fontSize: '0.8em',
                  opacity: 0.7,
                  marginTop: '4px'
                }}>
                  ({region.originalText})
                </small>
              )}
            </p>
          )}
          
          {/* Show processing indicator */}
          {region.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
              <FaSpinner className="animate-spin text-white" />
            </div>
          )}
          
          {/* Control buttons */}
          <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 bg-black bg-opacity-50 rounded">
            <button
              onClick={() => setIsEditing(true)}
              className="text-white p-1"
              title="Edit text"
            >
              <FaEdit size={12} />
            </button>
            <button
              onClick={onDelete}
              className="text-white p-1"
              title="Delete text region"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBubbleEditor;