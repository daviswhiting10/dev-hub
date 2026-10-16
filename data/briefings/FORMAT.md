# Briefings data format

This folder holds the daily AI briefings, published by an automated research job.
The website renders them; it never writes them.

## Files

- `YYYY-MM-DD.json` — one briefing per day.
- `index.json` — array of `{date, headline}`, newest first. The publisher maintains
  this file; the site reads it to build the archive (the site cannot list
  directories over `file://`).

## Briefing schema

```json
{
  "date": "2026-10-17",
  "headline": "One-line headline for the day",
  "tldr": "2-3 sentence summary",
  "stories": [
    {
      "title": "Story headline",
      "summary": "2-3 sentences",
      "why_it_matters": "One line",
      "source": "Outlet name",
      "url": "https://...",
      "topics": ["agents", "models"]
    }
  ],
  "for_davis": "1-2 sentences tying the day's news to his goals"
}
```

## Rules for publishers

- Never invent stories. A quiet news day gets a short, honest briefing — not padding.
- Skip hype, press-release rewrites, and crypto-adjacent noise.
- `for_davis` always connects the news to the career transition, exam prep, or
  projects. That's the whole point of the briefing.
