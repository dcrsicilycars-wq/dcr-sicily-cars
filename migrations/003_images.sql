CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  mime TEXT NOT NULL DEFAULT 'image/jpeg',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
