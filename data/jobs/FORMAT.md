# Jobs Radar data format

Weekly scan (Monday mornings), published by Muse's cron. The site only renders it (js/jobs.js);
all text is untrusted (escaped, links must be http(s)). Never invent content.

- `YYYY-WNN.json` (ISO week, e.g. `2026-W43.json`) and `index.json` (newest-first `[{week, headline}]`),
  read over http(s) (GitHub Pages / local server):
  ```json
  { "week": "2026-W43", "headline": "one line",
    "companies": [ { "name": "", "what_they_build": "1-2 sentences", "traction": "funding / scale signal",
      "notable_roles": [ { "title": "", "comp": "", "location": "", "url": "https://..." } ],
      "why_it_matters": "" } ],
    "signal": "one-line read on what the market is creating" }
  ```
- Optional `skills: ["RAG", "Evals"]` on each role (and/or company): skills the posting itself states, never guessed.
  The site matches them against the skills on the Roadmap to show per-company overlap and a
  "Where your effort lands" ranking (skills by number of companies asking, flagged on/off your roadmap).
  Leave `skills` out when a posting doesn't say; the site then shows no fit claim.
- `file://` can't fetch JSON, so also publish script twins (optional, same data):
  `YYYY-WNN.js` → `window.JOBS_RADAR = window.JOBS_RADAR || []; window.JOBS_RADAR.push({...});`
  and `index.js` → `window.JOBS_INDEX = [{week, headline}, ...]` (newest first).

With no data the Today tab shows "The jobs radar lands Monday mornings."
