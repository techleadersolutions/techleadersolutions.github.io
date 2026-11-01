# Media Publishing Standard

GitHub is the primary site and media source of truth.

## Add a media item
1. Add one small JSON record under `media/items/` using `ADD_MEDIA_TEMPLATE.json`.
2. Use a stable unique `id`, ISO `publication_date` (`YYYY-MM-DD`), canonical HTTPS `source_url`, format, concise summary, topic/folder metadata, and `featured` boolean.
3. Keep archive presentation newest-first by `publication_date`; do not hand-edit ordering into large HTML files.
4. If the item belongs in Latest & Featured or a named series, add its relative record path to `media/featured.json`.
5. Run `node media/validate-media.js` and require the pull-request validation check to pass.
6. Review the branch diff and rendered pages before merge. Never replace or regenerate the large legacy `media.html` destructively.

## Reusable rendering
Structured records and the featured manifest are intended to feed the Media Gallery, Adaptive Enterprise page, John Marcante/profile highlights, and future homepage promotion. Consumers should render from the records rather than duplicate media metadata.

## Reconciliation gate before legacy retirement
Do not retire `media.html` until every legacy/archive item has a corresponding structured record and reconciliation confirms counts, titles, publication dates, formats, canonical source URLs, summaries, newest-first ordering, duplicates, and required metadata. Search, format filters, and topic filtering must be preserved in the data-driven gallery.

## Validation requirements
Validation must reject invalid JSON, missing required fields, duplicate IDs, invalid calendar dates, malformed/non-HTTPS source URLs, non-boolean featured flags, missing/duplicate featured references, and missing core site pages. Site/build checks should remain additive and non-destructive.

## Distribution tracking
After GitHub publication, separately track LinkedIn media/Featured placement and Wix parity. GitHub remains authoritative; Wix is a secondary mirror/backup and should not become a competing source of truth.
