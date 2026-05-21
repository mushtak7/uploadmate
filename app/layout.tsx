import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'UploadMate — Smart Image Optimizer for Exam Forms & Applications',
    template: '%s | UploadMate',
  },
  description:
    'Resize, compress, and optimize images to exact KB sizes for UPSC, SSC, IBPS, JEE, NEET, and more. 100% free, client-side processing. No uploads to any server.',
  keywords: [
    'image resizer',
    'exact kb compressor',
    'passport photo resizer',
    'exam photo resize',
    'UPSC photo resize',
    'SSC photo resize',
    'signature resize',
    'image compressor',
    'resize image to 50kb',
    'resize image to 20kb',
  ],
  authors: [{ name: 'UploadMate' }],
  openGraph: {
    title: 'UploadMate — Smart Image Optimizer for Exam Forms',
    description:
      'Resize and compress images to exact KB for government exams. Free, private, instant.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Background mesh gradient */}
        <div className="gradient-mesh" aria-hidden="true" />

        <Navbar />

        <main className="flex-1 pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
