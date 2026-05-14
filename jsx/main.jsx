import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* basename은 vite.config.js 의 base 값과 일치해야 합니다 */}
    <BrowserRouter basename="/stock-manager">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
