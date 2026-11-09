"""Compare preserved static archives and search metadata with the canonical catalog.
Run: python3 media/audit-rendering.py. This does not assert visual/device QA.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = json.loads((ROOT / 'media/catalog.json').read_text())
ITEMS = [json.loads((ROOT / 'media' / ref).read_text()) for ref in CATALOG['items']]
BY_URL = {item['source_url']: item for item in ITEMS}
errors = []
report = {}


def text(markup):
    return html.unescape(re.sub(r'<[^>]+>', '', markup)).strip()


def attr(markup, name):
    match = re.search(r'\b' + re.escape(name) + r'="([^"]*)"', markup)
    return html.unescape(match.group(1)) if match else None


def lists(value):
    if isinstance(value, dict):
        if value.get('@type') == 'ItemList':
            yield value
        for child in value.values():
            yield from lists(child)
    elif isinstance(value, list):
        for child in value:
            yield from lists(child)


for page, marker, card_class in [
    ('index.html', '<div id="archive-grid">', 'archive-card'),
    ('media.html', '<div class="media-grid">', 'media-item'),
]:
    source = (ROOT / page).read_text()
    fragment = source.split(marker, 1)[1]
    cards = re.findall(r'<article class="' + card_class + r'"[^>]*>.*?</article>', fragment, re.S)
    urls = [attr(card, 'href') for card in cards]
    if len(urls) != len(set(urls)) or set(urls) != set(BY_URL):
        errors.append(f'{page}: archive URL coverage or uniqueness mismatch')
    missing_summaries = []
    dates = []
    for card, url in zip(cards, urls):
        item = BY_URL.get(url)
        if not item:
            continue
        title = text(re.search(r'<h3>(.*?)</h3>', card, re.S).group(1))
        if title != item['title']:
            errors.append(f'{page}: title differs for {item["id"]}')
        date = attr(card.split('>', 1)[0], 'data-date')
        if date is None:
            date = attr(card, 'datetime')
        if date is None:
            paragraphs = re.findall(r'<p(?: [^>]*)?>(.*?)</p>', card, re.S)
            date = next((text(p) for p in paragraphs if re.fullmatch(r'\d{4}-\d{2}(?:-\d{2})?', text(p))), '')
        if date != (item['publication_date'] or ''):
            errors.append(f'{page}: date differs for {item["id"]}: {date!r}')
        dates.append(date)
        fmt = attr(card.split('>', 1)[0], 'data-format')
        if fmt is None:
            first_p = re.search(r'<p(?: [^>]*)?>(.*?)</p>', card, re.S)
            fmt = text(first_p.group(1)).split('·')[0].strip() if first_p else ''
        if fmt.rstrip('s').lower() != item['format'].lower():
            errors.append(f'{page}: format differs for {item["id"]}')
        if page == 'index.html' and attr(card.split('>', 1)[0], 'data-topic') != item.get('topic'):
            errors.append(f'{page}: topic filter differs for {item["id"]}')
        summary = re.search(r'<p class="(?:media-description|archive-summary)">(.*?)</p>', card, re.S)
        if summary:
            if text(summary.group(1)) != item['summary']:
                errors.append(f'{page}: summary differs for {item["id"]}')
        elif item.get('provenance', {}).get('summary_basis') == 'archive_title_only':
            missing_summaries.append(item['id'])
        else:
            errors.append(f'{page}: missing substantive summary for {item["id"]}')
    if dates != sorted(dates, reverse=True):
        errors.append(f'{page}: dates are not newest-first')
    item_lists = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S):
        item_lists.extend(lists(json.loads(block)))
    if len(item_lists) != 1:
        errors.append(f'{page}: expected one archive ItemList')
    else:
        entries = item_lists[0]['itemListElement']
        if [entry['item']['url'] for entry in entries] != urls:
            errors.append(f'{page}: search metadata URL/order differs from visible archive')
        for pos, entry in enumerate(entries, 1):
            data = entry['item']; item = BY_URL.get(data['url'])
            if not item:
                continue
            if entry.get('position') != pos or html.unescape(data['name']) != item['title']:
                errors.append(f'{page}: search metadata title/position differs for {item["id"]}')
            if data.get('datePublished', '') != (item['publication_date'] or ''):
                errors.append(f'{page}: search metadata date differs for {item["id"]}')
            if 'description' in data and data['description'] != item['summary']:
                errors.append(f'{page}: search metadata description differs for {item["id"]}')
    report[page] = {'cards': len(cards), 'substantive_summaries': len(cards)-len(missing_summaries), 'unresolved_summaries': missing_summaries}
print(json.dumps({'pages': report, 'errors': errors}, indent=2))
raise SystemExit(bool(errors))
