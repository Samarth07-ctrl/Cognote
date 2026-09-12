import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import '@/styles/globals.css'

// Disable default browser context menu across the whole app.
// This gives the desktop app a native feel.
// Individual components can re-enable it where needed (e.g. text areas).
document.addEventListener('contextmenu', (e) => {
  const target = e.target as HTMLElement
  const isInput =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  if (!isInput) {
    e.preventDefault()
  }
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found. Check index.html.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
