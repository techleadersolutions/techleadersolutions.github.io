/* Reusable structured-media loader. Presentation layers should consume this module rather than duplicate media metadata. */
(function (global) {
  const ROOT = 'media/';
  async function json(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Media fetch failed: ${url} (${response.status})`);
    return response.json();
  }
  async function loadCatalog(base = ROOT) {
    const catalog = await json(`${base}catalog.json`);
    const items = await Promise.all((catalog.items || []).map(ref => json(`${base}${ref}`)));
    return items.sort((a, b) => b.publication_date.localeCompare(a.publication_date));
  }
  async function loadFeatured(base = ROOT) {
    const manifest = await json(`${base}featured.json`);
    const loadRefs = refs => Promise.all((refs || []).map(ref => json(`${base}${ref}`)));
    return {
      manifest,
      featured: await loadRefs(manifest.featured_items),
      series: await Promise.all((manifest.series || []).map(async s => ({ ...s, media: await loadRefs(s.items) })))
    };
  }
  function filter(items, { format = '', topic = '', search = '' } = {}) {
    const q = search.trim().toLowerCase();
    return items.filter(item =>
      (!format || item.format === format) &&
      (!topic || item.folder === topic || item.series === topic) &&
      (!q || [item.title, item.summary, item.folder, item.series, item.format].filter(Boolean).join(' ').toLowerCase().includes(q))
    );
  }
  global.TLSMedia = { loadCatalog, loadFeatured, filter };
})(window);
