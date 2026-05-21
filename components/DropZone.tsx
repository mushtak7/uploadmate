'use client';

import { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  compact?: boolean;
}

export default function DropZone({
  onFileSelect,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 10,
  compact = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, or WebP)');
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB`);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, maxSizeMB]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      className={`drop-zone ${isDragging ? 'drag-over' : ''} ${compact ? 'py-8 px-6' : 'py-16 px-8'}`}
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
        id="dropzone-input"
      />

      <div className="flex flex-col items-center gap-4 text-center">
        {/* Upload Icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-[var(--accent-glow)] flex items-center justify-center"
          animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </motion.div>

        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">
            {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            or{' '}
            <span className="text-[var(--accent-primary)] font-medium cursor-pointer hover:underline">
              click to browse
            </span>{' '}
            · JPG, PNG, WebP · Max {maxSizeMB}MB
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[var(--error)] font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
