-- PirateGPT Chat Database Schema
-- This schema defines the structure for storing chat data in the pirategpt-chat-db

-- Users table to store user information
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_active_at INTEGER NOT NULL DEFAULT (unixepoch()),
  preferences TEXT
);

-- Conversations table to store chat sessions
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  is_active BOOLEAN NOT NULL DEFAULT true,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table to store individual chat messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  vector_search_query TEXT,
  chapters_referenced TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- References table to track which manga content was referenced
CREATE TABLE manga_references (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  relevance_score REAL,
  content_snippet TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_manga_references_message_id ON manga_references(message_id); 