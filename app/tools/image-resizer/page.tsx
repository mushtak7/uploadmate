import type { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';

export const metadata: Metadata = {
  title: 'Image Resizer — Resize to Exact Pixel Dimensions',
  description:
    'Resize images to exact pixel dimensions for exam forms and official documents. Supports custom width/height, maintains aspect ratio. Free & private.',
};

export default function ImageResizerPage() {
  return <ImageResizerClient />;
}
