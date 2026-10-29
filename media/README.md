# Media update system

This directory is the incremental source for new and featured media. It is intentionally separate from the legacy `media_library.csv` and hand-maintained `media.html` so new media can be introduced without rewriting either large production file.

## Safe workflow

1. Create one JSON record under `media/items/` for each new media item.
2. Set `featured` only when the item should receive prominent treatment.
3. Add or remove the record path in `media/featured.json` to control the Latest & Featured area and series groupings.
4. Make changes on a branch and review them through a pull request before merging to `main`.
5. Do not directly overwrite `media_library.csv`, `media.html`, or `index.html` merely to add a media item.

## Record fields

Each record contains an ID, title, publication date, format, topic folder, source URL, featured flag, optional series metadata, and a short summary.

## Migration approach

Existing production media remains untouched. The new system starts with new/featured items and can be adopted by the presentation layer incrementally. This avoids a high-risk one-time migration of the existing archive.
