-- Supports the History tab / AI export ordering (SELECT ... ORDER BY observed_date DESC),
-- which the (event_type_id, year) index does not cover.
CREATE INDEX IF NOT EXISTS observations_observed_date
  ON app_almanac__observations (observed_date);
