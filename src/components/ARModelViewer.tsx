import React, { useEffect, useRef, useState, useContext, memo } from 'react';
import '@google/model-viewer';
import { SwipePanContext } from './SwipePanContext';
import { Box, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ARModelViewerProps {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
}
export const ARModelViewer = memo(function ARModelViewer({ src, alt, poster, className }: ARModelViewerProps) {
  const modelRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [arStatus, setArStatus] = useState<string>('none');
  const contextValue = useContext(SwipePanContext);
  const isPanning = !!contextValue?.isPanning;
  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;
    const handleLoad = () => {
      setIsLoaded(true);
      if (modelViewer.canActivateAR !== undefined) {
        setArSupported(modelViewer.canActivateAR);
      }
    };
    const handleError = () => console.error('Model failed to load:', src);
    const handleArStatus = (event: any) => {
      setArStatus(event.detail.status);
    };
    const handleInteraction = () => setHasInteracted(true);
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('ar-status', handleArStatus);
    modelViewer.addEventListener('pointerdown', handleInteraction);
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('ar-status', handleArStatus);
      modelViewer.removeEventListener('pointerdown', handleInteraction);
    };
  }, [src]);
  const handleReset = () => {
    const mv = modelRef.current;
    if (mv) {
      mv.cameraTarget = "auto auto auto";
      mv.cameraOrbit = "0deg 75deg 105%";
      mv.fieldOfView = "auto";
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
        auto-rotate={!isPanning}
        camera-controls={!isPanning}
        rotation-per-second="10deg"
        interaction-prompt="none"
        shadow-intensity="2"
        shadow-softness="0.8"
        exposure="1.2"
        environment-image="neutral"
        touch-action="none"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' } as React.CSSProperties}
      >
        {arSupported && isLoaded && arStatus !== 'session-started' && (
          <button
            slot="ar-button"
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 z-10 border-none text-lg"
          >
            <Box className="w-6 h-6 text-orange-500" />
            VIEW IN YOUR SPACE
          </button>
        )}
        {isLoaded && !arSupported && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-30">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            3D Preview Only
          </div>
        )}
        {isLoaded && hasInteracted && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleReset}
            className="absolute top-6 left-6 h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-black/60 z-20 pointer-events-auto"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        )}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-transparent">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/60">Loading Experience</p>
            </div>
          </div>
        )}
      </model-viewer>
    </div>
  );
});