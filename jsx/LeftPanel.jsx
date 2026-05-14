import { useState } from 'react'

function pnl(avg, cur, qty) {
  const val = (cur - avg) * qty
  const pct = ((cur - avg) / avg) * 100
  return { val, pct }
}

const inputStyle = {
  background: '#fff',
  border: '1px solid #000',
  padding: '6px 8px',
  color: '#000',
  fontSize: 11,
  fontFamily: '"JetBrains Mono", monospace',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export default function LeftPanel({ stocks, setStocks, activeIdx, setActiveIdx }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ ticker: '', name: '', qty: '', avg: '' })

  const totalVal  = stocks.reduce((s, h) => s + h.cur * h.qty, 0)
  const totalCost = stocks.reduce((s, h) => s + h.avg * h.qty, 0)
  const totalPnl  = totalVal - totalCost
  const totalPct  = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0
  const up        = totalPnl >= 0

  function addStock() {
    const ticker = form.ticker.toUpperCase().trim()
    if (!ticker) return
    const avg = parseFloat(form.avg) || 0
    const qty = parseInt(form.qty)   || 1
    const sym = /^\d/.test(ticker) ? '₩' : '$'
    const cur = parseFloat((avg * (1 + (Math.random() * 0.08 - 0.02))).toFixed(2))
    setStocks(prev => [
      ...prev,
      { ticker, name: form.name.trim() || ticker, qty, avg, cur, prev: avg, sym },
    ])
    setForm({ ticker: '', name: '', qty: '', avg: '' })
    setShowForm(false)
  }

  return (
    <div style={{
      borderRight: '2px solid #000',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#fff',
    }}>

      {/* ── 총 평가금액 ── */}
      <div style={{ padding: '18px 16px 16px', borderBottom: '2px solid #000' }}>
        <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>
          총 평가금액
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#000', letterSpacing: '-.02em' }}>
          ₩{Math.round(totalVal).toLocaleString()}
        </div>
        <div style={{ marginTop: 5, fontSize: 11, color: up ? '#16a34a' : '#dc2626' }}>
          {up ? '▲' : '▼'} {up ? '+' : ''}₩{Math.round(Math.abs(totalPnl)).toLocaleString()}
          <span style={{ marginLeft: 4, opacity: 0.8 }}>({up ? '+' : ''}{totalPct.toFixed(2)}%)</span>
        </div>
      </div>

      {/* ── 보유 종목 레이블 ── */}
      <div style={{
        padding: '8px 16px',
        fontSize: 9,
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: '#888',
        borderBottom: '1px solid #e0e0e0',
      }}>
        보유 종목
      </div>

      {/* ── 종목 리스트 ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {stocks.map((s, i) => {
          const { pct } = pnl(s.avg, s.cur, s.qty)
          const isUp     = pct >= 0
          const isActive = i === activeIdx
          return (
            <div
              key={s.ticker + i}
              onClick={() => setActiveIdx(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #e0e0e0',
                borderLeft: isActive ? '3px solid #000' : '3px solid transparent',
                background: isActive ? '#f5f5f5' : '#fff',
                transition: 'background .1s',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#000' }}>{s.ticker}</div>
                <div style={{ fontSize: 10, color: '#999', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>
                  {s.qty}주 · 평균 {s.sym}{s.avg.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#000' }}>
                  {s.sym}{s.cur.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: isUp ? '#16a34a' : '#dc2626', marginTop: 2 }}>
                  {isUp ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── 종목 추가 ── */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            margin: 12,
            padding: '9px 0',
            background: '#fff',
            border: '2px dashed #bbb',
            fontSize: 11,
            color: '#999',
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
            transition: 'all .15s',
            letterSpacing: '.04em',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#bbb'; e.currentTarget.style.color = '#999' }}
        >
          + 종목 추가
        </button>
      ) : (
        <div style={{ padding: '12px 14px', borderTop: '2px solid #000', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            placeholder="티커 (예: AAPL)"
            value={form.ticker}
            onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
            style={inputStyle}
          />
          <input
            placeholder="종목명 (선택)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              placeholder="수량"
              type="number"
              value={form.qty}
              onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              placeholder="평균단가"
              type="number"
              value={form.avg}
              onChange={e => setForm(f => ({ ...f, avg: e.target.value }))}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => { setShowForm(false); setForm({ ticker: '', name: '', qty: '', avg: '' }) }}
              style={{ flex: 1, padding: '7px 0', background: '#fff', border: '1px solid #000', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, cursor: 'pointer' }}
            >
              취소
            </button>
            <button
              onClick={addStock}
              style={{ flex: 1, padding: '7px 0', background: '#000', border: '1px solid #000', color: '#fff', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
