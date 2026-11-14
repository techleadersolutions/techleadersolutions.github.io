/* Filter the preserved, server-rendered archive without fetching or replacing cards. */
(() => {
  const controls = document.querySelector('[data-gallery-controls]');
  if (!controls) return;
  const search = controls.querySelector('input');
  const format = controls.querySelector('select');
  const cards = [...document.querySelectorAll('.media-grid .media-item')];
  const status = document.getElementById('gallery-status');
  const empty = document.getElementById('gallery-empty');
  const entries = cards.map(card => ({
    card,
    text: card.textContent.toLocaleLowerCase(),
    format: card.dataset.format || (card.querySelector('p')?.textContent || '').split('·')[0].trim()
  }));
  function update() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const entry of entries) {
      const visible = (!format.value || entry.format === format.value) && terms.every(term => entry.text.includes(term));
      entry.card.hidden = !visible;
      if (visible) count++;
    }
    status.textContent = `Showing ${count} of ${cards.length} media selections`;
    empty.hidden = count !== 0;
  }
  search.addEventListener('input', update);
  format.addEventListener('change', update);
  controls.querySelector('button').addEventListener('click', () => {
    search.value = '';
    format.value = '';
    update();
    search.focus();
  });
  for (const shelf of document.querySelectorAll('[data-media-shelf]')) {
    const track = shelf.querySelector('.shelf-track');
    const limit = Number(shelf.dataset.limit);
    const matches = entries.filter(entry => entry.format === shelf.dataset.mediaShelf);
    const selection = limit ? matches.slice(0, limit) : matches;
    if (!selection.length) continue;
    for (const { card } of selection) {
      const item = document.createElement('li');
      const preview = card.cloneNode(true);
      preview.hidden = false;
      preview.removeAttribute('id');
      preview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      item.append(preview);
      track.append(item);
    }
    const previous = shelf.querySelector('[data-step="-1"]');
    const next = shelf.querySelector('[data-step="1"]');
    function updateArrows() {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function step(direction) {
      const stride = track.children.length > 1
        ? track.children[1].offsetLeft - track.children[0].offsetLeft
        : track.clientWidth;
      track.scrollBy({ left: direction * stride, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    shelf.querySelector('[data-show-format]').addEventListener('click', () => {
      search.value = '';
      format.value = shelf.dataset.mediaShelf;
      update();
      document.getElementById('media-archive').focus({ preventScroll: true });
    });
    shelf.hidden = false;
    updateArrows();
  }
  controls.hidden = false;
  update();
})();
