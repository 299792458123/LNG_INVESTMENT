import { useState } from 'react'
import LeftPanel   from './components/LeftPanel'
import CenterPanel from './components/CenterPanel'
import RightPanel  from './components/RightPanel'

const INITIAL_STOCKS = [
  { ticker: 'AAPL',   name: 'Apple Inc.',      qty: 5,  avg: 178,   cur: 191.24, prev: 188.93, sym: '$' },
  { ticker: 'TSLA',   name: 'Tesla Inc.',       qty: 3,  avg: 195,   cur: 172.30, prev: 175.10, sym: '$' },
  { ticker: 'NVDA',   name: 'Nvidia Corp.',     qty: 2,  avg: 430,   cur: 895.00, prev: 877.50, sym: '$' },
  { ticker: '005930', name: '삼성전자',          qty: 20, avg: 71000, cur: 75400,  prev: 74800,  sym: '₩' },
]

export default function App() {
  const [stocks, setStocks]       = useState(INITIAL_STOCKS)
  const [activeIdx, setActiveIdx] = useState(0)
  const [livePrice, setLivePrice] = useState(null)

  const selected = stocks[activeIdx]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '240px 1fr 220px',
      height: '100vh',
      width: '100vw',
      background: '#fff',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 12,
      overflow: 'hidden',
    }}>
      <LeftPanel
        stocks={stocks}
        setStocks={setStocks}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />
      <CenterPanel
        selected={selected}
        livePrice={livePrice}
        setLivePrice={setLivePrice}
      />
      <RightPanel
        stocks={stocks}
        selected={selected}
      />
    </div>
  )
}
