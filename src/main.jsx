import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App.jsx'
import { GlobalStyle } from './styles/GlobalStyle.js'
import { theme } from './styles/theme.js'

const enableReactDevTools =
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_REACT_DEVTOOLS !== '1'

if (enableReactDevTools) {
  const reactGrabScript = document.createElement('script')
  reactGrabScript.src = 'https://unpkg.com/react-grab@latest/dist/index.global.js'
  reactGrabScript.crossOrigin = 'anonymous'
  reactGrabScript.async = true
  document.head.append(reactGrabScript)

  const reactScanScript = document.createElement('script')
  reactScanScript.src = 'https://unpkg.com/react-scan@latest/dist/auto.global.js'
  reactScanScript.crossOrigin = 'anonymous'
  reactScanScript.async = true
  document.head.append(reactScanScript)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
