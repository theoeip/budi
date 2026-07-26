// BUDI — Application Entry Point
// Initializes React, providers, and routing.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { moduleLoader } from '@core/modules';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found. Ensure index.html has <div id="root">.');

// Bootstraps built-in modules into the ModuleRegistry
moduleLoader.load();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

