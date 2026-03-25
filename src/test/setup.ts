import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Cleans up the DOM after each test
afterEach(() => {
  cleanup()
})
