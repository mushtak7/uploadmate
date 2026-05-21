'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from '@/components/DropZone';
import ExamSelector from '@/components/ExamSelector';
import ValidationChecklist from '@/components/ValidationChecklist';
import { getExamById, getAllExams, type ExamRule } from '@/lib/exam-rules';
import {
  compressToExactKB,
  validateImage,
  getImageMeta,
  type ProcessingResult,
  type ValidationResult,
} from '@/lib/image-processor';

export default function ExamPhotoClient() {
  const searchParams = useSearchParams();
  // Load exam from URL param using lazy initializer
  const initialExam = useMemo(() => {
    const examId = searchParams.get('exam');
    if (examId) {
      return getExamById(examId) || null;
    }
    return null;
  }, [searchParams]);

  const [selectedExam, setSelectedExam] = useState<ExamRule | null>(initialExam);
  const [docType, setDocType] = useState<'photo' | 'signature'>('photo');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ sizeKB: number; width: number; height: number; extension: string } | null>(null);

  const [processing, setProcessing] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rules = selectedExam
    ? docType === 'photo'
      ? selectedExam.photo
      : selectedExam.signature
    : null;

  const handleFileSelect = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setValidation(null);
    const m = await getImageMeta(f);
    setPreview(m.dataUrl);
    setMeta({ sizeKB: m.sizeKB, width: m.width, height: m.height, extension: m.extension });

    // Auto-validate if exam is selected
    if (rules) {
      const v = await validateImage(f, {
        minSizeKB: rules.minSizeKB,
        maxSizeKB: rules.maxSizeKB,
        widthPx: rules.widthPx,
        heightPx: rules.heightPx,
        format: rules.format,
      });
      setValidation(v);
    }
  }, [rules]);

  const handleProcess = useCallback(async () => {
    if (!file || !rules) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    setIteration(0);

    try {
      const res = await compressToExactKB(
        file,
        {
          minSizeKB: rules.minSizeKB,
          maxSizeKB: rules.maxSizeKB,
          targetWidthPx: rules.widthPx,
          targetHeightPx: rules.heightPx,
          format: 'image/jpeg',
          maintainAspectRatio: false,
        },
        (iter) => setIteration(iter)
      );
      setResult(res);

      // Re-validate result
      const blob = res.blob;
      const resultFile = new File([blob], 'result.jpg', { type: 'image/jpeg' });
      const v = await validateImage(resultFile, {
        minSizeKB: rules.minSizeKB,
        maxSizeKB: rules.maxSizeKB,
        widthPx: rules.widthPx,
        heightPx: rules.heightPx,
        format: rules.format,
      });
      setValidation(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setProcessing(false);
    }
  }, [file, rules]);

  const handleDownload = useCallback(() => {
    if (!result || !selectedExam) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `${selectedExam.id}_${docType}_${result.sizeKB}kb.jpg`;
    a.click();
  }, [result, selectedExam, docType]);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setMeta(null);
    setResult(null);
    setValidation(null);
    setError(null);
  };

  const allExams = getAllExams();

  return (
    <div className="section-spacing pt-24 md:pt-28">
      <div className="mx-auto max-w-5xl px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="badge badge-accent mb-4 text-[0.7rem]">Smart Mode</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Exam Photo <span className="text-gradient">Tool</span>
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] max-w-xl mx-auto">
            Select your exam → upload your photo → download an upload-ready result that meets every requirement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Exam Selection & Rules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-5"
          >
            <div className="card p-5">
              <h2 className="text-sm font-semibold mb-3">1. Select Exam</h2>
              <ExamSelector onSelect={setSelectedExam} selected={selectedExam} />
            </div>

            {selectedExam && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedExam.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{selectedExam.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{selectedExam.category}</p>
                  </div>
                </div>

                {/* Doc type toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setDocType('photo')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      docType === 'photo'
                        ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-accent)]'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)]'
                    }`}
                  >
                    📸 Photo
                  </button>
                  {selectedExam.signature && (
                    <button
                      onClick={() => setDocType('signature')}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        docType === 'signature'
                          ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-accent)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)]'
                      }`}
                    >
                      ✍️ Signature
                    </button>
                  )}
                </div>

                {/* Requirements display */}
                {rules && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">File Size</span>
                      <span className="font-medium">{rules.minSizeKB}-{rules.maxSizeKB} KB</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">Dimensions</span>
                      <span className="font-medium">{rules.widthPx}×{rules.heightPx} px</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">Format</span>
                      <span className="font-medium uppercase">{rules.format.join(', ')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                      <span className="text-[var(--text-muted)]">Background</span>
                      <span className="font-medium capitalize">{rules.background}</span>
                    </div>
                    {rules.notes && (
                      <p className="text-[var(--text-muted)] mt-2 italic">{rules.notes}</p>
                    )}
                    <a
                      href={selectedExam.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[var(--accent-primary)] hover:underline"
                    >
                      Official website →
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* Validation */}
            {validation && (
              <div className="card p-5">
                <ValidationChecklist
                  validation={validation}
                  targetRules={rules ? {
                    minSizeKB: rules.minSizeKB,
                    maxSizeKB: rules.maxSizeKB,
                    widthPx: rules.widthPx,
                    heightPx: rules.heightPx,
                    format: rules.format,
                  } : undefined}
                />
              </div>
            )}
          </motion.div>

          {/* Right: Upload & Process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card p-6 md:p-8">
              {!selectedExam ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4">👈</span>
                  <h3 className="text-lg font-semibold mb-2">Select an exam first</h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
                    Choose your target exam from the left panel to load the exact image requirements.
                  </p>

                  {/* Quick exam grid */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                    {allExams.filter(e => e.popular).slice(0, 6).map(exam => (
                      <button
                        key={exam.id}
                        onClick={() => setSelectedExam(exam)}
                        className="card p-3 text-center hover:border-[var(--border-accent)] !transform-none"
                      >
                        <span className="text-xl block mb-1">{exam.icon}</span>
                        <p className="text-xs font-medium">{exam.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : !file ? (
                <div>
                  <h2 className="text-sm font-semibold mb-4">2. Upload Your {docType === 'photo' ? 'Photo' : 'Signature'}</h2>
                  <DropZone onFileSelect={handleFileSelect} />
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-sm font-semibold">3. Process & Download</h2>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-56 h-56 rounded-xl overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                      {(result?.dataUrl || preview) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={result ? result.dataUrl : preview!} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">No preview</div>
                      )}
                      {result && (
                        <div className="absolute top-2 right-2 badge badge-success text-[0.6rem]">Processed ✓</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold truncate max-w-[200px]">{file.name}</h3>
                        <button onClick={handleReset} className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]">Remove</button>
                      </div>
                      {meta && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <p className="text-xs text-[var(--text-muted)]">Original</p>
                            <p className="text-sm font-semibold">{meta.sizeKB}KB · {meta.width}×{meta.height}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <p className="text-xs text-[var(--text-muted)]">Required</p>
                            <p className="text-sm font-semibold">{rules?.minSizeKB}-{rules?.maxSizeKB}KB · {rules?.widthPx}×{rules?.heightPx}</p>
                          </div>
                        </div>
                      )}
                      {result && (
                        <div className="p-3 rounded-lg bg-[var(--success-bg)]">
                          <p className="text-xs text-[var(--text-muted)]">Result</p>
                          <p className="text-sm font-bold text-[var(--success)]">{result.sizeKB}KB · {result.width}×{result.height} · {result.iterations} iterations</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <AnimatePresence>
                    {processing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                        <div className="progress-bar">
                          <div className="progress-bar-fill striped" style={{ width: `${Math.min(iteration * 5, 95)}%` }} />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] text-center">Optimizing... Iteration {iteration}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="p-4 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)]">
                      <p className="text-sm text-[var(--error)]">⚠ {error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {!result ? (
                      <button onClick={handleProcess} disabled={processing} className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        {processing ? 'Processing...' : `Optimize for ${selectedExam.name}`}
                      </button>
                    ) : (
                      <>
                        <button onClick={handleDownload} className="btn-primary flex-1 py-3">
                          Download Upload-Ready {docType === 'photo' ? 'Photo' : 'Signature'}
                        </button>
                        <button onClick={handleProcess} className="btn-secondary py-3 px-6">Re-process</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
