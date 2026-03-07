import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './panel.css';
import { MappoolPanel } from './MappoolPanel';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

createRoot(root).render(
  <StrictMode>
    <MappoolPanel />
  </StrictMode>,
);
