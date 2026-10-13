import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;

    --surface-primary: #ffffff;
    --surface-secondary: #f7f6f4;
    --surface-elevated: #ffffff;
    --surface-warm: #f5f2ef;
    --text-primary: #111111;
    --text-secondary: #4e4e4e;
    --text-tertiary: #777169;
    --border-default: #e5e2dd;
    --border-subtle: rgba(0, 0, 0, 0.05);
    --accent-primary: #111111;
    --accent-warm: #e9ded4;
    --focus-ring: rgba(70, 130, 210, 0.5);
    --status-success: #2e7d55;
    --status-warning: #9a6a1f;
    --status-error: #b3403d;

    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    --space-20: 80px;

    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-full: 9999px;

    --shadow-card: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 28px rgba(78, 50, 23, 0.06);
    --shadow-warm-lift: 0 10px 30px rgba(78, 50, 23, 0.08);

    font-family: "Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif;
    background: var(--surface-primary);
    color: var(--text-primary);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --surface-primary: #11100f;
      --surface-secondary: #1a1816;
      --surface-elevated: #24211e;
      --surface-warm: #302a25;
      --text-primary: #f6f2ee;
      --text-secondary: #c8c0b8;
      --text-tertiary: #948b82;
      --border-default: #39342f;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --accent-primary: #f6f2ee;
      --accent-warm: #5c4b3d;
      --focus-ring: rgba(147, 197, 253, 0.56);
      --status-success: #75d49c;
      --status-warning: #f0bd63;
      --status-error: #ff8d87;
      --shadow-card: 0 0 0 1px rgba(255, 255, 255, 0.07), 0 18px 42px rgba(0, 0, 0, 0.28);
      --shadow-warm-lift: 0 18px 44px rgba(0, 0, 0, 0.34);
    }
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    background: var(--surface-primary);
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100dvh;
    background:
      radial-gradient(circle at top left, color-mix(in srgb, var(--surface-warm) 70%, transparent), transparent 34rem),
      var(--surface-primary);
  }

  body,
  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img,
  svg {
    display: block;
    max-width: 100%;
  }

  #root {
    min-height: 100dvh;
  }

  ::selection {
    background: var(--accent-warm);
    color: var(--text-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`
