-- Schema for One Piece Scraper Database

-- Table for tracking processed chapters
CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  url TEXT NOT NULL,
  processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chunks_count INTEGER NOT NULL
);

-- Table for storing chapter content sections
CREATE TABLE IF NOT EXISTS chapter_sections (
  id INTEGER PRIMARY KEY,
  chapter_id INTEGER NOT NULL,
  section_name TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapter_sections_chapter_id ON chapter_sections(chapter_id); 