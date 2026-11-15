'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
  url: string;
  alt: string;
  blurDataUrl?: string;
}

interface LaptopGalleryProps {
  images: GalleryImage[];
  laptopName: string;
}

export default function LaptopGallery({ images, laptopName }: LaptopGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
  }, [images.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.children[activeIndex] as HTMLElement;
      thumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-zoom-in select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`Product image ${activeIndex + 1} of ${images.length}: ${currentImage?.alt}`}
        tabIndex={0}
      >
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            priority={activeIndex === 0}
            className={`object-contain transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
            style={
              isZoomed
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : {}
            }
            placeholder={currentImage.blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={currentImage.blurDataUrl}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Nav buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={goNext}
              disabled={activeIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 hidden md:flex">
          <ZoomIn className="w-3 h-3" />
          Hover to zoom
        </div>

        {/* Image counter */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === i
                  ? 'border-blue-700 dark:border-blue-400 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              } bg-gray-100 dark:bg-gray-800`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-contain"
                  sizes="64px"
                  placeholder={img.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={img.blurDataUrl}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
