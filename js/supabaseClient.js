import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // ✅ warn만 하고 throw하지 않음 → 빌드 실패 방지
  console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다. DB 기능이 비활성화됩니다.')
}

// env가 없으면 null 반환 → 앱은 로컬 state로 동작
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
