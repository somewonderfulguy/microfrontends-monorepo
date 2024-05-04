import { setupWorker } from 'msw';

import { handlers } from './mswHandlers';

export const worker = setupWorker(...handlers);
