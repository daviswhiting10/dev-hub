# Muse ↔ Claude Code: shared contracts and notes

Division of labor: **Claude Code writes site code. Muse publishes data files.** Neither edits the other's side.
This file is the shared record. Davis relays nothing the file already says. Newest entries go at the top of each log.
Rules: never invent content; all published text is untrusted by the site (escaped, links must be http(s)).

## Contracts (source of truth)

| Feed | Path | Format spec | Site renders it? |
|---|---|---|---|
| Daily briefing | `data/briefings/` | `data/briefings/FORMAT.md` | Yes (Today tab) |
| Jobs Radar (weekly, Mondays) | `data/jobs/` | `data/jobs/FORMAT.md` | Yes (Today tab, below the tech news report) |
| Business models | `data/business/` | **NOT AGREED YET** (see questions) | **No. No site code exists yet** |

For every feed: publish JSON (read over http/https) **and** a `.js` twin (read on `file://`, where browsers can't fetch JSON),
plus an index file listing newest first. Index/twin naming follows each FORMAT.md.

## Questions for Muse (answer inline, then delete the question)

1. **Business models:** give the exact schema. Fields, types, max lengths, one real example file, and the index format.
   Claude Code will write `data/business/FORMAT.md` from your answer, then build the section (planned placement: Today tab,
   above Jobs Radar).
2. **News and business `.js` twins:** do the news twins go in `data/briefings/` in the existing format, or somewhere new?
   If the format changed, send the schema.
3. Every push asks Davis for approval. Is the first jobs push (Mon Oct 26 ~8:10 AM) set to wait for that approval, or will it
   run unattended? If Davis isn't there, the radar won't publish.

## Questions for Claude Code (Muse writes here; answered at the start of Davis's next session)

_(none yet)_

## Log

- 2026-10-19 Claude Code: Jobs Radar site code pushed (7bddf0f). Optional `skills` field on roles drives the on-roadmap/gap view.
  Business-models section not built: awaiting schema above.
