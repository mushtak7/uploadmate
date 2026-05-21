'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DropZone from '@/components/DropZone';
import { resizeImage, getImageMeta, type ProcessingResult } from '@/lib/image-processor';

const dimensionPresets = [
  { label: 'Passport (150×200)', w: 150, h: 200 },
  { label: 'Square (200×200)', w: 200, h: 200 },
  { label: 'SSC (100×120)', w: 100, h: 120 },
  { label: 'IBPS (200×230)', w: 200, h: 230 },
  { label: 'HD (1280×720)', w: 1280, h: 720 },
  { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
];

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ sizeKB: number; width: number; height: number; extension: string } | null>(null);
  const [targetW, setTargetW] = useState(200);
  const [targetH, setTargetH] = useState(200);
  const [maintainAR, setMaintainAR] = useState(true);
  const [quality, setQuality] = useState(92);
  const [processing, setProcessing] = useState(false);
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

  const handleResize = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const res = await resizeImage(file, targetW, targetH, 'image/jpeg', quality / 100, maintainAR);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resize failed');
    } finally {
      setProcessing(false);
    }
  }, [file, targetW, targetH, quality, maintainAR]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    const name = file?.name?.replace(/\.[^.]+$/, '') || 'uploadmate';
    a.download = `${name}_${result.width}x${result.height}.jpg`;
    a.click();
  }, [result, file]);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setMeta(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="section-spacing pt-24 md:pt-28">
      <div className="mx-auto max-w-4xl px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Image <span className="text-gradient">Resizer</span>
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] max-w-lg mx-auto">
            Resize images to exact pixel dimensions. Supports custom sizes, aspect ratio lock, and quality control.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 md:p-8">
          {!file ? (
            <DropZone onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                  {(result?.dataUrl || preview) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result ? result.dataUrl : preview!} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">No preview</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold truncate max-w-xs">{file.name}</h3>
                    <button onClick={handleReset} className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">Remove</button>
                  </div>
                  {meta && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Size</p>
                        <p className="text-sm font-semibold">{meta.sizeKB} KB</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Original</p>
                        <p className="text-sm font-semibold">{meta.width}×{meta.height}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Format</p>
                        <p className="text-sm font-semibold uppercase">{meta.extension}</p>
                      </div>
                    </div>
                  )}
                  {result && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-[var(--success-bg)]">
                        <p className="text-xs text-[var(--text-muted)]">New Size</p>
                        <p className="text-sm font-bold text-[var(--success)]">{result.sizeKB} KB</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--success-bg)]">
                        <p className="text-xs text-[var(--text-muted)]">New Dims</p>
                        <p className="text-sm font-bold text-[var(--success)]">{result.width}×{result.height}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                        <p className="text-xs text-[var(--text-muted)]">Quality</p>
                        <p className="text-sm font-semibold">{quality}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="border-t border-[var(--border)] pt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-3">Quick Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {dimensionPresets.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setTargetW(p.w); setTargetH(p.h); }}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          targetW === p.w && targetH === p.h
                            ? 'bg-[var(--accent-glow)] border-[var(--border-accent)] text-[var(--accent-primary)]'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Width (px)</label>
                    <input type="number" value={targetW} onChange={(e) => setTargetW(Number(e.target.value))} min={1}
                      className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent-primary)]" />
                  </div>
                  <span className="text-[var(--text-muted)] pb-2.5">×</span>
                  <div className="flex-1">
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Height (px)</label>
                    <input type="number" value={targetH} onChange={(e) => setTargetH(Number(e.target.value))} min={1}
                      className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent-primary)]" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1">
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Quality: {quality}%</label>
                    <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[var(--accent-primary)]" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={maintainAR} onChange={(e) => setMaintainAR(e.target.checked)}
                      className="w-4 h-4 rounded accent-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Maintain aspect ratio</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)]">
                  <p className="text-sm text-[var(--error)]">⚠ {error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!result ? (
                  <button onClick={handleResize} disabled={processing} className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? 'Resizing...' : `Resize to ${targetW}×${targetH}`}
                  </button>
                ) : (
                  <>
                    <button onClick={handleDownload} className="btn-primary flex-1 py-3">
                      Download ({result.width}×{result.height})
                    </button>
                    <button onClick={handleResize} className="btn-secondary py-3 px-6">Re-resize</button>
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
