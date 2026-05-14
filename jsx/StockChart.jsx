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

const UP   = '#16a34a'
const DOWN = '#dc2626'
const GRID = 'rgba(0,0,0,0.05)'

function formatTime(ms, resolution) {
  const d = new Date(ms)
  if (resolution === 'D')
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(v) {
  if (v == null) return '--'
  return v >= 1000
    ? v.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
    : v.toFixed(2)
}

function CustomTooltip({ active, payload, label, resolution }) {
  if (!active || !payload?.length) return null
  const d  = payload[0]?.payload
  if (!d) return null
  const up = d.close >= d.open

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #000',
      padding: '10px 14px',
      fontSize: 11,
      lineHeight: 1.9,
      fontFamily: '"JetBrains Mono", monospace',
      minWidth: 155,
    }}>
      <div style={{ color: '#999', marginBottom: 5, fontSize: 10 }}>
        {formatTime(label, resolution)}
      </div>
      {[
        ['시가', d.open, '#555'],
        ['고가', d.high, UP],
        ['저가', d.low,  DOWN],
        ['종가', d.close, up ? UP : DOWN],
      ].map(([lbl, val, col]) => (
        <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
          <span style={{ color: '#aaa' }}>{lbl}</span>
          <span style={{ color: col, fontWeight: lbl === '종가' ? 700 : 400 }}>{formatPrice(val)}</span>
        </div>
      ))}
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#aaa' }}>거래량</span>
        <span style={{ color: '#555' }}>{d.volume?.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function StockChart({ candles, resolution, livePrice, prevClose }) {
  if (!candles?.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc', fontSize: 12, letterSpacing: '.04em' }}>
        데이터 없음
      </div>
    )
  }

  const data = candles.map((c, i) =>
    i === candles.length - 1 && livePrice
      ? { ...c, close: livePrice, high: Math.max(c.high, livePrice), low: Math.min(c.low, livePrice) }
      : c
  )

  const prices   = data.flatMap(c => [c.high, c.low]).filter(Boolean)
  const priceMin = Math.min(...prices) * 0.999
  const priceMax = Math.max(...prices) * 1.001
  const volMax   = Math.max(...data.map(c => c.volume).filter(Boolean))

  const first = data[0]?.close
  const last  = data[data.length - 1]?.close
  const lineColor = last >= first ? UP : DOWN

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* 가격 차트 */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 56, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke={GRID} />
            <XAxis
              dataKey="time"
              tickFormatter={ms => formatTime(ms, resolution)}
              tick={{ fill: '#bbb', fontSize: 9, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              minTickGap={70}
            />
            <YAxis
              domain={[priceMin, priceMax]}
              tickFormatter={formatPrice}
              tick={{ fill: '#bbb', fontSize: 9, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              width={54}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip resolution={resolution} />} />

            {prevClose != null && (
              <ReferenceLine
                y={prevClose}
                stroke="rgba(0,0,0,0.15)"
                strokeDasharray="4 4"
                label={{
                  value: `전일 ${formatPrice(prevClose)}`,
                  fill: '#bbb',
                  fontSize: 9,
                  fontFamily: '"JetBrains Mono", monospace',
                  position: 'insideTopRight',
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 3, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 거래량 차트 */}
      <div style={{ height: 60, flexShrink: 0, borderTop: '1px solid #e0e0e0', marginTop: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 2, right: 56, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, volMax]} hide orientation="right" width={54} />
            <Bar
              dataKey="volume"
              fill="rgba(0,0,0,0.12)"
              isAnimationActive={false}
              maxBarSize={5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
