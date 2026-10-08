CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ksm TEXT NOT NULL, hospital TEXT NOT NULL, province TEXT NOT NULL,
  fellowship TEXT NOT NULL, funding TEXT,
  period_start DATE, period_end DATE,
  status TEXT NOT NULL CHECK (status IN ('telah lulus','sedang pendidikan','cuti','akan pendidikan')),
  created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_part_owner ON participants(owner_id);
CREATE INDEX IF NOT EXISTS idx_part_status ON participants(status);
