-- Governance-only visibility columns for the `event_types` and `observations`
-- row policies (owner_or_visibility). Plaintext by the `visibility`
-- column-name convention so the hub can compare them in SQL.
--
-- Both tables shipped with NO row_policies entry, i.e. ungoverned: any member
-- with access to the app — guests included — could delete another member's
-- observations, or the event types the whole household's history hangs off.
-- An almanac is a shared record, so reads stay open: every row defaults to
-- 'everyone' and nothing about reading changes.
--
-- Writes get the rule the app actually wants, which owner_or_visibility gives
-- when neither write_owner_only nor write_visibility_scoped is set: a child may
-- log observations and edit or delete THEIR OWN, while adults may correct or
-- remove any row. `db_encryption` is off for this app, so these columns are
-- readable in SQL regardless; the convention is kept for consistency.
ALTER TABLE app_almanac__event_types  ADD COLUMN visibility TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_almanac__observations ADD COLUMN visibility TEXT NOT NULL DEFAULT 'everyone';
