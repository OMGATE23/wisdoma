import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthContextProvider } from './context/UserContext.tsx';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from './components/ErrorComponent.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <>
        <ErrorBoundary fallback={<ErrorComponent />}>
          <App />
          <Toaster />
        </ErrorBoundary>
      </>
    </AuthContextProvider>
  </StrictMode>,
);
