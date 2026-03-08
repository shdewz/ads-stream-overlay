import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/vars.css';
import './panel.css';
import { ControlPanel } from './ControlPanel';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

createRoot(root).render(
  <StrictMode>
    <ControlPanel />
  </StrictMode>
);
