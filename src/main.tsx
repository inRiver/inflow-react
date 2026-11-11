import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/inflow-design-tokens.css'
// The showcase opts in explicitly; library consumers keep control of their font setup.
import './fonts/local-assets.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
