/// <reference types="vitest/globals" />
// Vitest global test setup
import '@testing-library/jest-dom'

// Mock Tauri APIs so tests run in jsdom without a Rust backend
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-fs', () => ({
  readDir: vi.fn(),
  stat: vi.fn(),
}))
