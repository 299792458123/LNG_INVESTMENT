import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'

const UP_COLOR   = '#22c55e'
const DOWN_COLOR = '#ef4444'
const GRID_COLOR = 'rgba(255,255,255,0.06)'

function formatTime(ms, resolution) {
  const d = new Date(ms)
  if (resolution === 'D') return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(v) {
  return v >= 1000
    ? v.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
    : v.toFixed(2)
}

function CustomTooltip({ active, payload, label, resolution }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const up = d.close >= d.open

  return (
    <div style={{
      background: '#1a2119',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
      lineHeight: 1.8,
      minWidth: 160,
    }}>
      <p style={{ color: '#9ca3af', marginBottom: 6 }}>{formatTime(label, resolution)}</p>
      <p style={{ color: '#d1d5db' }}>시가  <span style={{ color: '#fff', float: 'right', marginLeft: 24 }}>{formatPrice(d.open)}</span></p>
      <p style={{ color: '#d1d5db' }}>고가  <span style={{ color: UP_COLOR,   float: 'right' }}>{formatPrice(d.high)}</span></p>
      <p style={{ color: '#d1d5db' }}>저가  <span style={{ color: DOWN_COLOR, float: 'right' }}>{formatPrice(d.low)}</span></p>
      <p style={{ color: '#d1d5db' }}>종가  <span style={{ color: up ? UP_COLOR : DOWN_COLOR, float: 'right', fontWeight: 600 }}>{formatPrice(d.close)}</span></p>
      <p style={{ color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 6, paddingTop: 6 }}>
        거래량 <span style={{ color: '#d1d5db', float: 'right' }}>{d.volume?.toLocaleString()}</span>
      </p>
    </div>
  )
}

/**
 * StockChart
 * @param {{ candles: Array, resolution: string, livePrice: number|null, prevClose: number|null }} props
 */
export default function StockChart({ candles, resolution, livePrice, prevClose }) {
  if (!candles.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340, color: '#6b7280', fontSize: 14 }}>
        데이터가 없습니다
      </div>
    )
  }

  // 라이브 틱이 있으면 마지막 봉 close 반영
  const data = candles.map((c, i) =>
    i === candles.length - 1 && livePrice
      ? { ...c, close: livePrice, high: Math.max(c.high, livePrice), low: Math.min(c.low, livePrice) }
      : c
  )

  const prices    = data.flatMap(c => [c.high, c.low])
  const priceMin  = Math.min(...prices) * 0.999
  const priceMax  = Math.max(...prices) * 1.001
  const volumeMax = Math.max(...data.map(c => c.volume))

  return (
    <div style={{ width: '100%' }}>
      {/* 가격 차트 */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis
            dataKey="time"
            tickFormatter={ms => formatTime(ms, resolution)}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={60}
          />
          <YAxis
            domain={[priceMin, priceMax]}
            tickFormatter={formatPrice}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={70}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip resolution={resolution} />} />

          {/* 전일 종가 기준선 */}
          {prevClose && (
            <ReferenceLine
              y={prevClose}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="4 4"
              label={{ value: `전일 ${formatPrice(prevClose)}`, fill: '#6b7280', fontSize: 10, position: 'insideTopLeft' }}
            />
          )}

          <Line
            type="monotone"
            dataKey="close"
            stroke={UP_COLOR}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: UP_COLOR }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 거래량 차트 */}
      <ResponsiveContainer width="100%" height={72}>
        <ComposedChart data={data} margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, volumeMax]} hide orientation="right" />
          <Bar
            dataKey="volume"
            fill="rgba(99,153,34,0.35)"
            isAnimationActive={false}
            maxBarSize={8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
