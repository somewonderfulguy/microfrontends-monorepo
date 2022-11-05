import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import ResizeObserver from 'resize-observer-polyfill'

// resizeObserver polyfill
window.ResizeObserver = ResizeObserver

export * from '@testing-library/react'
export { userEvent }