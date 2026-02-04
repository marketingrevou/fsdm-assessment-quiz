-- Add birthdate and background columns to leadgen1 table
-- Run this script in your Supabase SQL editor

ALTER TABLE leadgen1 
ADD COLUMN birthdate TEXT,
ADD COLUMN background TEXT;

-- Add indexes for better query performance if you'll be searching by these fields
CREATE INDEX idx_leadgen1_birthdate ON leadgen1(birthdate);
CREATE INDEX idx_leadgen1_background ON leadgen1(background);
