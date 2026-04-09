import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, RefreshCw, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ARModelViewerProps {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
}
export function ARModelViewer({ src, alt, poster, className }: ARModelViewerProps) {
  const modelRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
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
        msg.includes('Falling back') ||
        msg.includes('three.js')
      )) return;
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
      prevWarn(...args);
    };
    (window as any).litDisableDevMode = true;
    import('@google/model-viewer');
    return () => {
      console.error = prevError;
      console.warn = prevWarn;
    };
  }, []);
  const handleReset = () => {
    if (modelRef.current) {
      modelRef.current.cameraTarget = "auto auto auto";
      modelRef.current.cameraOrbit = "0deg 75deg 105%";
    }
  };
  return (
    <div className={`relative w-full h-full bg-transparent overflow-hidden ${className}`}>
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        poster={poster}
        loading="eager"
        reveal="auto"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        interaction-prompt="none"
        shadow-intensity="2"
        shadow-softness="0.8"
        exposure="1.2"
        environment-image="neutral"
        touch-action="none"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        onLoad={() => setIsLoaded(true)}
        onPointerDown={() => setHasInteracted(true)}
      >
        <button
          slot="ar-button"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 z-10 border-none text-lg"
        >
          <Smartphone className="w-6 h-6 text-orange-500" />
          VIEW IN YOUR SPACE
        </button>
        {isLoaded && hasInteracted && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleReset}
            className="absolute top-6 left-6 h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-black/60 z-20"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        )}
        <div className="absolute top-6 right-6 hidden md:flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl text-[11px] font-black text-white/80 border border-white/10 shadow-sm uppercase tracking-widest">
          <Box className="w-4 h-4 text-orange-500" />
          Desktop 3D Preview
        </div>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/60">Loading Dish</p>
            </div>
          </div>
        )}
      </model-viewer>
    </div>
  );
}