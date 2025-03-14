import React from 'react';
import { FaCog } from 'react-icons/fa';

const AppHeader = ({ onToggleSettings }) => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=48&height=48" 
          alt="Comic Translator Logo" 
          className="w-10 h-10 mr-3"
        />
        <div>
          <h1 className="text-2xl font-bold">Comic Translator</h1>
          <p className="text-sm text-gray-600">Translate web comics with OCR and machine translation</p>
        </div>
      </div>
      <button 
        onClick={onToggleSettings}
        className="btn btn-secondary flex items-center"
      >
        <FaCog className="mr-2" />
        Settings
      </button>
    </header>
  );
};

export default AppHeader;