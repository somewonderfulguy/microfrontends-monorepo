import { setupWorker } from 'msw'

import { userHandlers } from './userApi/userMSW'

export const worker = setupWorker(...userHandlers)
