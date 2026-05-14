import { useState } from 'react'

function pnl(avg, cur, qty) {
  const val = (cur - avg) * qty
  const pct = ((cur - avg) / avg) * 100
  return { val, pct }
}

export default function LeftPanel({ stocks, setStocks, activeIdx, setActiveIdx }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ ticker: '', qty: '', avg: '' })

  const totalVal = stocks.reduce((s, h) => s + h.cur * h.qty, 0)
  const totalCost = stocks.reduce((s, h) => s + h.avg * h.qty, 0)
  const totalPnl  = totalVal - totalCost
  const totalPct  = (totalPnl / totalCost) * 100
  const up        = totalPnl >= 0

  function addStock() {
    const ticker = form.ticker.toUpperCase().trim()
    if (!ticker) return
    const avg = parseFloat(form.avg) || 0
    const qty = parseInt(form.qty) || 1
    const sym = isNaN(ticker[0]) ? '$' : '₩'
    const cur = parseFloat((avg * (1 + (Math.random() * 0.1 - 0.03))).toFixed(2))
    setStocks(prev => [...prev, { ticker, name: ticker, qty, avg, cur, prev: avg, sym }])
    setForm({ ticker: '', qty: '', avg: '' })
    setShowForm(false)
  }

  return (
    <div style={{
      background: '#fff',
      borderRight: '2px solid #000',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 총 평가금액 */}
      <div style={{ padding: 16, borderBottom: '2px solid #000' }}>
        <div style={{ color: '#555', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          총 평가금액
        </div>
        <div style={{ color: '#000', fontSize: 20, fontWeight: 700, letterSpacing: '-.02em' }}>
          ₩ {Math.round(totalVal).toLocaleString()}
        </div>
        <div style={{ marginTop: 3, fontSize: 11, color: up ? '#16a34a' : '#dc2626' }}>
          {up ? '▲' : '▼'} {up ? '+' : ''}₩{Math.round(Math.abs(totalPnl)).toLocaleString()} ({up ? '+' : ''}{totalPct.toFixed(1)}%)
        </div>
      </div>

      {/* 보유 종목 레이블 */}
      <div style={{ padding: '10px 16px 6px', color: '#555', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', borderBottom: '1px solid #ccc' }}>
        보유 종목
      </div>

      {/* 종목 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {stocks.map((s, i) => {
          const { pct } = pnl(s.avg, s.cur, s.qty)
          const up = pct >= 0
          return (
            <div
              key={s.ticker + i}
              onClick={() => setActiveIdx(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #e5e5e5',
                borderLeft: i === activeIdx ? '3px solid #16a34a' : '3px solid transparent',
                background: i === activeIdx ? '#f0fdf4' : '#fff',
                transition: 'background .12s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#16a34a', fontSize: 11, fontWeight: 700 }}>{s.ticker}</div>
                <div style={{ color: '#888', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#111', fontSize: 11, fontWeight: 600 }}>{s.sym}{s.cur.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: up ? '#16a34a' : '#dc2626' }}>
                  {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 종목 추가 버튼 / 폼 */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            margin: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#fff',
            border: '2px dashed #aaa',
            borderRadius: 8,
            padding: 9,
            color: '#888',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: 'calc(100% - 24px)',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.color = '#16a34a'; e.currentTarget.style.background = '#f0fdf4' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#aaa'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#fff' }}
        >
          + 종목 추가
        </button>
      ) : (
        <div style={{ padding: '12px 16px', borderTop: '2px solid #000', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="티커 (예: AAPL)"
            value={form.ticker}
            onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <input placeholder="수량" type="number" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="평균단가" type="number" value={form.avg} onChange={e => setForm(f => ({ ...f, avg: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>취소</button>
            <button onClick={addStock} style={submitBtnStyle}>추가</button>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  background: '#fff',
  border: '1px solid #aaa',
  borderRadius: 6,
  padding: '7px 10px',
  color: '#111',
  fontSize: 11,
  fontFamily: '"JetBrains Mono", monospace',
  outline: 'none',
  width: '100%',
}
const submitBtnStyle = {
  flex: 1,
  background: '#16a34a',
  border: 'none',
  borderRadius: 6,
  padding: 7,
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  fontFamily: '"JetBrains Mono", monospace',
  cursor: 'pointer',
}
const cancelBtnStyle = {
  flex: 1,
  background: '#fff',
  border: '1px solid #aaa',
  borderRadius: 6,
  padding: 7,
  color: '#555',
  fontSize: 11,
  fontFamily: '"JetBrains Mono", monospace',
  cursor: 'pointer',
}
