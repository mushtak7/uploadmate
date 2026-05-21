'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPopularExams } from '@/lib/exam-rules';

const tools = [
  {
    href: '/tools/exact-kb-compressor',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Exact KB Compressor',
    desc: 'Compress images to an exact file size range. Hit 20KB, 50KB, 100KB — precisely.',
    badge: 'Most Popular',
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    href: '/tools/image-resizer',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
    title: 'Image Resizer',
    desc: 'Resize to exact pixel dimensions. Perfect for form uploads with strict requirements.',
    badge: null,
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    href: '/tools/exam-photo',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Exam Photo Tool',
    desc: 'Auto-optimize for UPSC, SSC, IBPS, JEE, NEET — one click, upload-ready.',
    badge: 'Smart Mode',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
];

const stats = [
  { value: '100%', label: 'Client-Side' },
  { value: '0', label: 'Server Uploads' },
  { value: '14+', label: 'Exams Supported' },
  { value: '<2s', label: 'Processing Time' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function HomePage() {
  const popularExams = getPopularExams().slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* ======= HERO ======= */}
      <section className="relative section-spacing pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-5xl text-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-accent mb-6 text-[0.7rem]">
              🔒 100% Private — Your images never leave your device
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Stop Guessing.{' '}
            <span className="text-gradient">Upload Ready</span>
            <br />
            in Seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Compress images to <strong className="text-[var(--text-primary)]">exact KB sizes</strong>, resize to
            precise dimensions, and auto-optimize for{' '}
            <strong className="text-[var(--text-primary)]">UPSC, SSC, IBPS, JEE, NEET</strong> — all inside your
            browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/tools/exact-kb-compressor" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Start Compressing — Free
            </Link>
            <Link href="/tools/exam-photo" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Exam Photo Tool →
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-[var(--accent-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======= TOOLS GRID ======= */}
      <section className="section-spacing bg-[var(--bg-secondary)]/50">
        <div className="mx-auto max-w-6xl px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold tracking-tight">
              Precision Tools for{' '}
              <span className="text-gradient">Every Upload</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              No more trial-and-error. Each tool is engineered to meet exact government and exam form requirements.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Link href={tool.href} className="block card card-glow p-7 h-full group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-[var(--accent-primary)] mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{tool.title}</h3>
                    {tool.badge && (
                      <span className="badge badge-accent text-[0.6rem] !py-0.5">{tool.badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tool.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Open Tool
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section id="how-it-works" className="section-spacing">
        <div className="mx-auto max-w-5xl px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold tracking-tight">
              How It <span className="text-gradient">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-[var(--text-secondary)] max-w-lg mx-auto">
              Three steps. No accounts. No uploads to any server.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Your Exam', desc: 'Choose your target exam or set custom requirements. We auto-load the exact specs.' },
              { step: '02', title: 'Upload Your Image', desc: 'Drag & drop or click to upload. Your image stays on your device — always.' },
              { step: '03', title: 'Download Upload-Ready', desc: 'We compress and resize with precision. Download the guaranteed-valid result.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="text-center md:text-left"
              >
                <span className="text-5xl font-black text-[var(--accent-primary)] opacity-20">{item.step}</span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SUPPORTED EXAMS ======= */}
      <section className="section-spacing bg-[var(--bg-secondary)]/50">
        <div className="mx-auto max-w-5xl px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold tracking-tight">
              Supported <span className="text-gradient">Exams & Forms</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-[var(--text-secondary)] max-w-lg mx-auto">
              Pre-loaded requirements for India&apos;s most popular exams and applications.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {popularExams.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link
                  href={`/tools/exam-photo?exam=${exam.id}`}
                  className="card p-5 text-center group block"
                >
                  <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{exam.icon}</span>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{exam.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{exam.photo.minSizeKB}-{exam.photo.maxSizeKB}KB</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tools/exam-photo" className="text-sm text-[var(--accent-primary)] font-medium hover:underline">
              View all supported exams →
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FAQ ======= */}
      <section className="section-spacing">
        <div className="mx-auto max-w-3xl px-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: 'Is my image uploaded to any server?',
                a: 'No. All processing happens entirely in your browser using client-side JavaScript. Your images never leave your device. We have zero servers storing your data.',
              },
              {
                q: 'How does the Exact KB Compressor work?',
                a: 'Our engine uses a binary search algorithm that iteratively adjusts JPEG quality and resolution to land the output file size precisely within your target range (e.g., 20KB-50KB). It typically converges in under 2 seconds.',
              },
              {
                q: 'Which exams are supported?',
                a: 'We support UPSC, SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, SBI PO, RRB NTPC, JEE Main, NEET UG, GATE, TCS NQT, CAT, Indian Passport, and Indian Visa — with more being added regularly.',
              },
              {
                q: 'Is it really free?',
                a: 'Yes, completely free with no hidden charges, no watermarks, and no sign-up required. Our tools are free forever for individual use.',
              },
              {
                q: 'What formats are supported?',
                a: 'We support JPG/JPEG, PNG, and WebP input formats. Output is typically JPEG for maximum compatibility with exam portals.',
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 cursor-pointer group"
              >
                <summary className="text-sm font-semibold text-[var(--text-primary)] list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-5 h-5 text-[var(--text-muted)] group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="section-spacing">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-10 md:p-14 animate-pulse-glow"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to Fix Your Upload?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              Join thousands of students who trust UploadMate for their exam form submissions.
            </p>
            <Link href="/tools/exact-kb-compressor" className="btn-primary text-base px-10 py-4">
              Start Now — It&apos;s Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is my image uploaded to any server?',
                acceptedAnswer: { '@type': 'Answer', text: 'No. All processing happens entirely in your browser. Your images never leave your device.' },
              },
              {
                '@type': 'Question',
                name: 'How does the Exact KB Compressor work?',
                acceptedAnswer: { '@type': 'Answer', text: 'Our engine uses a binary search algorithm that iteratively adjusts quality and resolution to hit the exact target file size.' },
              },
              {
                '@type': 'Question',
                name: 'Is it really free?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free with no hidden charges, watermarks, or sign-up required.' },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
