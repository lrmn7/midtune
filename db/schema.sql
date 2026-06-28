-- Midtune D1 Schema
-- Run this migration to set up the database tables.

CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  release_date TEXT NOT NULL,           -- ISO date, e.g. "2024-08-27"
  bpm INTEGER,
  duration TEXT,                         -- "3:42"
  duration_sec INTEGER,
  moods TEXT,                            -- JSON array, e.g. '["melancholy","nostalgic"]'
  tuning TEXT,                           -- Musical key, e.g. "G", "Am"
  audio_url TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS download_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id TEXT NOT NULL,
  ip_hash TEXT,                          -- SHA-256 hash of IP for basic abuse prevention
  user_agent_hash TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

-- Index for rate limiting checks
CREATE INDEX IF NOT EXISTS idx_download_events_track_ip
  ON download_events(track_id, ip_hash, created_at);
