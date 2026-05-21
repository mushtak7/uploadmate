'use client';

import { motion } from 'framer-motion';
import type { ValidationResult } from '@/lib/image-processor';

interface Props {
  validation: ValidationResult | null;
  targetRules?: {
    minSizeKB?: number;
    maxSizeKB?: number;
    widthPx?: number;
    heightPx?: number;
    format?: string[];
  };
}

export default function ValidationChecklist({ validation, targetRules }: Props) {
  if (!validation) return null;

  const checks = [
    {
      label: 'File Size',
      pass: validation.sizeValid,
      detail: validation.sizeValid
        ? `${validation.currentSizeKB}KB ✓`
        : `${validation.currentSizeKB}KB (need ${targetRules?.minSizeKB || '?'}-${targetRules?.maxSizeKB || '?'}KB)`,
    },
    {
      label: 'Dimensions',
      pass: validation.dimensionsValid,
      detail: validation.dimensionsValid
        ? `${validation.currentWidth}×${validation.currentHeight}px ✓`
        : `${validation.currentWidth}×${validation.currentHeight}px (need ${targetRules?.widthPx || '?'}×${targetRules?.heightPx || '?'}px)`,
    },
    {
      label: 'Format',
      pass: validation.formatValid,
      detail: validation.formatValid
        ? 'Compatible ✓'
        : `Needs ${targetRules?.format?.join(', ') || 'supported format'}`,
    },
  ];

  const allPassed = checks.every((c) => c.pass);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Validation</h3>
        {allPassed ? (
          <span className="badge badge-success text-[0.65rem]">All Checks Passed</span>
        ) : (
          <span className="badge badge-warning text-[0.65rem]">Issues Found</span>
        )}
      </div>

      {checks.map((check, i) => (
        <motion.div
          key={check.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`check-item ${check.pass ? 'pass' : 'fail'}`}
        >
          {check.pass ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{check.label}</p>
            <p className="text-xs opacity-75">{check.detail}</p>
          </div>
        </motion.div>
      ))}

      {validation.errors.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-[var(--error-bg)] border border-[rgba(248,113,113,0.2)]">
          {validation.errors.map((err, i) => (
            <p key={i} className="text-xs text-[var(--error)]">⚠ {err}</p>
          ))}
        </div>
      )}

      {validation.warnings && validation.warnings.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-[var(--warning-bg)] border border-[rgba(251,191,36,0.2)]">
          {validation.warnings.map((warn, i) => (
            <p key={i} className="text-xs text-[var(--warning)]">⚠ {warn}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
