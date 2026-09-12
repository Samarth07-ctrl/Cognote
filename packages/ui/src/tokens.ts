// ─── Design Tokens ────────────────────────────────────────────────────────────
// Single source of truth for colors, spacing, and typography used across the
// Cognote design system. Tailwind config in apps/desktop references these.

export const colors = {
  // Brand
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // Neutrals — slightly cool-toned for enterprise feel
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    850: '#172032',
    900: '#0f172a',
    950: '#020617',
  },
  // Semantic
  success: {
    light: '#dcfce7',
    DEFAULT: '#16a34a',
    dark: '#14532d',
  },
  warning: {
    light: '#fef9c3',
    DEFAULT: '#ca8a04',
    dark: '#713f12',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#dc2626',
    dark: '#7f1d1d',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#2563eb',
    dark: '#1e3a8a',
  },
} as const

export const spacing = {
  sidebar: '220px',
  topbar: '52px',
  minWidth: '1100px',
  minHeight: '700px',
} as const

export const typography = {
  fontSans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  fontMono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
} as const

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const
