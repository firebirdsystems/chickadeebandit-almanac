SELECT
  o.id,
  o.event_type_id,
  e.name  AS event_name,
  e.icon  AS event_icon,
  o.observed_date,
  o.year,
  o.day_of_year,
  o.notes,
  o.logged_by,
  o.created_at
FROM observations o
JOIN event_types e
  ON e.id = o.event_type_id
  AND e.household_id = o.household_id
WHERE o.household_id = current_setting('app.household_id', true)::uuid
ORDER BY o.observed_date DESC
LIMIT 500
