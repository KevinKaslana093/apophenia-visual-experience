import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';
import './styles.css';
import './hub.css';
import './love-me.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
