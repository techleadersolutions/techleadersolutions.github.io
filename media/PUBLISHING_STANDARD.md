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


## Standard release checklist for every new media item

1. Verify the actual publication, canonical source, date, title, author/guest attribution, format and series position. Distinguish a launch post from the article itself and publication time from observation/crawl time.
2. Check records, archive and open PRs for duplicates. Update the structured record, catalog and featured/series manifest first. While legacy pages remain, update their visible cards, structured metadata and CSV additively; preserve every working older item and its filters.
3. Validate in a focused branch/PR: media validator, metadata, links, ordering, duplicate detection, preservation of older cards, and relevant desktop/mobile rendering. Record any unverified aspect. Merge/publish within the current authorization, then verify the live release separately.
4. Verify the Adaptive Enterprise page, Media Gallery, homepage and John Marcante profile where relevant. Keep agreed YouTube destinations for video podcasts.
5. Present exact LinkedIn promotion copy for John's review: post, repost or comment as appropriate, plus a Publications/Featured placement decision. Avoid duplicate promotion and never treat permission for one post as recurring social-publishing permission.
6. Prepare the Technology Leadership Solutions Facebook copy linking the verified item and tagging/linking John. Resolve the correct person/page and confirm publication separately; record approval requirements.
7. Mirror approved/live metadata on the existing Wix backup after GitHub is authoritative. Preserve the existing site's design and unrelated saved work; verify publication rather than only saving a draft.
8. Update the Website Project Plan and media tracker with exact source/publication URL, PR/deployment evidence, social and Wix status, unresolved steps and next action. Mark each surface separately as prepared, approved, published and verified.
9. Assess public discussion and due engagement windows near24h,72h and7days where actual observations exist. Separate reactions, comments and reposts; no inferred impressions, rates or equivalent-age comparisons without inputs. Propose useful replies for review.

Keep using the existing website/media and mention-monitoring tasks; do not create a duplicate release automation. The next release inherits this checklist, with platform-specific review and user preferences preserved.
