-- Add UTM tracking columns to leadgen1 table
-- Run this script in your Supabase SQL editor

ALTER TABLE leadgen1 
ADD COLUMN utm_source TEXT,
ADD COLUMN utm_medium TEXT,
ADD COLUMN utm_campaign TEXT,
ADD COLUMN utm_content TEXT;

-- Add indexes for better query performance if you'll be searching by UTM parameters
CREATE INDEX idx_leadgen1_utm_source ON leadgen1(utm_source);
CREATE INDEX idx_leadgen1_utm_medium ON leadgen1(utm_medium);
CREATE INDEX idx_leadgen1_utm_campaign ON leadgen1(utm_campaign);
CREATE INDEX idx_leadgen1_utm_content ON leadgen1(utm_content);
