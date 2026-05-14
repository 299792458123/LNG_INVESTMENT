import { useEffect, useState } from 'react'
import StockChart           from './StockChart'
import { useRealTimePrice } from '../hooks/useRealTimePrice'
import { useStockCandles }  from '../hooks/useStockCandles'

const RESOLUTIONS = [
  { label: '1분',   value: '1'  },
  { label: '15분',  value: '15' },
  { label: '1시간', value: '60' },
  { label: '1일',   value: 'D'  },
]

const tabStyle = (active) => ({
  padding: '4px 12px',
  border: `1px solid ${active ? '#000' : '#ccc'}`,
  background: active ? '#000' : '#fff',
  color: active ? '#fff' : '#888',
  fontSize: 10,
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  letterSpacing: '.04em',
  transition: 'all .1s',
})

export default function CenterPanel({ selected, livePrice, setLivePrice }) {
  const [resolution, setResolution] = useState('15')

  const { candles, quote, loading, error, refetch, updateLastClose } =
    useStockCandles(selected?.ticker, resolution, 120)

  const { price: wsPrice } = useRealTimePrice(selected?.ticker)

  useEffect(() => {
    if (wsPrice) {
      setLivePrice(wsPrice)
      updateLastClose(wsPrice)
    }
  }, [wsPrice, setLivePrice, updateLastClose])

  const displayPrice = livePrice ?? quote?.c
  const diff = displayPrice != null && quote?.pc != null ? displayPrice - quote.pc : null
  const pct  = diff != null && quote?.pc ? (diff / quote.pc) * 100 : null
  const up   = diff != null && diff >= 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>

      {/* ── 헤더: 종목명 + 현재가 ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 14px',
        borderBottom: '2px solid #000',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000', letterSpacing: '-.01em' }}>
            {selected?.ticker}
          </div>
          <div style={{ fontSize: 10, color: '#999', marginTop: 3 }}>{selected?.name}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#000' }}>
              {displayPrice
                ? `${selected?.sym}${displayPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : '--'}
            </div>
            {diff !== null && (
              <div style={{ fontSize: 11, color: up ? '#16a34a' : '#dc2626', marginTop: 2 }}>
                {up ? '▲' : '▼'} {up ? '+' : ''}{selected?.sym}{Math.abs(diff).toFixed(2)}
                <span style={{ marginLeft: 6, opacity: 0.8 }}>({up ? '+' : ''}{pct?.toFixed(2)}%)</span>
              </div>
            )}
          </div>

          <button
            onClick={refetch}
            style={{
              background: '#fff',
              border: '1px solid #000',
              padding: '6px 10px',
              cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              color: '#000',
              letterSpacing: '.04em',
            }}
            title="새로고침"
          >
            ↻
          </button>
        </div>
      </div>

      {/* ── OHLC ── */}
      {quote && (
        <div style={{
          display: 'flex',
          gap: 24,
          padding: '7px 20px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: 10,
          color: '#aaa',
        }}>
          <span>시가 <span style={{ color: '#555' }}>{quote.o?.toFixed(2)}</span></span>
          <span>고가 <span style={{ color: '#16a34a' }}>{quote.h?.toFixed(2)}</span></span>
          <span>저가 <span style={{ color: '#dc2626' }}>{quote.l?.toFixed(2)}</span></span>
          <span>전일 <span style={{ color: '#555' }}>{quote.pc?.toFixed(2)}</span></span>
        </div>
      )}

      {/* ── 시간대 탭 ── */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 20px', borderBottom: '1px solid #e0e0e0' }}>
        {RESOLUTIONS.map(r => (
          <button
            key={r.value}
            onClick={() => setResolution(r.value)}
            style={tabStyle(resolution === r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── 차트 ── */}
      <div style={{ flex: 1, padding: '8px 12px 12px', overflow: 'hidden', minHeight: 0 }}>
        {error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: '#dc2626', fontSize: 11 }}>
            <div>데이터 로딩 실패: {error}</div>
            <button
              onClick={refetch}
              style={{ border: '1px solid #000', padding: '5px 12px', background: '#fff', cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontSize: 10 }}
            >
              재시도
            </button>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: '#aaa', fontSize: 11 }}>
            <div style={{
              width: 18, height: 18,
              border: '2px solid #000',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            로딩 중...
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
