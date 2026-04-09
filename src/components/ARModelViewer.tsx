import React, { useEffect, useRef, useState, useContext } from 'react';
import { SwipePanContext } from './SwipePanContext';
import { Smartphone, RefreshCw, Box, AlertTriangle } from 'lucide-react';
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
  const [arStatus, setArStatus] = useState<'not-present' | 'session-started' | 'failed' | 'idle'>('idle');
  const ctx = useContext(SwipePanContext);
  const isPanning = !!ctx?.isPanning;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!customElements.get('model-viewer')) {
      import('@google/model-viewer');
    }
  }, []);
  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;
    const handleLoad = () => setIsLoaded(true);
    const handleError = () => console.error('Model failed to load:', src);
    const handleArStatus = (event: any) => {
      if (event.detail.status === 'failed') {
        setArStatus('failed');
      } else if (event.detail.status === 'session-started') {
        setArStatus('session-started');
      }
    };
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('ar-status', handleArStatus);
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('ar-status', handleArStatus);
    };
  }, [src]);
  const handleReset = () => {
    if (modelRef.current) {
      modelRef.current.cameraTarget = "auto auto auto";
      modelRef.current.cameraOrbit = "0deg 75deg 105%";
    }
  };
  return (
    <div className={`relative w-full h-full bg-transparent overflow-hidden ${className || ''} ${isPanning ? 'pointer-events-none' : ''}`}>
      <model-viewer
        ref={modelRef}
        src={src}
        alt={alt}
        poster={poster}
        loading="eager"
        reveal="auto"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls={!isPanning}
        auto-rotate
        rotation-per-second="10deg"
        interaction-prompt="none"
        shadow-intensity="2"
        shadow-softness="0.8"
        exposure="1.2"
        environment-image="neutral"
        touch-action="none"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        onPointerDown={() => setHasInteracted(true)}
      >
        {arStatus !== 'failed' && (
          <button
            slot="ar-button"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 z-10 border-none text-lg"
          >
            <Smartphone className="w-6 h-6 text-orange-500" />
            VIEW IN YOUR SPACE
          </button>
        )}
        {arStatus === 'failed' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 z-30 animate-bounce">
            <AlertTriangle className="w-4 h-4" />
            AR not supported
          </div>
        )}
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