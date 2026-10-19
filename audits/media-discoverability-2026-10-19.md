# Media discoverability audit — October 19, 2026

Base: 29d4232ad20d01b07880d020648067a96a23a476. Deployed index.html, media.html, media_library.csv and sitemap.xml matched repository bytes at this commit.

## Proposed change
Add the existing Bain / Net Promoter System video “For Customers, Critical Moments Count Most” to both visible archives, their ItemList metadata and the CSV. Add its direct source URL to the existing llms.txt reference. Update only the homepage and media sitemap dates.

Source: https://www.netpromotersystem.com/insights/for-customers-critical-moments-count-the-most-nps-video/
Publisher page verified October 19, 2026: title; by Fred Reichheld; September 10, 2012; identifies Vanguard’s John Marcante and describes testing customer service processes firsthand. This is older content already flagged on October 18, not a new release. No video duration or unsupported transcript assertions added.

## Validation
- Live baseline: 82 unique entries. Proposed: 83 unique entries, identical URL sets in homepage/media ItemLists and CSV.
- All 82 original card strings and embedded image data preserved byte for byte. Existing design, featured podcast and direct YouTube link retained.
- All ItemList URLs have crawlable HTML anchors; no Untitled or href=# links inside archive cards. Homepage logo uses href=# as navigation, not a media placeholder.
- Valid JSON-LD and sitemap XML; both page canonical tags retained.
- Three previously flagged YouTube videos (-heFVabcAJ4, nJW0i-tfzSM, elRJFfgXVsg) already represented; no duplicate cards added.
- Public fresh searches under John Marcante, John T. Marcante, Technology Leadership Solutions and Barry O’Reilly found no additional verified full release beyond the already cataloged October 13 podcast and October 6 article. Promotional LinkedIn clips for that episode were not treated as separate releases.

## Remaining work and limits
- Review this draft before publication. No main branch deployment performed.
- Older Enterprisers Project items previously found on LinkedIn still require publisher-level reconciliation; one Vanguard YouTube video remains unverified.
- LinkedIn duplicate/date/Featured work belongs to the separate interactive audit; no LinkedIn edits performed here.
- Search results still expose a Wix website in company-related queries. Verify the Technology Leadership Solutions company-page website field in the LinkedIn audit before suggesting a correction; search snippets alone do not establish current account settings.
- No Search Console evidence: indexing, rankings and search snippets have not been verified. Visitor reporting remains separate.
