import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

const stats = [
  { label: '총 평가금액',   value: '₩ 12,450,000', change: '+5.2%', up: true,  icon: DollarSign },
  { label: '총 수익',       value: '₩ 1,230,000',  change: '+10.9%', up: true, icon: TrendingUp },
  { label: '오늘의 손익',   value: '₩ -84,500',    change: '-0.68%', up: false, icon: TrendingDown },
  { label: '보유 종목 수',  value: '8',             change: '종목',   up: true,  icon: Activity },
]

const holdings = [
  { ticker: 'AAPL', name: '애플',      qty: 5,  avg: 178_000, current: 191_000 },
  { ticker: '005930', name: '삼성전자', qty: 20, avg: 71_000,  current: 75_400  },
  { ticker: 'TSLA', name: '테슬라',    qty: 3,  avg: 195_000, current: 172_000 },
  { ticker: 'NVDA', name: '엔비디아',  qty: 2,  avg: 430_000, current: 895_000 },
]

function pnl(avg, current, qty) {
  const val = (current - avg) * qty
  const pct = ((current - avg) / avg) * 100
  return { val, pct }
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-white">대시보드</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="card flex flex-col gap-3">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs uppercase tracking-wider">{label}</span>
              <Icon className="w-4 h-4" />
            </div>
            <p className="font-mono text-xl font-bold text-white">{value}</p>
            <p className={up ? 'stat-up' : 'stat-down'}>{change}</p>
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div className="card overflow-x-auto">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          보유 종목
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-surface-600">
              <th className="pb-3 text-left font-medium">티커</th>
              <th className="pb-3 text-left font-medium">종목명</th>
              <th className="pb-3 text-right font-medium">수량</th>
              <th className="pb-3 text-right font-medium">평균단가</th>
              <th className="pb-3 text-right font-medium">현재가</th>
              <th className="pb-3 text-right font-medium">손익</th>
              <th className="pb-3 text-right font-medium">수익률</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {holdings.map((h) => {
              const { val, pct } = pnl(h.avg, h.current, h.qty)
              const up = val >= 0
              return (
                <tr key={h.ticker} className="hover:bg-surface-700/40 transition-colors">
                  <td className="py-3 font-mono font-semibold text-brand-400">{h.ticker}</td>
                  <td className="py-3 text-gray-300">{h.name}</td>
                  <td className="py-3 text-right font-mono">{h.qty}</td>
                  <td className="py-3 text-right font-mono text-gray-400">
                    {h.avg.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-white">
                    {h.current.toLocaleString()}
                  </td>
                  <td className={`py-3 text-right font-mono ${up ? 'text-brand-400' : 'text-red-400'}`}>
                    {up ? '+' : ''}{val.toLocaleString()}
                  </td>
                  <td className={`py-3 text-right font-mono ${up ? 'text-brand-400' : 'text-red-400'}`}>
                    {up ? '+' : ''}{pct.toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
