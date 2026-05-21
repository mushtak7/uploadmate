import type { Metadata } from 'next';
import ExactKBClient from './ExactKBClient';

export const metadata: Metadata = {
  title: 'Exact KB Image Compressor — Resize Image to Exact File Size',
  description:
    'Compress any image to an exact KB file size (20KB, 50KB, 100KB, 200KB). Perfect for UPSC, SSC, IBPS, JEE exam form uploads. Free, private, instant.',
  keywords: [
    'resize image to 50kb',
    'compress image to exact size',
    'image compressor exact kb',
    'reduce image size to 20kb',
    'compress photo for exam',
  ],
};

export default function ExactKBCompressorPage() {
  return <ExactKBClient />;
}
