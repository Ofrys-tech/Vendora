import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@vendora/storefront/styles.css';
import './styles.css';
import { DemoApp } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DemoApp />
    </BrowserRouter>
  </StrictMode>,
);
