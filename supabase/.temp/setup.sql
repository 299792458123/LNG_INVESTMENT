-- ══════════════════════════════════════════════════════
--  Supabase SQL Editor에서 이 파일 전체를 실행하세요
--  Dashboard → SQL Editor → New query → 붙여넣기 → Run
-- ══════════════════════════════════════════════════════

-- 1. 보유 종목 테이블
create table if not exists public.holdings (
  id         uuid        primary key default gen_random_uuid(),
  ticker     text        not null,
  buy_price  numeric     not null,
  quantity   numeric     not null,
  created_at timestamptz not null default now()
);

-- 2. 투표 테이블
create table if not exists public.votes (
  ticker     text primary key,
  buy_count  int  not null default 0,
  hold_count int  not null default 0,
  sell_count int  not null default 0
);

-- 3. Row Level Security 활성화 (개인 프로젝트: anon 키로 전체 허용)
alter table public.holdings enable row level security;
alter table public.votes    enable row level security;

-- 기존 정책 삭제 후 재생성 (중복 실행 대비)
drop policy if exists "public_all_holdings" on public.holdings;
drop policy if exists "public_all_votes"    on public.votes;

create policy "public_all_holdings" on public.holdings
  for all using (true) with check (true);

create policy "public_all_votes" on public.votes
  for all using (true) with check (true);

-- 확인
select 'holdings' as table_name, count(*) from public.holdings
union all
select 'votes',                  count(*) from public.votes;
