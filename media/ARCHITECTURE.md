# Media architecture

GitHub is the canonical website and media source. `media/items/*.json` holds all 88 archive records; `media/catalog.json` indexes them newest-first. `media/featured.json` controls promotional ordering and Adaptive Enterprise series groupings.

`topic` preserves the public homepage filters: Board governance, Leadership & culture, and Strategy & transformation. `folder` retains the separate archival classification. `media/media-data.js` loads, sorts and filters the records and supports both classifications and series labels.

Historical dates preserve their actual precision: a full ISO day, a documented month, or null with explicit unknown precision. The original unresolved HTTP archive link is retained and flagged. These evidence gaps are not silently repaired or treated as verified sources.

The live homepage and Media Gallery retain static, searchable archive cards for all 88 items. Both pages and their ItemList metadata match the catalog for titles, dates, formats, URLs, ordering and 86 substantive descriptions. Two summaries remain unresolved. The pages remain available without JavaScript.

`media/featured-media.js` is a separate, optional incremental renderer that acts only when `#featured-media` exists. It does not replace the static archive.

## Verification

- `node media/validate-media.js`: schema, topics, documented historical exceptions, catalog ordering and manifest references.
- `node media/test-archive-gaps.js`: rejected invalid evidence, actual catalog loading/search, featured data and topic-filter membership against existing homepage cards.
- `python3 media/audit-rendering.py`: both static archives and ItemList metadata compared with canonical records.
- `node media/audit-reconciliation.js`: historical CSV coverage and unresolved source/date evidence. Its nonzero exit remains expected while three date gaps and one legacy link remain unresolved, even though record coverage is 88/88.

CI runs the first three checks. Data parity does not establish phone/tablet visual quality, external link availability, download behavior or contact delivery. Those require separate verification before any retirement of legacy rendering.
