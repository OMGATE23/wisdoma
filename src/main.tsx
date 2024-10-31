import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthContextProvider } from './context/UserContext.tsx';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <>
        <ErrorBoundary fallback={<p>Something went wrong UwU</p>}>
          <App />
          <Toaster />
        </ErrorBoundary>
      </>
    </AuthContextProvider>
  </StrictMode>,
);
