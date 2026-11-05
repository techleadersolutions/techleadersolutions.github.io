# Adaptive Enterprise Article 3: release and LinkedIn Featured checklist

Status: approved for LinkedIn Featured by John Marcante; publication and placement not yet verified (2026-11-04).

## Release gate
- Verify publisher's final article title, full publication date, canonical HTTPS URL, summary and authors. Do not invent metadata or treat related posts as the published article.
- Check for an existing matching media ID or canonical URL before creating one new record in media/items/.
- Update media/catalog.json and media/featured.json (Latest & Featured and Adaptive Enterprise series), keeping newest-first ordering and both existing podcasts discoverable.
- Validate JSON, IDs, dates, URLs, manifest references and site/build integrity on a branch and review diff/PR before merge. Preserve legacy media.html, downloads, SEO, and all live pages.
- Verify gallery/series/profile/homepage placements once data-driven rendering is integrated. Do not claim those surfaces are live until tested.

## LinkedIn Featured: approved, not yet placed
- John approved featuring Article 3 on LinkedIn when published.
- Prepare the final Featured link using the canonical published article URL and its verified title.
- Check John's actual LinkedIn Featured section and avoid duplicates; public search does not prove Featured placement.
- Publish the Featured update using an authorized LinkedIn workflow, then verify its presence. If unavailable, provide John the direct link and exact steps for manual placement.
- Recommend a coordinated LinkedIn post/repost/comment and a Technology Leadership Solutions Facebook post tagging John; request approval for public posts before publishing.

## Featured editorial rule
Feature selective, durable material of clear board/CEO/CIO relevance, not every release. Review older Featured items for replacement rather than accumulating too many entries.

## Audit follow-up
- PR #14 reconciliation audit is still draft; run and resolve differences before retiring media.html.
- Track Wix parity only after GitHub publication and validation.
