import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker, type Worker } from 'tesseract.js';
import { ScanPreview } from './ScanPreview';
import type { Reminder } from '../../lib/types';

interface BraceletScannerProps {
  onCreateReminder: (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onCancel: () => void;
}

type ScanStep = 'capture' | 'processing' | 'preview';

export function BraceletScanner({ onCreateReminder, onCancel }: BraceletScannerProps) {
  const [step, setStep] = useState<ScanStep>('capture');
  const [imageData, setImageData] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const processImage = useCallback(async (imageDataUrl: string) => {
    setStep('processing');
    setProgress(0);
    setError(null);

    try {
      // Create OCR worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      workerRef.current = worker;

      // Perform OCR
      const { data: { text } } = await worker.recognize(imageDataUrl);

      // Clean up worker
      await worker.terminate();
      workerRef.current = null;

      // Clean up the extracted text
      const cleanedText = text.trim();

      if (!cleanedText) {
        setError('No text detected. Try taking a clearer photo with good lighting.');
        setStep('capture');
        return;
      }

      setExtractedText(cleanedText);
      setStep('preview');
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process image. Please try again.');
      setStep('capture');
    }
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageData(dataUrl);
      processImage(dataUrl);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  }, [processImage]);

  const handleCameraCapture = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRetry = useCallback(() => {
    setImageData(null);
    setExtractedText('');
    setError(null);
    setStep('capture');
  }, []);

  const handleSave = useCallback((data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    onCreateReminder(data);
  }, [onCreateReminder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Scan Bracelet
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            {step === 'capture' && 'Take a photo of your bracelet notes'}
            {step === 'processing' && 'Reading your handwriting...'}
            {step === 'preview' && 'Review and save your reminder'}
          </p>
        </div>
      </motion.div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {/* Capture Step */}
        {step === 'capture' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Scan illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-700/10 to-yellow-500/10 rounded-3xl" />

              {/* Animated bracelet icon */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, -5, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-8xl mb-6 filter drop-shadow-lg"
              >
                <span className="inline-block">📸</span>
              </motion.div>

              <h3 className="relative text-xl font-bold text-white mb-2">
                Capture Your Notes
              </h3>
              <p className="relative text-gray-400 mb-8 max-w-sm mx-auto">
                Take a clear photo of the handwritten notes on your bracelet.
                Good lighting helps with accuracy!
              </p>

              {/* Tips */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">💡</div>
                  <div className="text-sm text-gray-300 font-medium">Good Lighting</div>
                  <div className="text-xs text-gray-500">Avoid shadows on the paper</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">✍️</div>
                  <div className="text-sm text-gray-300 font-medium">Clear Writing</div>
                  <div className="text-xs text-gray-500">Print-style works best</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="text-sm text-gray-300 font-medium">Flat & Straight</div>
                  <div className="text-xs text-gray-500">Keep paper flat and level</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCameraCapture}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 rounded-2xl font-bold text-lg shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFileUpload}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/15 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </motion.button>
              </div>
            </motion.div>

            {/* Cancel button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
              {/* Image preview */}
              {imageData && (
                <div className="mb-8 relative">
                  <img
                    src={imageData}
                    alt="Captured"
                    className="max-h-48 mx-auto rounded-xl border border-white/20 shadow-lg"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}

              {/* Processing animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full"
              />

              <h3 className="text-xl font-bold text-white mb-2">
                Reading Your Notes
              </h3>
              <p className="text-gray-400 mb-6">
                Using OCR to extract text from your image...
              </p>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview Step */}
        {step === 'preview' && imageData && (
          <ScanPreview
            imageData={imageData}
            extractedText={extractedText}
            onSave={handleSave}
            onRetry={handleRetry}
            onCancel={onCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
