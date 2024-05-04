import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SetupWorker } from 'msw';
import 'augmented-ui/augmented-ui.min.css';

import ThemeWrapper from '@repo/design-system/ThemeWrapper';
import '@repo/design-system/styles/reset.css';
import '@repo/design-system/styles/fonts.css';

import CyberpunkApp from './components/CyberpunkApp';

import './styles/global.css';

const launchOffline = async () => {
  if (import.meta.env.VITE_OFFLINE !== 'true') {
    return;
  }
  const importResult = (await import('./api/offline')) as {
    worker: SetupWorker;
  };

  await import('../public/mockServiceWorker.js?worker');

  importResult.worker.start({
    onUnhandledRequest: 'bypass'
  });
};

launchOffline().then(() =>
  createRoot(document.getElementById('root')!, {
    identifierPrefix: 'cyberpunk-'
  }).render(
    <StrictMode>
      <ThemeWrapper style={{ width: '100%', height: '100%' }} theme="yellow">
        <CyberpunkApp />
      </ThemeWrapper>
    </StrictMode>
  )
);
