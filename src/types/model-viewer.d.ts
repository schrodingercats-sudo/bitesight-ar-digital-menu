import * as React from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'ios-src'?: string;
        poster?: string;
        exposure?: string;
        'interaction-prompt'?: string;
        'environment-image'?: string;
        'loading'?: string;
        'reveal'?: string;
        'touch-action'?: string;
      }, HTMLElement>;
    }
  }
}