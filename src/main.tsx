import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupClientAPIInterceptor } from './lib/apiInterceptor';

// Initialize the client-side API proxy to handle all requests locally
setupClientAPIInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
