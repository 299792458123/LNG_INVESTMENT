import { useState, useEffect } from 'react'

export default function RightPanel({ stocks, selected }) {
  const [qty,    setQty]    = useState(1)
  const [myVote, setMyVote] = useState(null)
  const [votes,  setVotes]  = useState({ buy: 62, hold: 24, sell: 14 })

  useEffect(() => {
    const b = 40 + Math.floor(Math.random() * 35)
    const h = 10 + Math.floor(Math.random() * 20)
    setVotes({ buy: b, hold: h, sell: 100 - b - h })
    setMyVote(null)
    setQty(1)
  }, [selected?.ticker])

  const price      = selected?.cur ?? 0
  const sym        = selected?.sym ?? '$'
  const orderTotal = (price * qty).toLocaleString(undefined, {
    maximumFractionDigits: sym === '₩' ? 0 : 2,
  })

  function castVote(type) {
    if (myVote) return
    setMyVote(type)
    setVotes(v => {
      const n = { ...v }
      if (type === 'buy')  { n.buy  = Math.min(n.buy  + 4, 85); n.sell = Math.max(n.sell - 2, 5); n.hold = 100 - n.buy - n.sell }
      if (type === 'hold') { n.hold = Math.min(n.hold + 4, 55); n.sell = Math.max(n.sell - 2, 5); n.buy  = 100 - n.hold - n.sell }
      if (type === 'sell') { n.sell = Math.min(n.sell + 4, 55); n.buy  = Math.max(n.buy  - 2, 20); n.hold = 100 - n.buy - n.sell }
      return n
    })
  }

  function execOrder(type) {
    alert(`${selected?.ticker} ${qty}주 ${type === 'buy' ? '매수' : '매도'} 주문 접수`)
  }

  const VOTE_OPTIONS = [
    { key: 'buy',  label: '매수', color: '#16a34a' },
    { key: 'hold', label: '보유', color: '#b45309' },
    { key: 'sell', label: '매도', color: '#dc2626' },
  ]

  return (
    <div style={{
      borderLeft: '2px solid #000',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      overflowY: 'auto',
    }}>

      {/* ── 매수 / 매도 패널 ── */}
      <div style={{ padding: '16px 14px', borderBottom: '2px solid #000' }}>
        <div style={sectionLabel}>주문</div>

        {/* 종목 */}
        <div style={fieldLabel}>종목</div>
        <div style={fieldBox}>{selected?.ticker ?? '--'}</div>

        {/* 수량 */}
        <div style={fieldLabel}>수량</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12, border: '1px solid #000' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn}>−</button>
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#000' }}>{qty}</span>
          <button onClick={() => setQty(q => q + 1)} style={qtyBtn}>+</button>
        </div>

        {/* 예상 금액 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: '#888',
          padding: '8px 0',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: 12,
        }}>
          <span>예상 금액</span>
          <span style={{ color: '#000', fontWeight: 700 }}>{sym}{orderTotal}</span>
        </div>

        {/* 매수 버튼 */}
        <button
          onClick={() => execOrder('buy')}
          style={{
            width: '100%', padding: '10px 0', marginBottom: 6,
            background: '#000', border: '2px solid #000',
            color: '#fff', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '.06em',
            transition: 'all .1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.borderColor = '#16a34a' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.borderColor = '#000' }}
        >
          매수 ▲
        </button>

        {/* 매도 버튼 */}
        <button
          onClick={() => execOrder('sell')}
          style={{
            width: '100%', padding: '10px 0',
            background: '#fff', border: '2px solid #000',
            color: '#000', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '.06em',
            transition: 'all .1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000' }}
        >
          매도 ▼
        </button>
      </div>

      {/* ── 매입 투표 ── */}
      <div style={{ padding: '16px 14px', flex: 1 }}>
        <div style={sectionLabel}>커뮤니티 투표</div>
        <div style={{ fontSize: 10, color: '#bbb', marginBottom: 14, marginTop: -6 }}>
          {selected?.ticker} · 총 {votes.buy + votes.hold + votes.sell}표
        </div>

        {/* 바 + 퍼센트 */}
        {VOTE_OPTIONS.map(({ key, label, color }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginBottom: 4 }}>
              <span style={{ fontWeight: myVote === key ? 700 : 400 }}>{label}</span>
              <span style={{ color: myVote === key ? color : '#888' }}>{votes[key]}%</span>
            </div>
            <div style={{ background: '#f0f0f0', height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${votes[key]}%`,
                background: color,
                transition: 'width .4s ease',
              }} />
            </div>
          </div>
        ))}

        {/* 투표 버튼 */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {myVote ? (
            <div style={{
              textAlign: 'center',
              fontSize: 10,
              color: '#888',
              padding: '10px 0',
              border: '1px dashed #ccc',
            }}>
              투표 완료 ✓
            </div>
          ) : (
            VOTE_OPTIONS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => castVote(key)}
                style={{
                  padding: '8px 0',
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  color: '#555',
                  cursor: 'pointer',
                  transition: 'all .1s',
                  letterSpacing: '.04em',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}10` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '#fff' }}
              >
                {label} 투표
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const sectionLabel = {
  fontSize: 9,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: '#888',
  marginBottom: 12,
}

const fieldLabel = {
  fontSize: 9,
  color: '#aaa',
  marginBottom: 4,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
}

const fieldBox = {
  padding: '7px 10px',
  background: '#f5f5f5',
  border: '1px solid #e0e0e0',
  fontSize: 12,
  fontWeight: 700,
  color: '#000',
  marginBottom: 10,
}

const qtyBtn = {
  width: 36,
  height: 34,
  background: '#fff',
  border: 'none',
  color: '#000',
  fontSize: 16,
  cursor: 'pointer',
  fontFamily: '"JetBrains Mono", monospace',
  flexShrink: 0,
  borderRight: '1px solid #000',
}
