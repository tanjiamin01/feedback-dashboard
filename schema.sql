CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  text TEXT NOT NULL,
  sentiment TEXT,
  category TEXT,
  timestamp TEXT NOT NULL
);