'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from '@/components/DropZone';
import {
  compressToExactKB,
  getImageMeta,
  type ProcessingResult,
} from '@/lib/image-processor';

const presets = [
  { label: '10-20 KB', min: 10, max: 20 },
  { label: '20-50 KB', min: 20, max: 50 },
  { label: '50-100 KB', min: 50, max: 100 },
  { label: '100-200 KB', min: 100, max: 200 },
  { label: '200-300 KB', min: 200, max: 300 },
];

export default function ExactKBClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    sizeKB: number;
    width: number;
    height: number;
    extension: string;
  } | null>(null);

  const [minKB, setMinKB] = useState(20);
  const [maxKB, setMaxKB] = useState(50);
  const [targetW, setTargetW] = useState<string>('');
  const [targetH, setTargetH] = useState<string>('');

  const [processing, setProcessing] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [currentKB, setCurrentKB] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const m = await getImageMeta(f);
    setPreview(m.dataUrl);
    setMeta({ sizeKB: m.sizeKB, width: m.width, height: m.height, extension: m.extension });
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    setIteration(0);
    setCurrentKB(0);

    try {
      const res = await compressToExactKB(file, {
        minSizeKB: minKB,
        maxSizeKB: maxKB,
        targetWidthPx: targetW ? parseInt(targetW) : undefined,
        targetHeightPx: targetH ? parseInt(targetH) : undefined,
        format: 'image/jpeg',
        maintainAspectRatio: true,
      }, (iter, kb) => {
        setIteration(iter);
        setCurrentKB(kb);
      });

      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
    } finally {
      setProcessing(false);
    }
  }, [file, minKB, maxKB, targetW, targetH]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    const name = file?.name?.replace(/\.[^.]+$/, '') || 'uploadmate';
    a.download = `${name}_${result.sizeKB}kb.jpg`;
    a.click();
  }, [result, file]);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setMeta(null);
    setResult(null);
    setError(null);
    setIteration(0);
    setCurrentKB(0);
  };

  const inRange = result ? result.sizeKB >= minKB && result.sizeKB <= maxKB : false;

  return (
    <div className="section-spacing pt-24 md:pt-28">
      <div className="mx-auto max-w-4xl px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="badge badge-accent mb-4 text-[0.7rem]">Flagship Tool</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Exact KB <span className="text-gradient">Compressor</span>
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] max-w-lg mx-auto">
            Compress your image to land precisely within a target file size range.
            Uses iterative binary search for guaranteed accuracy.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 md:p-8"
        >
          {!file ? (
            <DropZone onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              {/* Image Preview + Meta */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                  {(result?.dataUrl || preview) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result ? result.dataUrl : preview!}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">No preview</div>
                  )}
                  {result && inRange && (
                    <div className="absolute top-2 right-2 badge badge-success text-[0.6rem]">✓ In Range</div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-xs">{file.name}</h3>
                    <button onClick={handleReset} className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
                      Remove
                    </button>
                  </div>

                  {meta && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Original Size</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{meta.sizeKB} KB</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Dimensions</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{meta.width}×{meta.height}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Format</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)] uppercase">{meta.extension}</p>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 rounded-lg ${inRange ? 'bg-[var(--success-bg)]' : 'bg-[var(--warning-bg)]'}`}>
                        <p className="text-xs text-[var(--text-muted)]">Result Size</p>
                        <p className={`text-sm font-bold ${inRange ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>{result.sizeKB} KB</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Result Dims</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{result.width}×{result.height}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Iterations</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{result.iterations}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="border-t border-[var(--border)] pt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Target Size Range</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setMinKB(p.min); setMaxKB(p.max); }}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                          minKB === p.min && maxKB === p.max
                            ? 'bg-[var(--accent-glow)] border-[var(--border-accent)] text-[var(--accent-primary)]'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-[var(--text-muted)] mb-1 block">Min KB</label>
                      <input
                        type="number"
                        value={minKB}
                        onChange={(e) => setMinKB(Number(e.target.value))}
                        min={1}
                        className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                    <span className="text-[var(--text-muted)] mt-5">—</span>
                    <div className="flex-1">
                      <label className="text-xs text-[var(--text-muted)] mb-1 block">Max KB</label>
                      <input
                        type="number"
                        value={maxKB}
                        onChange={(e) => setMaxKB(Number(e.target.value))}
                        min={1}
                        className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Target Dimensions <span className="text-xs font-normal text-[var(--text-muted)]">(optional)</span></label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={targetW}
                        onChange={(e) => setTargetW(e.target.value)}
                        placeholder="Width px"
                        className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                    <span className="text-[var(--text-muted)]">×</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={targetH}
                        onChange={(e) => setTargetH(e.target.value)}
                        placeholder="Height px"
                        className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <AnimatePresence>
                {processing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill striped"
                        style={{ width: `${Math.min(iteration * 5, 95)}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] text-center">
                      Iteration {iteration} · Current: {currentKB} KB · Target: {minKB}-{maxKB} KB
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)]"
                >
                  <p className="text-sm text-[var(--error)]">⚠ {error}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!result ? (
                  <button
                    onClick={handleCompress}
                    disabled={processing}
                    className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Compressing...
                      </>
                    ) : (
                      <>Compress to {minKB}-{maxKB} KB</>
                    )}
                  </button>
                ) : (
                  <>
                    <button onClick={handleDownload} className="btn-primary flex-1 py-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download ({result.sizeKB} KB)
                    </button>
                    <button onClick={handleCompress} className="btn-secondary py-3 px-6">
                      Re-compress
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
