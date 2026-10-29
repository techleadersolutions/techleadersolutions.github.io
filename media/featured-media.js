/* Incremental featured-media renderer.
   Safe by design: it only renders when a page contains #featured-media.
   Existing media markup remains untouched. */
(async function () {
  const mount = document.getElementById('featured-media');
  if (!mount) return;

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));

  try {
    const manifestResponse = await fetch('media/featured.json', { cache: 'no-store' });
    if (!manifestResponse.ok) throw new Error('Featured media manifest unavailable');
    const manifest = await manifestResponse.json();
    const paths = (manifest.featured_items || []).slice(0, manifest.display?.max_items || 4);
    const items = await Promise.all(paths.map(async path => {
      const response = await fetch(`media/${path}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Media record unavailable: ${path}`);
      return response.json();
    }));

    mount.innerHTML = `
      <section class="featured-media-block" aria-labelledby="featured-media-heading">
        <div class="featured-media-header">
          <p class="featured-media-kicker">New & noteworthy</p>
          <h2 id="featured-media-heading">${escapeHtml(manifest.display?.heading || 'Latest & Featured')}</h2>
        </div>
        <div class="featured-media-grid">
          ${items.map(item => `
            <article class="featured-media-card">
              <p class="featured-media-meta">${escapeHtml(item.series || item.format)}${item.series_episode ? ` · ${escapeHtml(item.series_episode)}` : ''} · ${escapeHtml(item.publication_date)}</p>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.summary)}</p>
              <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener noreferrer">Listen / read →</a>
            </article>`).join('')}
        </div>
      </section>`;
  } catch (error) {
    console.warn('Featured media could not be rendered.', error);
    mount.hidden = true;
  }
})();
