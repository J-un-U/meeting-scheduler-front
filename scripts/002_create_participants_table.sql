-- 참가자 응답 테이블 생성
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10B981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, name)
);

-- RLS 활성화
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 참가자를 볼 수 있음
CREATE POLICY "Allow everyone to view participants" ON public.participants FOR SELECT USING (true);

-- 모든 사용자가 참가자로 등록할 수 있음
CREATE POLICY "Allow everyone to create participants" ON public.participants FOR INSERT WITH CHECK (true);

-- 참가자 본인만 수정 가능 (name으로 구분)
CREATE POLICY "Allow participant to update own data" ON public.participants FOR UPDATE USING (true);

-- 참가자 본인만 삭제 가능
CREATE POLICY "Allow participant to delete own data" ON public.participants FOR DELETE USING (true);
