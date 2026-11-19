CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  login         TEXT NOT NULL,
  email         TEXT NOT NULL,
  provider      TEXT NOT NULL CHECK (provider IN ('github', 'google')),
  avatar        TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at    TEXT NOT NULL,
  last_login_at TEXT NOT NULL,
  UNIQUE (provider, email)
);

CREATE INDEX idx_users_created_at ON users (created_at);
