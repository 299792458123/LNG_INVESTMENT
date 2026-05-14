import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { searchSymbol } from '../lib/finnhubClient'

/**
 * 종목 심볼 검색 자동완성
 * @param {{ onSelect: (symbol: string, name: string) => void }} props
 */
export default function SymbolSearch({ onSelect }) {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState([])
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchSymbol(query)
        setResults(data.slice(0, 8))
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [query])

  function pick(symbol, name) {
    onSelect(symbol, name)
    setQuery(symbol)
    setOpen(false)
  }

  return (
    <div className="relative w-72">
      <div className="flex items-center gap-2 bg-surface-700 border border-surface-600 rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-gray-500 shrink-0" />
        <input
          className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full font-mono"
          placeholder="심볼 검색 (예: AAPL, 005930)"
          value={query}
          onChange={e => setQuery(e.target.value.toUpperCase())}
          onFocus={() => results.length && setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="text-gray-500 hover:text-gray-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-surface-800 border border-surface-600 rounded-lg overflow-hidden z-50 shadow-xl">
          {results.map(r => (
            <li key={r.symbol}>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-700 transition-colors text-left"
                onClick={() => pick(r.symbol, r.description)}
              >
                <span className="font-mono text-sm text-brand-400 w-20 shrink-0">{r.symbol}</span>
                <span className="text-sm text-gray-300 truncate">{r.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
