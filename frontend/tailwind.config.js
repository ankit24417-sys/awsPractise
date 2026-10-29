/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'xs': '1px',
        'sm': '2px',
        DEFAULT: '3px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
      colors: {
        // Semantic CSS Variables for Light / Dark Swiss Theme
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          subtle: 'var(--bg-surface-subtle)',
          hover: 'var(--bg-surface-hover)',
          active: 'var(--bg-surface-active)',
        },
        primary: {
          DEFAULT: 'var(--text-primary)',
          inverse: 'var(--text-inverse)',
        },
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          fg: 'var(--accent-fg)',
        },
        status: {
          success: 'var(--status-success)',
          'success-bg': 'var(--status-success-bg)',
          'success-border': 'var(--status-success-border)',
          error: 'var(--status-error)',
          'error-bg': 'var(--status-error-bg)',
          'error-border': 'var(--status-error-border)',
          warning: 'var(--status-warning)',
          'warning-bg': 'var(--status-warning-bg)',
          'warning-border': 'var(--status-warning-border)',
        },
        // Swiss Monochromatic + Crimson Accent
        swiss: {
          red: '#DC2626',
          'red-hover': '#B91C1C',
          black: '#09090B',
          white: '#FFFFFF',
          zinc: {
            50: '#FAFAFA',
            100: '#F4F4F5',
            200: '#E4E4E7',
            300: '#D4D4D8',
            400: '#A1A1AA',
            500: '#71717A',
            600: '#52525B',
            700: '#3F3F46',
            800: '#27272A',
            900: '#18181B',
            950: '#09090B',
          }
        },
        brand: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        }
      },
      boxShadow: {
        'swiss': '0 0 0 1px var(--border-subtle)',
        'swiss-focus': '0 0 0 2px var(--border-strong)',
        'swiss-elevated': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px var(--border-subtle)',
      }
    },
  },
  plugins: [],
}
