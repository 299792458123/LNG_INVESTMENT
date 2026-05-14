import { useEffect, useRef, useState } from 'react'
import { finnhubWS } from '../lib/finnhubClient'

/**
 * 실시간 가격 구독 훅
 * @param {string|null} symbol
 * @returns {{ price: number|null, volume: number|null, timestamp: number|null, connected: boolean }}
 */
export function useRealTimePrice(symbol) {
  const [tick, setTick]           = useState({ price: null, volume: null, timestamp: null })
  const [connected, setConnected] = useState(false)
  const symbolRef                 = useRef(symbol)

  useEffect(() => {
    finnhubWS.connect()
    setConnected(true)
    return () => {}
  }, [])

  useEffect(() => {
    const prev = symbolRef.current
    symbolRef.current = symbol

    const handler = (data) => setTick(data)

    if (prev)   finnhubWS.unsubscribe(prev, handler)
    if (symbol) {
      finnhubWS.subscribe(symbol, handler)
      setTick({ price: null, volume: null, timestamp: null })
    }

    return () => {
      if (symbol) finnhubWS.unsubscribe(symbol, handler)
    }
  }, [symbol])

  return { ...tick, connected }
}
