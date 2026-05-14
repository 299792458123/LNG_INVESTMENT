import { useEffect, useState } from 'react'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import StockChart    from '../components/StockChart'
import SymbolSearch  from '../components/SymbolSearch'
import { useRealTimePrice } from '../hooks/useRealTimePrice'
import { useStockCandles  } from '../hooks/useStockCandles'

const RESOLUTIONS = [
  { label: '1분',  value: '1'  },
  { label: '5분',  value: '5'  },
  { label: '15분', value: '15' },
  { label: '1시간', value: '60' },
  { label: '1일',  value: 'D'  },
]

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'AMZN']

function PriceTag({ price, prevClose }) {
  if (!price || !prevClose) return <span className="font-mono text-2xl font-bold text-white">--</span>
  const diff  = price - prevClose
  const pct   = (diff / prevClose) * 100
  const up    = diff >= 0
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-3xl font-bold text-white">{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      <span className={`font-mono text-sm ${up ? 'text-green-400' : 'text-red-400'}`}>
        {up ? '+' : ''}{diff.toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)
      </span>
    </div>
  )
}

export default function StockChartPage() {
  const [symbol,     setSymbol]     = useState('AAPL')
  const [name,       setName]       = useState('Apple Inc.')
  const [resolution, setResolution] = useState('15')

  const { candles, quote, loading, error, refetch, updateLastClose } = useStockCandles(symbol, resolution, 120)
  const { price: livePrice, connected } = useRealTimePrice(symbol)

  // 실시간 틱 → 마지막 캔들 갱신
  useEffect(() => {
    if (livePrice) updateLastClose(livePrice)
  }, [livePrice, updateLastClose])

  function handleSelect(sym, symName) {
    setSymbol(sym)
    setName(symName || sym)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{name}</h1>
          <p className="text-sm text-gray-500 font-mono mt-0.5">{symbol}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* 연결 상태 */}
          <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${connected ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
            {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {connected ? '실시간 연결' : '연결 중...'}
          </span>

          <SymbolSearch onSelect={handleSelect} />

          <button onClick={refetch} className="btn-ghost" title="새로고침">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 실시간 가격 */}
      <div className="card flex flex-col gap-2">
        <PriceTag price={livePrice ?? quote?.c} prevClose={quote?.pc} />
        {quote && (
          <div className="flex gap-6 text-xs text-gray-500 font-mono mt-1">
            <span>시가 {quote.o?.toFixed(2)}</span>
            <span>고가 <span className="text-green-400">{quote.h?.toFixed(2)}</span></span>
            <span>저가 <span className="text-red-400">{quote.l?.toFixed(2)}</span></span>
            <span>전일 {quote.pc?.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* 차트 + 컨트롤 */}
      <div className="card">
        {/* 시간대 탭 */}
        <div className="flex gap-1 mb-4">
          {RESOLUTIONS.map(r => (
            <button
              key={r.value}
              onClick={() => setResolution(r.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                resolution === r.value
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* 차트 */}
        {error ? (
          <div className="flex flex-col items-center justify-center h-80 gap-2 text-red-400">
            <p className="text-sm">데이터 로딩 실패: {error}</p>
            <button onClick={refetch} className="btn-ghost text-xs">재시도</button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <StockChart
            candles={candles}
            resolution={resolution}
            livePrice={livePrice}
            prevClose={quote?.pc}
          />
        )}
      </div>

      {/* 빠른 종목 선택 */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-gray-500 self-center">빠른 선택:</span>
        {DEFAULT_SYMBOLS.map(sym => (
          <button
            key={sym}
            onClick={() => handleSelect(sym, sym)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
              symbol === sym
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                : 'text-gray-400 hover:text-gray-200 border border-surface-600 hover:border-surface-500'
            }`}
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  )
}
