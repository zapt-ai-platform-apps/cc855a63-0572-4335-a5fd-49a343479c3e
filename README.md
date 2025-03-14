# Comic Translator

A browser extension that automatically translates text found in web comics using optical character recognition (OCR) and machine translation APIs.

## Features

- Automatically detects and extracts text from comic panels
- Translates text to multiple languages using various translation services
- Overlays translated text while preserving the comic's artistic style
- Customizable text appearance and display settings
- Support for multiple translation providers
- Export translated comics

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Build the extension with `npm run build`

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_PUBLIC_APP_ID=
VITE_PUBLIC_APP_ENV=
VITE_PUBLIC_SENTRY_DSN=
VITE_PUBLIC_UMAMI_WEBSITE_ID=
DEEPL_API_KEY=
GOOGLE_CLOUD_API_KEY=
```

## Browser Extension Installation

### Chrome / Brave / Edge

1. Build the extension using `npm run build`
2. Navigate to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

### Firefox

1. Build the extension using `npm run build`
2. Navigate to about:debugging#/runtime/this-firefox
3. Click "Load Temporary Add-on"
4. Select any file from the `dist` folder

## Technologies Used

- React for UI components
- Tesseract.js for OCR functionality
- Machine translation APIs (Google Translate, DeepL)
- Tailwind CSS for styling
- Browser extension APIs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.