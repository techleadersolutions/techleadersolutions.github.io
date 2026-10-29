(async function () {
  const mount = document.getElementById('featured-media');
  if (!mount) return;
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  try {
    const manifest = await (await fetch('featured.json', {cache:'no-store'})).json();
    const paths = (manifest.featured_items || []).slice(0, manifest.display?.max_items || 4);
    const items = await Promise.all(paths.map(async p => (await fetch(p, {cache:'no-store'})).json()));
    mount.innerHTML = `<section class="featured-media-block"><div class="featured-media-header"><p class="featured-media-kicker">New & noteworthy</p><h2>${esc(manifest.display?.heading || 'Latest & Featured')}</h2></div><div class="featured-media-grid">${items.map(item => `<article class="featured-media-card"><p class="featured-media-meta">${esc(item.series || item.format)}${item.series_episode ? ` · ${esc(item.series_episode)}` : ''} · ${esc(item.publication_date)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><a href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">Listen / read →</a></article>`).join('')}</div></section>`;
  } catch (e) { console.warn(e); mount.hidden = true; }
})();
