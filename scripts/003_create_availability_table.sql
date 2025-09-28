-- 가능한 날짜/시간 테이블 생성
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'unavailable', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, date_time)
);

-- RLS 활성화
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 가용성을 볼 수 있음
CREATE POLICY "Allow everyone to view availability" ON public.availability FOR SELECT USING (true);

-- 모든 사용자가 가용성을 생성할 수 있음
CREATE POLICY "Allow everyone to create availability" ON public.availability FOR INSERT WITH CHECK (true);

-- 모든 사용자가 가용성을 수정할 수 있음
CREATE POLICY "Allow everyone to update availability" ON public.availability FOR UPDATE USING (true);

-- 모든 사용자가 가용성을 삭제할 수 있음
CREATE POLICY "Allow everyone to delete availability" ON public.availability FOR DELETE USING (true);
