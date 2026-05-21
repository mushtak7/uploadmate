import { create } from 'zustand';
import type { ExamRule } from './exam-rules';
import type { ProcessingResult, ValidationResult } from './image-processor';

interface UploadState {
  // File state
  file: File | null;
  preview: string | null;
  fileName: string;

  // Exam mode
  selectedExam: ExamRule | null;
  documentType: 'photo' | 'signature';

  // Processing
  isProcessing: boolean;
  progress: number;
  currentIteration: number;
  currentSizeKB: number;
  result: ProcessingResult | null;
  validation: ValidationResult | null;
  error: string | null;

  // Actions
  setFile: (file: File, preview: string) => void;
  clearFile: () => void;
  setExam: (exam: ExamRule | null) => void;
  setDocumentType: (type: 'photo' | 'signature') => void;
  setProcessing: (val: boolean) => void;
  setProgress: (iteration: number, sizeKB: number) => void;
  setResult: (result: ProcessingResult) => void;
  setValidation: (validation: ValidationResult) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  file: null,
  preview: null,
  fileName: '',
  selectedExam: null,
  documentType: 'photo' as const,
  isProcessing: false,
  progress: 0,
  currentIteration: 0,
  currentSizeKB: 0,
  result: null,
  validation: null,
  error: null,
};

export const useUploadStore = create<UploadState>((set) => ({
  ...initialState,

  setFile: (file, preview) =>
    set({ file, preview, fileName: file.name, result: null, error: null, validation: null }),

  clearFile: () =>
    set({ file: null, preview: null, fileName: '', result: null, error: null, validation: null, progress: 0 }),

  setExam: (exam) => set({ selectedExam: exam }),

  setDocumentType: (type) => set({ documentType: type }),

  setProcessing: (val) => set({ isProcessing: val, progress: val ? 0 : 100 }),

  setProgress: (iteration, sizeKB) =>
    set({ currentIteration: iteration, currentSizeKB: sizeKB, progress: Math.min(iteration * 5, 95) }),

  setResult: (result) => set({ result, isProcessing: false, progress: 100 }),

  setValidation: (validation) => set({ validation }),

  setError: (error) => set({ error, isProcessing: false }),

  reset: () => set(initialState),
}));
