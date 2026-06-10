// Supabase Edge Function: dashboard-api
// Finnhub API를 서버 측에서 호출 — API 키가 브라우저에 노출되지 않습니다.
//
// 배포 방법:
//   supabase secrets set FINNHUB_API_KEY=실제_키_입력
//   supabase functions deploy dashboard-api

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY");
    if (!FINNHUB_KEY) {
      return new Response(
        JSON.stringify({ error: "FINNHUB_API_KEY secret이 설정되지 않았습니다." }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const body = await req.json();
    const { path, symbol, from, to, resolution } = body;

    if (!symbol || !path) {
      return new Response(
        JSON.stringify({ error: "path 와 symbol 은 필수 파라미터입니다." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let url = "";

    if (path === "quote") {
      // 현재가 조회
      url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`;

    } else if (path === "candle") {
      // 캔들(일봉) 데이터 조회
      if (!from || !to || !resolution) {
        return new Response(
          JSON.stringify({ error: "candle 요청에는 from, to, resolution 이 필요합니다." }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
      url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_KEY}`;

    } else {
      return new Response(
        JSON.stringify({ error: `알 수 없는 path: "${path}". "quote" 또는 "candle" 을 사용하세요.` }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const finnhubRes = await fetch(url);
    if (!finnhubRes.ok) {
      return new Response(
        JSON.stringify({ error: `Finnhub API 오류: ${finnhubRes.status} ${finnhubRes.statusText}` }),
        { status: finnhubRes.status, headers: CORS_HEADERS }
      );
    }

    const data = await finnhubRes.json();
    return new Response(JSON.stringify(data), { headers: CORS_HEADERS });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
