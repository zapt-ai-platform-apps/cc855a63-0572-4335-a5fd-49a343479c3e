import React, { useState } from 'react';
import ComicUploader from '@/modules/core/ui/ComicUploader';
import ComicTranslator from '@/modules/core/ui/ComicTranslator';
import LanguageSelector from '@/modules/settings/ui/LanguageSelector';
import { SettingsProvider } from '@/modules/settings/context/SettingsContext';
import SettingsPanel from '@/modules/settings/ui/SettingsPanel';
import AppHeader from '@/modules/core/ui/AppHeader';
import { TranslationProvider } from '@/modules/translation/context/TranslationContext';
import ExtensionInstructions from '@/modules/core/ui/ExtensionInstructions';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsProvider>
        <TranslationProvider>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AppHeader onToggleSettings={() => setShowSettings(!showSettings)} />
            
            <main className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {selectedImage ? (
                    <ComicTranslator 
                      selectedImage={selectedImage} 
                      onClear={() => setSelectedImage(null)} 
                    />
                  ) : (
                    <ComicUploader onImageSelected={setSelectedImage} />
                  )}
                </div>
                
                <div className="md:col-span-1">
                  {showSettings ? (
                    <SettingsPanel />
                  ) : (
                    <div className="card">
                      <h2 className="text-xl font-semibold mb-4">Translation Options</h2>
                      <LanguageSelector />
                      <div className="mt-6">
                        <ExtensionInstructions />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </TranslationProvider>
      </SettingsProvider>
    </div>
  );
}