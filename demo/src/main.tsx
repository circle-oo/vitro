import React from 'react';
import { createRoot } from 'react-dom/client';

// Import Vitro styles
import '@circle-oo/vitro/styles/base.css';
import '@circle-oo/vitro/styles/themes/pantry.css';
import '@circle-oo/vitro/styles/themes/flux.css';

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
