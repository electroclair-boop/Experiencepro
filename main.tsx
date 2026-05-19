import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

 ({ children }: { children: React.ReactNode })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>   
  </StrictMode>,
)
