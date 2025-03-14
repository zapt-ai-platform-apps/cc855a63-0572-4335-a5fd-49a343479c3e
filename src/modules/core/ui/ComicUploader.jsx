import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ComicUploader = ({ onImageSelected }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsLoading(true);
    
    // Process image file
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        onImageSelected({
          source: reader.result,
          width: img.width,
          height: img.height,
          file: file
        });
        setIsLoading(false);
      };
      img.onerror = () => {
        toast.error('Failed to load image');
        setIsLoading(false);
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="card h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Upload Comic Panel</h2>
      
      <div 
        {...getRootProps()} 
        className={`flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="text-center">
            <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600">Loading image...</p>
          </div>
        ) : (
          <>
            <FaUpload className="text-4xl text-gray-400 mb-4" />
            <p className="text-lg text-center mb-2">
              {isDragActive ? "Drop the image here" : "Drag & drop a comic panel here"}
            </p>
            <p className="text-sm text-gray-500 text-center mb-4">
              or click to select a file
            </p>
            <p className="text-xs text-gray-400 text-center w-4/5">
              Supports JPG, PNG, GIF, and WebP images. For best results, use clear images where the text is readable.
            </p>
          </>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          After uploading, the system will automatically detect and extract text for translation.
        </p>
      </div>
    </div>
  );
};

export default ComicUploader;