# Market watch data format

Weekly scan (Sunday evening), published by Muse's cron. The site only renders it (js/trading.js, Trading tab); all text is
untrusted (escaped, links must be http(s)). Never invent content, prices or numbers; only report what a retrieved source says.
It is research for a beginner learning to swing trade, not trade recommendations: tickers are "names to research".

- `YYYY-WNN.json` (ISO week) + `index.json` (newest-first `[{week, headline}]`), read over http(s):
  ```json
  { "week": "2026-W43", "headline": "one line (120)",
    "themes": [ { "name": "(60)", "what_happening": "(280)", "why_it_matters": "(280)",
      "watch": ["what to watch next, 1-3 items (120 each)"], "tickers": ["up to 5 symbols, names to research"],
      "source": "(60)", "url": "https://... (actually retrieved)" } ],
    "calendar": [ { "date": "YYYY-MM-DD", "event": "(100) earnings, Fed, CPI, jobs report..." } ],
    "risks": "(280) what could make the week go wrong",
    "signal": "(200) one-line read on where attention is moving" }
  ```
  3-6 themes (emerging trends: sectors, technologies, macro shifts).
- `file://` can't fetch JSON, so also publish twins: `YYYY-WNN.js` →
  `window.MARKET_WATCH = window.MARKET_WATCH || []; window.MARKET_WATCH.push({...});` and `index.js` →
  `window.MARKET_INDEX = [{week, headline}, ...]` (newest first).

Only the newest week is shown. With no data the tab shows "The market watch lands each Sunday."
