import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import { Portfolio, AddStock, Analytics, SettingsPage } from './pages/Placeholders'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/add"       element={<AddStock />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings"  element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
