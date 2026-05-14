const BASE_URL = 'https://finnhub.io/api/v1'
const API_KEY  = import.meta.env.VITE_FINNHUB_API_KEY

if (!API_KEY) {
  console.warn('⚠️ VITE_FINNHUB_API_KEY 가 설정되지 않았습니다. .env 파일을 확인하세요.')
}

async function get(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('token', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Finnhub ${res.status}: ${res.statusText}`)
  return res.json()
}

export async function fetchQuote(symbol) {
  return get('/quote', { symbol })
}

export async function fetchCandles(symbol, resolution, from, to) {
  const data = await get('/stock/candle', { symbol, resolution, from, to })
  if (data.s !== 'ok') throw new Error(`캔들 조회 실패: ${data.s}`)

  return data.t.map((ts, i) => ({
    time:   ts * 1000,
    open:   data.o[i],
    high:   data.h[i],
    low:    data.l[i],
    close:  data.c[i],
    volume: data.v[i],
  }))
}

export async function searchSymbol(query) {
  const data = await get('/search', { q: query })
  return (data.result ?? []).filter(r => r.type === 'Common Stock')
}

const WS_URL = `wss://ws.finnhub.io?token=${API_KEY}`

export class FinnhubWS {
  #ws        = null
  #listeners = new Map()
  #queue     = []
  #status    = 'closed'

  connect() {
    if (this.#status !== 'closed') return
    this.#status = 'connecting'

    this.#ws = new WebSocket(WS_URL)

    this.#ws.onopen = () => {
      this.#status = 'open'
      this.#queue.forEach(sym => this.#send('subscribe', sym))
      this.#queue = []
    }

    this.#ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data)
      if (msg.type !== 'trade') return
      msg.data?.forEach(trade => {
        const cbs = this.#listeners.get(trade.s)
        cbs?.forEach(cb => cb({ price: trade.p, volume: trade.v, timestamp: trade.t }))
      })
    }

    this.#ws.onerror = (e) => console.error('Finnhub WS error', e)
    this.#ws.onclose = () => { this.#status = 'closed' }
  }

  subscribe(symbol, callback) {
    if (!this.#listeners.has(symbol)) {
      this.#listeners.set(symbol, new Set())
      if (this.#status === 'open') this.#send('subscribe', symbol)
      else this.#queue.push(symbol)
    }
    this.#listeners.get(symbol).add(callback)
  }

  unsubscribe(symbol, callback) {
    const cbs = this.#listeners.get(symbol)
    if (!cbs) return
    cbs.delete(callback)
    if (cbs.size === 0) {
      this.#listeners.delete(symbol)
      if (this.#status === 'open') this.#send('unsubscribe', symbol)
    }
  }

  disconnect() {
    this.#ws?.close()
    this.#listeners.clear()
    this.#queue = []
  }

  #send(type, symbol) {
    this.#ws?.send(JSON.stringify({ type, symbol }))
  }
}

export const finnhubWS = new FinnhubWS()
