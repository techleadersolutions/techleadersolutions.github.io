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
  controls.hidden = false;
  update();
})();
