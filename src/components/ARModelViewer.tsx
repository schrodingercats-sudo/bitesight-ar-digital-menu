import React, { useEffect, useRef } from 'react';
import { Smartphone } from 'lucide-react';
interface ARModelViewerProps {
  src: string;
  alt: string;
  className?: string;
}
export function ARModelViewer({ src, alt, className }: ARModelViewerProps) {
  const modelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      (window as any).litDisableDevMode = true;
      import('@google/model-viewer');
    }
  }, []);
  return (
    <div className={`relative w-full aspect-square bg-muted/30 rounded-2xl overflow-hidden border border-border/50 group ${className}`}>
      <model-viewer
        ref={modelRef as any}
        src={src}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        interaction-prompt="auto"
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 z-10"
        >
          <Smartphone className="w-5 h-5" />
          View in AR
        </button>
        <div className="absolute top-4 right-4 hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-medium text-muted-foreground border border-border shadow-sm">
          <Smartphone className="w-3 h-3" />
          AR requires mobile
        </div>
      </model-viewer>
    </div>
  );
}