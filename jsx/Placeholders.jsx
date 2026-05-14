// 나머지 페이지들의 뼈대 — 필요에 따라 구현하세요

export function Portfolio() {
  return (
    <div className="card">
      <h1 className="text-xl font-semibold text-white mb-2">포트폴리오</h1>
      <p className="text-gray-500 text-sm">보유 종목 목록과 비중 차트가 여기에 표시됩니다.</p>
    </div>
  )
}

export function AddStock() {
  return (
    <div className="card max-w-lg">
      <h1 className="text-xl font-semibold text-white mb-2">종목 추가</h1>
      <p className="text-gray-500 text-sm">종목 검색 및 매수 기록 폼이 여기에 표시됩니다.</p>
    </div>
  )
}

export function Analytics() {
  return (
    <div className="card">
      <h1 className="text-xl font-semibold text-white mb-2">분석</h1>
      <p className="text-gray-500 text-sm">수익률 추이, 섹터 비중 등 분석 차트가 여기에 표시됩니다.</p>
    </div>
  )
}

export function SettingsPage() {
  return (
    <div className="card max-w-lg">
      <h1 className="text-xl font-semibold text-white mb-2">설정</h1>
      <p className="text-gray-500 text-sm">프로필, 알림, 연동 설정이 여기에 표시됩니다.</p>
    </div>
  )
}
