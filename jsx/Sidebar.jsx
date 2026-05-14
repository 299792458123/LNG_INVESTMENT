import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  BarChart2,
  Settings,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: '대시보드' },
  { to: '/portfolio', icon: ListOrdered,     label: '포트폴리오' },
  { to: '/add',       icon: PlusCircle,      label: '종목 추가' },
  { to: '/analytics', icon: BarChart2,       label: '분석' },
  { to: '/settings',  icon: Settings,        label: '설정' },
]

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-60 min-h-screen bg-surface-800 border-r border-surface-600 py-6 px-3 gap-1 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <TrendingUp className="text-brand-400 w-6 h-6" />
        <span className="font-mono font-bold text-lg tracking-tight text-white">
          StockManager
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 font-medium'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-surface-700'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
