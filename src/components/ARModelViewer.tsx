import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';
interface ARModelViewerProps {
  src: string;
  alt: string;
  className?: string;
}
export function ARModelViewer({ src, alt, className }: ARModelViewerProps) {
  const modelRef = useRef<HTMLElement>(null);
  return (
    <div className={`relative w-full aspect-square bg-muted/30 rounded-xl overflow-hidden ${className}`}>
      <model-viewer
        ref={modelRef as any}
        src={src}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
        >
          👋 View in AR
        </button>
      </model-viewer>
    </div>
  );
}