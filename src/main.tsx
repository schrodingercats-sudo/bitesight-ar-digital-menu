if (typeof window !== 'undefined') {
  // Suppress Lit dev mode warnings before anything loads
  (window as any).litDisableDevMode = true;
  // Attempt to disable further Lit/ModelViewer dev logging
  (window as any).LitHtmlConfig = { ...((window as any).LitHtmlConfig || {}), devMode: false };
  // Advanced Warning Suppressor to clear non-actionable AR and Lit messages from logs
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = args[0];
    if (typeof msg === 'string') {
      const isSuppressed = [
        'Lit is in dev mode',
        'Falling back to next ar-mode',
        'WebXR denied',
        'scheduled an update',
        'supportsPresentation'
      ].some(text => msg.includes(text));
      if (isSuppressed) return;
    }
    // Handle the case where the first argument is an empty object or has specific patterns
    if (msg && typeof msg === 'object' && Object.keys(msg).length === 0) {
      return;
    }
    originalWarn(...args);
  };
}
import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 600000, // 10 minutes cache for menu stability
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
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </QueryClientProvider>
)