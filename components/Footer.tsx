import Link from 'next/link';

const footerLinks = {
  Tools: [
    { href: '/tools/exact-kb-compressor', label: 'Exact KB Compressor' },
    { href: '/tools/image-resizer', label: 'Image Resizer' },
    { href: '/tools/exam-photo', label: 'Exam Photo Tool' },
  ],
  'Popular Exams': [
    { href: '/tools/exam-photo?exam=upsc', label: 'UPSC Photo Resize' },
    { href: '/tools/exam-photo?exam=ssc-cgl', label: 'SSC CGL Photo' },
    { href: '/tools/exam-photo?exam=ibps-po', label: 'IBPS PO Photo' },
    { href: '/tools/exam-photo?exam=jee-main', label: 'JEE Main Photo' },
  ],
  Resources: [
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight">
                Upload<span className="text-[var(--accent-primary)]">Mate</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              The smart way to prepare images for exam forms, government applications, and official documents. 100% client-side processing.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="badge badge-success text-[0.65rem]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] inline-block" />
                Privacy First
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 tracking-wide uppercase">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} UploadMate. All rights reserved. No images are stored on our servers.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Made with precision for students & job seekers 🎯
          </p>
        </div>
      </div>
    </footer>
  );
}
