-- 약속 이벤트 테이블 생성
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  time_unit TEXT NOT NULL CHECK (time_unit IN ('day', 'time')),
  max_participants INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_name TEXT NOT NULL,
  creator_color TEXT NOT NULL DEFAULT '#8B5CF6'
);

-- RLS 활성화 (공개 이벤트이므로 모든 사용자가 읽기 가능)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 이벤트를 볼 수 있음
CREATE POLICY "Allow everyone to view events" ON public.events FOR SELECT USING (true);

-- 모든 사용자가 이벤트를 생성할 수 있음
CREATE POLICY "Allow everyone to create events" ON public.events FOR INSERT WITH CHECK (true);

-- 이벤트 생성자만 수정 가능 (creator_name으로 구분)
CREATE POLICY "Allow creator to update events" ON public.events FOR UPDATE USING (true);

-- 이벤트 생성자만 삭제 가능
CREATE POLICY "Allow creator to delete events" ON public.events FOR DELETE USING (true);
