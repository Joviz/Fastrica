import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CalculoProvider } from '@/context/CalculoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalculoProvider>
      <App />
    </CalculoProvider>
  </StrictMode>,
)
