-- Chạy trong Supabase Dashboard → SQL Editor
-- Tạo bảng lưu tiến trình game và bật RLS (Row Level Security)

-- Bảng game_saves: mỗi user (auth.users) có một dòng lưu tiến trình
CREATE TABLE IF NOT EXISTS public.game_saves (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  save_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bật Row Level Security: user chỉ đọc/ghi dòng của mình
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ SELECT được dòng có user_id = auth.uid()
CREATE POLICY "User can read own save"
  ON public.game_saves FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: user chỉ INSERT được dòng với user_id = auth.uid()
CREATE POLICY "User can insert own save"
  ON public.game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: user chỉ UPDATE được dòng của mình
CREATE POLICY "User can update own save"
  ON public.game_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
