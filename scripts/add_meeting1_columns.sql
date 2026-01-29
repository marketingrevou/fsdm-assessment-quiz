-- Migration: Add Meeting 1 quiz answer columns to leadgen1 table
-- Run this SQL in your Supabase SQL Editor

-- Add columns for Meeting 1 quiz answers
ALTER TABLE leadgen1
ADD COLUMN IF NOT EXISTS m1q1_answer TEXT,
ADD COLUMN IF NOT EXISTS m1q2_answer TEXT,
ADD COLUMN IF NOT EXISTS m1q3_completed BOOLEAN DEFAULT FALSE;

-- Add comments to document the columns
COMMENT ON COLUMN leadgen1.m1q1_answer IS 'Answer to Meeting 1 Question 1';
COMMENT ON COLUMN leadgen1.m1q2_answer IS 'Answer to Meeting 1 Question 2';
COMMENT ON COLUMN leadgen1.m1q3_completed IS 'Whether Meeting 1 Question 3 (drag and drop) was completed';
