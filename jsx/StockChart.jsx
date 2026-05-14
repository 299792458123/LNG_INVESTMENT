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

const UP_COLOR   = '#16a34a'
const DOWN_COLOR = '#dc2626'
const GRID_COLOR = 'rgba(0,0,0,0.06)'

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
      background: '#fff',
      border: '1px solid #000',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 11,
      lineHeight: 1.8,
      minWidth: 160,
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      <p style={{ color: '#888', marginBottom: 6 }}>{formatTime(label, resolution)}</p>
      <p style={{ color: '#555' }}>시가  <span style={{ color: '#111', float: 'right', marginLeft: 24 }}>{formatPrice(d.open)}</span></p>
      <p style={{ color: '#555' }}>고가  <span style={{ color: UP_COLOR,   float: 'right' }}>{formatPrice(d.high)}</span></p>
      <p style={{ color: '#555' }}>저가  <span style={{ color: DOWN_COLOR, float: 'right' }}>{formatPrice(d.low)}</span></p>
      <p style={{ color: '#555' }}>종가  <span style={{ color: up ? UP_COLOR : DOWN_COLOR, float: 'right', fontWeight: 700 }}>{formatPrice(d.close)}</span></p>
      <p style={{ color: '#888', borderTop: '1px solid #e5e5e5', marginTop: 6, paddingTop: 6 }}>
        거래량 <span style={{ color: '#555', float: 'right' }}>{d.volume?.toLocaleString()}</span>
      </p>
    </div>
  )
}

export default function StockChart({ candles, resolution, livePrice, prevClose }) {
  if (!candles.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: 13 }}>
        데이터가 없습니다
      </div>
    )
  }

  const data = candles.map((c, i) =>
    i === candles.length - 1 && livePrice
      ? { ...c, close: livePrice, high: Math.max(c.high, livePrice), low: Math.min(c.low, livePrice) }
      : c
  )

  const prices   = data.flatMap(c => [c.high, c.low])
  const priceMin = Math.min(...prices) * 0.999
  const priceMax = Math.max(...prices) * 1.001
  const volMax   = Math.max(...data.map(c => c.volume))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* 가격 라인 차트 */}
      <ResponsiveContainer width="100%" height="78%">
        <ComposedChart data={data} margin={{ top: 4, right: 60, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis
            dataKey="time"
            tickFormatter={ms => formatTime(ms, resolution)}
            tick={{ fill: '#888', fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
            axisLine={false}
            tickLine={false}
            minTickGap={60}
          />
          <YAxis
            domain={[priceMin, priceMax]}
            tickFormatter={formatPrice}
            tick={{ fill: '#888', fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }}
            axisLine={false}
            tickLine={false}
            width={58}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip resolution={resolution} />} />

          {prevClose && (
            <ReferenceLine
              y={prevClose}
              stroke="rgba(0,0,0,0.2)"
              strokeDasharray="4 4"
              label={{ value: `전일 ${formatPrice(prevClose)}`, fill: '#888', fontSize: 10, position: 'insideTopLeft' }}
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

      {/* 거래량 바 차트 */}
      <ResponsiveContainer width="100%" height="22%">
        <ComposedChart data={data} margin={{ top: 0, right: 60, left: 4, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, volMax]} hide orientation="right" />
          <Bar
            dataKey="volume"
            fill="rgba(22,163,74,0.3)"
            isAnimationActive={false}
            maxBarSize={6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
