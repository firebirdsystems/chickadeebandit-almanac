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
FROM app_almanac__observations o
JOIN app_almanac__event_types e
  ON e.id = o.event_type_id
ORDER BY o.observed_date DESC
LIMIT 500
