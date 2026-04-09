import React, { useEffect, useRef } from 'react';
import { Smartphone } from 'lucide-react';

interface ARModelViewerProps {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
}

export function ARModelViewer({ src, alt, poster, className }: ARModelViewerProps) {
  const modelRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || customElements.get('model-viewer')) return;

    const prevError = console.error.bind(console.error);
    const prevWarn = console.warn.bind(console.warn);

    console.error = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (
        msg.includes('Lit is in dev mode') ||
        msg.includes('scheduled an update') ||
        msg.includes('WebXR') ||
        msg.includes('ar-mode') ||
        msg.includes('Falling back')
      )) return;
      if (typeof msg === 'object' && msg && msg.response !== undefined) return;
      prevError(...args);
    };

    console.warn = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (
        msg.includes('Lit is in dev mode') ||
        msg.includes('scheduled an update') ||
        msg.includes('WebXR') ||
        msg.includes('ar-mode') ||
        msg.includes('Falling back')
      )) return;
      if (typeof msg === 'object' && msg && msg.response !== undefined) return;
      prevWarn(...args);
    };

    (window as any).litDisableDevMode = true;
    import('@google/model-viewer');

    return () => {
      console.error = prevError;
      console.warn = prevWarn;
    };
  }, []);

  React.useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const handleLoad = () => setIsLoaded(true);
    modelViewer.addEventListener('load', handleLoad);

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleLoad);
      }
    };
  }, [modelRef]);

  return (
    <div className={`relative w-full aspect-square bg-muted/30 rounded-2xl overflow-hidden border border-border/50 group ${className}`}>
      <model-viewer
        ref={modelRef as any}
        src={src}
        alt={alt}
        poster={poster}
        loading="lazy"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        interaction-prompt="auto"
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
        style={{ width: '100%', height: '100%', minHeight: '100%', backgroundColor: 'transparent' }}
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
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-b from-muted/80 to-transparent">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </model-viewer>
    </div>
  );
}
//