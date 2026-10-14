import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DashboardProvider } from './context/DashboardContext'
import { ScannerProvider } from './context/ScannerContext'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <DashboardProvider>
      <ScannerProvider>
        <App />
      </ScannerProvider>
    </DashboardProvider>
  </StrictMode>,
)
