CREATE TABLE IF NOT EXISTS screening_results (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('adult', 'child')),
  answers_json TEXT NOT NULL,
  domain_scores_json TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  risk_title TEXT NOT NULL,
  consent_agreed INTEGER NOT NULL CHECK (consent_agreed IN (0, 1)),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_screening_results_created_at
  ON screening_results (created_at);

CREATE INDEX IF NOT EXISTS idx_screening_results_test_type
  ON screening_results (test_type);

CREATE INDEX IF NOT EXISTS idx_screening_results_risk_level
  ON screening_results (risk_level);
