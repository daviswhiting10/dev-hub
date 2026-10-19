# Emerging business models data format

Daily scan, published by Muse. The site only renders it (js/business.js, Today tab above the Jobs Radar); all text is
untrusted (escaped, links must be http(s)). Never invent content. The agreed schema and example live in `docs/MUSE.md` (A1).

- `YYYY-MM-DD.json` + `index.json` (newest-first `[{date, headline}]`), read over http(s):
  `{ date, headline (120), models: [3-6 × { name (60), what_it_is (280), why_emerging (280), technique (500, the core field),
  who (120), source (60), url (https, actually retrieved) }], signal (200) }`
- `file://` can't fetch JSON, so also publish twins: `YYYY-MM-DD.js` →
  `window.BUSINESS = window.BUSINESS || []; window.BUSINESS.push({...});` and `index.js` →
  `window.BUSINESS_INDEX = [{date, headline}, ...]` (newest first).

Only the newest day in the index is shown. With no data the Today tab shows "The business-models scan lands each morning."
