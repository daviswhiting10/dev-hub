# Briefings data format

This folder holds the daily AI briefings, published by an automated research job
(`agents/run.mjs`, run by `.github/workflows/daily-briefing.yml`). The website renders
them; it never writes them. All briefing text comes from web research, so the site
treats it as untrusted: everything is escaped and links must be `http(s)`.

## Primary format (what the agents write): JS data files

The site has to work from `file://`, where browsers cannot fetch JSON, so the agents
write script files that the page loads with `<script>` tags.

- `YYYY-MM-DD.js` — one briefing per day:
  ```js
  window.BRIEFINGS = window.BRIEFINGS || [];
  window.BRIEFINGS.push({
    date: "2026-10-17",
    headline: "One-line theme for the day",
    tldr: "2-3 sentence summary (say so plainly on a quiet day)",
    for_you: "1-2 sentences tying the news to the career transition, exam prep, or projects",
    meta: { generatedBy, model, profile, strategyVersion },
    items: [
      { id: "2026-10-17-1", title, summary, why, analysis, tags: ["agents-mcp"],
        confidence: "high" | "medium" | "low", sources: [{ title, url }] }
    ]
  });
  ```
- `index.js` — `window.BRIEFING_INDEX = ["2026-10-17", ...]`, newest first. The publisher
  maintains it; the site cannot list directories.

## Also accepted: JSON files (only when the site is served over http/https)

A second publisher may write plain JSON. Over `http(s)` (GitHub Pages or a local server)
the site also reads these; over `file://` they are ignored.

- `YYYY-MM-DD.json` and `index.json` (array of `{date, headline}`, newest first).
  ```json
  {
    "date": "2026-10-17",
    "headline": "One-line headline for the day",
    "tldr": "2-3 sentence summary",
    "stories": [
      { "title": "", "summary": "2-3 sentences", "why_it_matters": "One line",
        "source": "Outlet name", "url": "https://...", "topics": ["agents", "models"] }
    ],
    "for_davis": "1-2 sentences tying the day's news to his goals"
  }
  ```
  Mapping: `stories` -> items, `why_it_matters` -> why, `topics` -> tags, `source`+`url` -> one
  source, `for_davis` -> `for_you`. If a date exists in both formats, the JS file wins.

## Rules for publishers (both formats)

- Never invent stories. A quiet news day gets a short, honest briefing, not padding.
- Skip hype, press-release rewrites, and crypto-adjacent noise.
- `for_you` / `for_davis` always connects the news to the career transition, exam prep, or
  projects. That is the whole point of the briefing.
- Cite only sources that were actually retrieved. The agents enforce this: a source URL that
  the researcher did not actually fetch is dropped.
