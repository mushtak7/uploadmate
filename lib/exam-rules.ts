import examData from '@/data/exam-rules.json';

export interface PhotoRules {
  minSizeKB: number;
  maxSizeKB: number;
  widthPx: number;
  heightPx: number;
  aspectRatio: string;
  format: string[];
  dpi: number;
  background: string;
  notes: string;
}

export interface SignatureRules {
  minSizeKB: number;
  maxSizeKB: number;
  widthPx: number;
  heightPx: number;
  format: string[];
  background: string;
  notes: string;
}

export interface ExamRule {
  id: string;
  name: string;
  category: string;
  icon: string;
  popular: boolean;
  photo: PhotoRules;
  signature: SignatureRules | null;
  officialLink: string;
}

export interface ExamCategory {
  id: string;
  name: string;
  icon: string;
}

export function getAllExams(): ExamRule[] {
  return examData.exams as ExamRule[];
}

export function getPopularExams(): ExamRule[] {
  return examData.exams.filter((e) => e.popular) as ExamRule[];
}

export function getExamById(id: string): ExamRule | undefined {
  return examData.exams.find((e) => e.id === id) as ExamRule | undefined;
}

export function getExamsByCategory(category: string): ExamRule[] {
  return examData.exams.filter((e) => e.category === category) as ExamRule[];
}

export function getAllCategories(): ExamCategory[] {
  return examData.categories;
}

export function searchExams(query: string): ExamRule[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllExams();
  return examData.exams.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
  ) as ExamRule[];
}
