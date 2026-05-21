import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExamPhotoClient from './ExamPhotoClient';

export const metadata: Metadata = {
  title: 'Exam Photo Tool — Auto-Optimize for UPSC, SSC, IBPS, JEE, NEET',
  description:
    'Select your exam, upload your photo, and get an upload-ready result that meets exact requirements. Supports UPSC, SSC CGL, IBPS PO, JEE Main, NEET, and more.',
};

export default function ExamPhotoPage() {
  return (
    <Suspense fallback={
      <div className="section-spacing pt-24 text-center">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-[var(--accent-primary)] border-t-transparent" />
        <p className="mt-2 text-sm text-[var(--text-muted)]">Loading exam rules...</p>
      </div>
    }>
      <ExamPhotoClient />
    </Suspense>
  );
}
