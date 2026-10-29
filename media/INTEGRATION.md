# Production integration plan

The new media system is additive. The existing `media.html`, `index.html`, and `media_library.csv` remain unchanged while the new structure is validated.

## Recommended integration

After branch review, make one small integration change to `media.html`:

- load `media/featured-media.css` in the document head;
- add `<div id="featured-media"></div>` immediately above the existing media archive/list;
- load `media/featured-media.js` near the end of the document.

The renderer is defensive: if the mount point is absent, it does nothing; if a media record cannot load, the new block hides itself and the existing archive remains available.

## Future media updates

A normal media addition should require only:

1. one new file under `media/items/`;
2. an optional small edit to `media/featured.json` if the item should be highlighted or grouped into a series.

No routine media addition should require rewriting `media.html`, `index.html`, or `media_library.csv`.

## Rollback

The production integration can be rolled back by removing the stylesheet link, mount div, and script tag. The legacy archive remains untouched throughout.
