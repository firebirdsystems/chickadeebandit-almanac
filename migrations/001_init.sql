CREATE TABLE IF NOT EXISTS event_types (
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id           TEXT NOT NULL,
  name         TEXT NOT NULL,
  icon         TEXT NOT NULL DEFAULT '📅',
  description  TEXT NOT NULL DEFAULT '',
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  archived_at  TEXT,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS observations (
  household_id  UUID    NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id            TEXT    NOT NULL,
  event_type_id TEXT    NOT NULL,
  observed_date TEXT    NOT NULL,
  year          INTEGER NOT NULL,
  day_of_year   INTEGER NOT NULL,
  notes         TEXT    NOT NULL DEFAULT '',
  logged_by     TEXT    NOT NULL,
  created_at    TEXT    NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE INDEX IF NOT EXISTS observations_event_year
  ON observations (household_id, event_type_id, year);
