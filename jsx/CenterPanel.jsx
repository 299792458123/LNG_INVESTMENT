import { useEffect, useState } from 'react'
import { RefreshCw }           from 'lucide-react'
import StockChart              from './StockChart'
import { useRealTimePrice }    from '../hooks/useRealTimePrice'
import { useStockCandles }     from '../hooks/useStockCandles'

const RESOLUTIONS = [
  { label: '1분',   value: '1'  },
  { label: '15분',  value: '15' },
  { label: '1시간', value: '60' },
  { label: '1일',   value: 'D'  },
]

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
  const diff = displayPrice && quote?.pc ? displayPrice - quote.pc : null
  const pct  = diff && quote?.pc ? (diff / quote.pc) * 100 : null
  const up   = diff >= 0

  return (
    <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* 헤더: 종목명 + 현재가 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px 10px',
        borderBottom: '2px solid #000',
      }}>
        <div>
          <div style={{ color: '#16a34a', fontSize: 15, fontWeight: 700 }}>{selected?.ticker}</div>
          <div style={{ color: '#888', fontSize: 11, marginTop: 1 }}>{selected?.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#000', fontSize: 18, fontWeight: 700 }}>
              {displayPrice ? `${selected?.sym}${displayPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '--'}
            </div>
            {diff !== null && (
              <div style={{ fontSize: 11, color: up ? '#16a34a' : '#dc2626' }}>
                {up ? '▲' : '▼'} {up ? '+' : ''}{selected?.sym}{Math.abs(diff).toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)
              </div>
            )}
          </div>
          <button
            onClick={refetch}
            style={{ background: 'none', border: '1px solid #ccc', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#555' }}
            title="새로고침"
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* OHLC 보조 정보 */}
      {quote && (
        <div style={{ display: 'flex', gap: 20, padding: '6px 16px', borderBottom: '1px solid #e5e5e5', fontSize: 10, color: '#888' }}>
          <span>시가 {quote.o?.toFixed(2)}</span>
          <span>고가 <span style={{ color: '#16a34a' }}>{quote.h?.toFixed(2)}</span></span>
          <span>저가 <span style={{ color: '#dc2626' }}>{quote.l?.toFixed(2)}</span></span>
          <span>전일 {quote.pc?.toFixed(2)}</span>
        </div>
      )}

      {/* 시간대 탭 */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 16px', borderBottom: '1px solid #e5e5e5' }}>
        {RESOLUTIONS.map(r => (
          <button
            key={r.value}
            onClick={() => setResolution(r.value)}
            style={{
              background: resolution === r.value ? '#16a34a' : '#fff',
              border: `1px solid ${resolution === r.value ? '#16a34a' : '#ccc'}`,
              borderRadius: 5,
              padding: '4px 10px',
              color: resolution === r.value ? '#fff' : '#555',
              fontSize: 10,
              fontWeight: resolution === r.value ? 700 : 400,
              fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
              transition: 'all .12s',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      <div style={{ flex: 1, padding: '4px 8px 8px', overflow: 'hidden' }}>
        {error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: '#dc2626', fontSize: 12 }}>
            <p>데이터 로딩 실패: {error}</p>
            <button onClick={refetch} style={{ border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>재시도</button>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: 24, height: 24, border: '2px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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
