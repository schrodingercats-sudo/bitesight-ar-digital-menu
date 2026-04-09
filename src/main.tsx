import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableMapSet } from "immer";
// Early initialization of critical WebComponents and Suppressors
if (typeof window !== 'undefined') {
  (window as any).litDisableDevMode = true;
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = args[0];
    if (typeof msg === 'string') {
      const isSuppressed = [
        'Lit is in dev mode',
        'Falling back to next ar-mode',
        'WebXR denied',
        'scheduled an update',
        'supportsPresentation',
        'rAF timed out',
        'LitHtmlConfig'
      ].some(text => msg.includes(text));
      if (isSuppressed) return;
    }
    if (msg && typeof msg === 'object' && Object.keys(msg).length === 0) return;
    originalWarn(...args);
  };
}
import '@/lib/errorReporter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
enableMapSet();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 600000,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}