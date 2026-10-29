# Ongoing media publishing

For each new publication:

1. Verify the public source and publication date.
2. Copy `ADD_MEDIA_TEMPLATE.json` to a dated file under `media/items/` and populate it.
3. If the item should be promoted, add its relative path to `featured.json`.
4. Open a branch/pull request and let the media validation check run.
5. Review the diff and source link, then merge.

This keeps normal media changes small and avoids editing the large production archive by hand.
