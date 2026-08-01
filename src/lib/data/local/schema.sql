-- Phase 1 SQLite Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('student', 'center_staff', 'superadmin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_exam_quota INTEGER NOT NULL,
  price REAL NOT NULL,
  overage_fee_per_exam REAL, -- if null, hard block
  features TEXT NOT NULL -- JSON
);

CREATE TABLE IF NOT EXISTS centers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS center_staff (
  id TEXT PRIMARY KEY,
  center_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'test_creator', 'evaluator')),
  permissions TEXT NOT NULL, -- JSON array
  FOREIGN KEY (center_id) REFERENCES centers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS student_credits (
  user_id TEXT PRIMARY KEY,
  free_remaining INTEGER NOT NULL DEFAULT 0,
  paid_remaining INTEGER NOT NULL DEFAULT 0,
  last_purchase_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  owner_center_id TEXT, -- null = shared/global bank
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Academic', 'General')),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_center_id) REFERENCES centers(id)
);

CREATE TABLE IF NOT EXISTS test_modules (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('listening', 'reading', 'writing')),
  config TEXT NOT NULL, -- JSON
  questions TEXT NOT NULL, -- JSON
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exam_instances (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  center_id TEXT NOT NULL,
  link_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  window_start DATETIME,
  window_end DATETIME,
  attempt_limit INTEGER,
  proctoring_enabled INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id),
  FOREIGN KEY (center_id) REFERENCES centers(id)
);

CREATE TABLE IF NOT EXISTS exam_enrollments (
  id TEXT PRIMARY KEY,
  exam_instance_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  roll_number TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_instance_id) REFERENCES exam_instances(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (exam_instance_id, student_id)
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('self_serve', 'center_exam')),
  exam_enrollment_id TEXT,
  test_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'submitted', 'grading', 'graded', 'published')),
  started_at DATETIME,
  submitted_at DATETIME,
  answers TEXT, -- JSON
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (exam_enrollment_id) REFERENCES exam_enrollments(id),
  FOREIGN KEY (test_id) REFERENCES tests(id)
);

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('listening', 'reading', 'writing')),
  criteria TEXT NOT NULL, -- JSON
  band REAL NOT NULL,
  scored_by TEXT,
  comments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES attempts(id),
  FOREIGN KEY (scored_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS proctoring_events (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  meta TEXT NOT NULL, -- JSON
  FOREIGN KEY (attempt_id) REFERENCES attempts(id)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('signup_bonus', 'purchase', 'consumed', 'refund')),
  attempt_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (attempt_id) REFERENCES attempts(id)
);

-- Init Superadmin
-- Password is 'password' hashed with bcrypt
INSERT OR IGNORE INTO users (id, email, password_hash, account_type) VALUES (
  'superadmin-1', 'admin@platform.com', '$2b$10$Hlvwz.c5GcriBHZvsxzSmOJU.muDa63Fhi0vGpsUjbZE31IwcVo/2', 'superadmin'
);
