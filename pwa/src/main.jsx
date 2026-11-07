import React from 'react';
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/no-unresolved -- Módulo virtual generado por vite-plugin-pwa.
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './styles/app.css';

registerSW({ immediate: true });
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
