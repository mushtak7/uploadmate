'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllExams, getPopularExams, searchExams, type ExamRule } from '@/lib/exam-rules';

interface ExamSelectorProps {
  onSelect: (exam: ExamRule | null) => void;
  selected?: ExamRule | null;
  compact?: boolean;
}

export default function ExamSelector({ onSelect, selected, compact = false }: ExamSelectorProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const popularExams = useMemo(() => getPopularExams(), []);
  const filteredExams = useMemo(() => (query ? searchExams(query) : getAllExams()), [query]);

  const handleSelect = (exam: ExamRule) => {
    onSelect(exam);
    setIsOpen(false);
    setQuery('');
  };

  if (compact && selected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent-glow)] border border-[var(--border-accent)]">
          <span className="text-lg">{selected.icon}</span>
          <span className="text-sm font-semibold text-[var(--accent-primary)]">{selected.name}</span>
        </div>
        <button
          onClick={() => { onSelect(null); setIsOpen(true); }}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search exams... (UPSC, SSC, JEE, NEET...)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-40 glass rounded-xl overflow-hidden shadow-lg max-h-80 overflow-y-auto"
          >
            {/* Popular Section */}
            {!query && (
              <div className="px-4 pt-3 pb-2">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Popular Exams
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {popularExams.slice(0, 6).map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => handleSelect(exam)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent-primary)] hover:border-[var(--border-accent)] border border-transparent transition-all"
                    >
                      <span>{exam.icon}</span>
                      {exam.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[var(--border)] mt-1">
              {filteredExams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleSelect(exam)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                    selected?.id === exam.id ? 'bg-[var(--accent-glow)]' : ''
                  }`}
                >
                  <span className="text-xl">{exam.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {exam.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {exam.category} · Photo: {exam.photo.minSizeKB}-{exam.photo.maxSizeKB}KB · {exam.photo.widthPx}×{exam.photo.heightPx}px
                    </p>
                  </div>
                  {selected?.id === exam.id && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              {filteredExams.length === 0 && (
                <p className="px-4 py-6 text-sm text-[var(--text-muted)] text-center">
                  No exams found for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>

            {/* Close overlay */}
            <div
              className="fixed inset-0 -z-10"
              onClick={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
