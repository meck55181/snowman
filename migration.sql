-- Migration script for updating responses table schema
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns for Q1 (올해의 낱말)
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q1_word TEXT,
ADD COLUMN IF NOT EXISTS q1_word_desc TEXT;

-- Step 2: Add new columns for Q2 (올해의 깨달음)
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q2_insight TEXT,
ADD COLUMN IF NOT EXISTS q2_insight_desc TEXT;

-- Step 3: Add new columns for Q3 (올해의 콘텐츠)
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q3_content TEXT,
ADD COLUMN IF NOT EXISTS q3_content_desc TEXT;

-- Step 4: Add new columns for Q4 (내년 1월 1일에 들을 노래)
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q4_song_reason TEXT;

-- Step 5: Add new columns for Q5 (내년의 다짐)
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q5_resolution TEXT;

-- Step 6: Add new column for final message
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS q_final_message TEXT;

-- Step 7: Migrate existing data from old columns to new columns
UPDATE responses
SET 
  q1_word = COALESCE(word, ''),
  q1_word_desc = COALESCE(story, ''),
  q2_insight = COALESCE(q2_insight, memory, ''),
  q2_insight_desc = COALESCE(q2_insight_desc, ''),
  q3_content = COALESCE(q3_content, city, ''),
  q3_content_desc = COALESCE(q3_content_desc, city_message, ''),
  q5_resolution = COALESCE(q5_resolution, ''),
  q_final_message = COALESCE(final_message, '')
WHERE 
  q1_word IS NULL 
  OR q1_word_desc IS NULL 
  OR q_final_message IS NULL;

-- Step 8: Drop old columns
ALTER TABLE responses DROP COLUMN IF EXISTS word;
ALTER TABLE responses DROP COLUMN IF EXISTS story;
ALTER TABLE responses DROP COLUMN IF EXISTS memory;
ALTER TABLE responses DROP COLUMN IF EXISTS city;
ALTER TABLE responses DROP COLUMN IF EXISTS city_message;
ALTER TABLE responses DROP COLUMN IF EXISTS final_message;

-- Step 9: Verify the changes
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'responses' 
-- ORDER BY ordinal_position;
