# Media integration checkpoint

The structured catalog now represents all 88 historical archive selections. Live homepage and Media Gallery cards remain static for accessibility, search visibility and resilience without JavaScript. Do not replace these pages with an empty client-rendered mount or overwrite the archive with an older branch.

## Current contracts

- Records, catalog and the featured/series manifest are canonical metadata.
- While the static archives remain, synchronize each approved change into both pages and their ItemList metadata. Run the rendering audit to prevent drift.
- Public topic labels live in `topic`; archival folder labels remain in `folder`. The shared loader supports both, plus series filtering.
- Unknown publication dates remain null; month-only dates remain YYYY-MM. Do not invent a day to enable sorting or rendering.
- Two entries still lack substantive descriptions; three historical dates and one old HTTP source remain unresolved. Complete record coverage is distinct from complete publisher verification.

## Checks before publication

```sh
node media/validate-media.js
node media/test-archive-gaps.js
python3 media/audit-rendering.py
node media/audit-reconciliation.js
```

The first three must pass. Review the reconciliation report separately: it intentionally exits 1 for the remaining historical evidence gaps. Preserve the full URL set and existing featured ordering.

## Remaining integration work

A future data-driven archive must preserve static/no-JavaScript content, existing search, formats, topic membership, chronological ordering, unknown-date labels, link behavior and required metadata. Verify responsive layout, keyboard use and download/contact behavior independently. The current automated checks cover data parity, not every part of that acceptance gate.

The optional `featured-media.js` renderer is defensive and operates only when its mount exists; it is not a replacement for the complete archive. Do not retire the existing rendering merely because the catalog has reached 88 records.

Follow `PUBLISHING_STANDARD.md` for new media, source verification and cross-channel distribution. Historical cleanup does not by itself warrant a duplicate LinkedIn or Facebook promotion.
