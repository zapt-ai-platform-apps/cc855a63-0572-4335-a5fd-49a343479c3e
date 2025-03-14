import React from 'react';
import { FaChrome, FaFirefox, FaEdge } from 'react-icons/fa';

const ExtensionInstructions = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Browser Extension</h3>
      <p className="text-sm text-gray-600 mb-4">
        This is a web app version of the Comic Translator. Once installed as a browser extension, you can translate comics directly on any website.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <FaChrome className="text-xl text-blue-600 mt-1 mr-3" />
          <div>
            <h4 className="font-medium mb-1">Chrome / Brave</h4>
            <ol className="text-sm text-gray-600 list-decimal ml-4 space-y-1">
              <li>Download the extension file</li>
              <li>Go to chrome://extensions/</li>
              <li>Enable "Developer mode"</li>
              <li>Drag and drop the file to install</li>
            </ol>
          </div>
        </div>
        
        <div className="flex items-start">
          <FaFirefox className="text-xl text-orange-500 mt-1 mr-3" />
          <div>
            <h4 className="font-medium mb-1">Firefox</h4>
            <ol className="text-sm text-gray-600 list-decimal ml-4 space-y-1">
              <li>Download the extension file</li>
              <li>Go to about:addons</li>
              <li>Click the gear icon and select "Install Add-on From File"</li>
              <li>Select the downloaded file</li>
            </ol>
          </div>
        </div>
        
        <div className="flex items-start">
          <FaEdge className="text-xl text-blue-500 mt-1 mr-3" />
          <div>
            <h4 className="font-medium mb-1">Edge</h4>
            <ol className="text-sm text-gray-600 list-decimal ml-4 space-y-1">
              <li>Download the extension file</li>
              <li>Go to edge://extensions/</li>
              <li>Enable "Developer mode"</li>
              <li>Drag and drop the file to install</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <p className="text-sm">
          <strong>Note:</strong> The extension is in development. When using in the wild, right-click on a comic image and select "Translate Comic" from the context menu.
        </p>
      </div>
    </div>
  );
};

export default ExtensionInstructions;