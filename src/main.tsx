import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// ?og-card muestra solo la tarjeta de vista previa (para generar la imagen)
const OgCard = lazy(() => import('./OgCard'))
const isOg = new URLSearchParams(window.location.search).has('og-card')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isOg ? (
      <Suspense>
        <OgCard />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
