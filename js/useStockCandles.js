import { useCallback, useEffect, useState } from 'react'
import { fetchCandles, fetchQuote } from '../lib/finnhubClient'

const RESOLUTION_SECONDS = {
  '1':  60,
  '5':  300,
  '15': 900,
  '60': 3600,
  'D':  86400,
}

/**
 * 캔들 + 현재가 조회 훅
 * @param {string|null} symbol
 * @param {'1'|'5'|'15'|'60'|'D'} resolution
 * @param {number} barCount
 */
export function useStockCandles(symbol, resolution = '15', barCount = 120) {
  const [candles, setCandles] = useState([])
  const [quote,   setQuote]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    if (!symbol) return
    setLoading(true)
    setError(null)
    try {
      const to   = Math.floor(Date.now() / 1000)
      const from = to - RESOLUTION_SECONDS[resolution] * barCount
      const [candleData, quoteData] = await Promise.all([
        fetchCandles(symbol, resolution, from, to),
        fetchQuote(symbol),
      ])
      setCandles(candleData)
      setQuote(quoteData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbol, resolution, barCount])

  useEffect(() => { load() }, [load])

  const updateLastClose = useCallback((price) => {
    setCandles(prev => {
      if (!prev.length) return prev
      const next = [...prev]
      const last = { ...next[next.length - 1] }
      last.close = price
      last.high  = Math.max(last.high, price)
      last.low   = Math.min(last.low,  price)
      next[next.length - 1] = last
      return next
    })
  }, [])

  return { candles, quote, loading, error, refetch: load, updateLastClose }
}
