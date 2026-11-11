import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/inflow-design-tokens.css'
import './fonts/inter.css'
import './fonts/material-icons.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
