import { useState, useEffect } from 'react'

export default function RightPanel({ stocks, selected }) {
  const [qty,    setQty]    = useState(1)
  const [myVote, setMyVote] = useState(null)
  const [votes,  setVotes]  = useState({ buy: 62, hold: 24, sell: 14 })

  // 종목 변경 시 투표 랜덤 리셋
  useEffect(() => {
    const b = 40 + Math.floor(Math.random() * 35)
    const h = 10 + Math.floor(Math.random() * 20)
    setVotes({ buy: b, hold: h, sell: 100 - b - h })
    setMyVote(null)
  }, [selected?.ticker])

  const price   = selected?.cur ?? 0
  const sym     = selected?.sym ?? '$'
  const orderTotal = (price * qty).toLocaleString(undefined, { maximumFractionDigits: sym === '₩' ? 0 : 2 })

  function castVote(type) {
    setMyVote(type)
    setVotes(v => {
      const next = { ...v }
      if (type === 'buy')  { next.buy  = Math.min(next.buy  + 3, 80); next.hold = Math.max(next.hold - 1, 5); next.sell = 100 - next.buy - next.hold }
      if (type === 'hold') { next.hold = Math.min(next.hold + 3, 50); next.sell = Math.max(next.sell - 1, 5); next.buy  = 100 - next.hold - next.sell }
      if (type === 'sell') { next.sell = Math.min(next.sell + 3, 50); next.buy  = Math.max(next.buy  - 1, 20); next.hold = 100 - next.buy - next.sell }
      return next
    })
  }

  function execOrder(type) {
    alert(`${selected?.ticker} ${qty}주 ${type === 'buy' ? '매수' : '매도'} 주문이 접수되었습니다.`)
  }

  const VoteBar = ({ label, value, fillColor, pctId }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: 10, marginBottom: 3 }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div style={{ background: '#e5e5e5', borderRadius: 3, height: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: fillColor, borderRadius: 3, transition: 'width .4s' }} />
      </div>
    </div>
  )

  return (
    <div style={{
      background: '#fff',
      borderLeft: '2px solid #000',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>

      {/* 매수 / 매도 */}
      <div style={{ padding: 14, borderBottom: '2px solid #000' }}>
        <div style={sectionTitle}>매수 / 매도</div>

        <div style={fieldLabel}>종목</div>
        <div style={{ marginBottom: 8, padding: '7px 10px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 6, color: '#111', fontSize: 12, fontWeight: 700 }}>
          {selected?.ticker ?? '--'}
        </div>

        <div style={fieldLabel}>수량</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <QtyBtn onClick={() => setQty(q => Math.max(1, q - 1))}>−</QtyBtn>
          <span style={{ flex: 1, textAlign: 'center', color: '#000', fontSize: 14, fontWeight: 700 }}>{qty}</span>
          <QtyBtn onClick={() => setQty(q => q + 1)}>+</QtyBtn>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555', padding: '8px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', marginBottom: 10 }}>
          <span>예상 금액</span>
          <span style={{ color: '#000', fontWeight: 700 }}>{sym}{orderTotal}</span>
        </div>

        <button
          onClick={() => execOrder('buy')}
          style={{ ...execBtn, background: '#16a34a', border: '2px solid #16a34a', color: '#fff', marginBottom: 6 }}
        >
          매수 ▲
        </button>
        <button
          onClick={() => execOrder('sell')}
          style={{ ...execBtn, background: '#fff', border: '2px solid #dc2626', color: '#dc2626' }}
        >
          매도 ▼
        </button>
      </div>

      {/* 매입 투표 */}
      <div style={{ padding: 14, flex: 1 }}>
        <div style={sectionTitle}>매입 투표 — {selected?.ticker}</div>

        <VoteBar label="매수" value={votes.buy}  fillColor="#16a34a" />
        <VoteBar label="보유" value={votes.hold} fillColor="#ca8a04" />
        <VoteBar label="매도" value={votes.sell} fillColor="#dc2626" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0', fontSize: 10, color: '#555' }}>
          <span>신뢰도</span>
          <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>높음 ●</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
          {[['buy', '매수 투표'], ['hold', '보유 투표'], ['sell', '매도 투표']].map(([type, label]) => (
            <button
              key={type}
              onClick={() => castVote(type)}
              style={{
                background: myVote === type ? '#f0fdf4' : '#fff',
                border: `1px solid ${myVote === type ? '#16a34a' : '#aaa'}`,
                borderRadius: 5,
                padding: 6,
                color: myVote === type ? '#16a34a' : '#555',
                fontSize: 10,
                fontWeight: myVote === type ? 700 : 400,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                transition: 'all .12s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function QtyBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28,
        background: '#fff',
        border: '1px solid #aaa',
        borderRadius: 5,
        color: '#333',
        fontSize: 16,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {children}
    </button>
  )
}

const sectionTitle = {
  color: '#555',
  fontSize: 10,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  marginBottom: 10,
}

const fieldLabel = {
  color: '#555',
  fontSize: 10,
  marginBottom: 4,
}

const execBtn = {
  width: '100%',
  padding: 10,
  borderRadius: 7,
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all .15s',
}
