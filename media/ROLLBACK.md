# Rollback

The legacy production media archive is not modified by the new data files. If the presentation layer is later integrated and needs to be removed, delete only the three integration hooks from `media.html`: the featured stylesheet link, the `#featured-media` mount element, and the featured renderer script tag. The existing archive remains available.
