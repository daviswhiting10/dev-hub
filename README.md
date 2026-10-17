# Davis's Dev Hub

A local-first personal dashboard: CAF exam practice → roadmap → projects → playbook → a digital resume that builds itself.
No build step, no accounts, no internet needed. Your progress is saved in your browser.

## Run it

Double-click `index.html` (opens from `file://`). That's it.

Optional local server (single command): `python3 -m http.server 8000` then open <http://localhost:8000>.

> Progress is stored per address. `file://` and `localhost:8000` have **separate** saves — pick one and stick with it, or move
> progress between them with **Export backup → Import** (sidebar).

## Sections

| Section | What it's for |
|---|---|
| Dashboard | Today's focus, today's AI briefing, current sprint, and your stats at a glance. |
| Briefing | Your daily AI briefing written by research agents, with votes, a 5-question poll, and a log of how the agents have changed. |
| CAF Practice | The cream/terracotta exam interface: Exam mode (timed, feedback at submit) or Study mode (instant feedback), question navigator, flagging, results by domain and scenario, plus per-domain accuracy and drills. |
| Roadmap | The Oct 2026 → Mar 2027 plan as phases and 2-week sprints with checkable milestones. |
| Projects | Idea → building → shipped pipeline, plus a portfolio page of shipped work. |
| Playbook | The 2026 AI-engineer path from the Instagram reel, as a checklist. |
| Learn | A one-week AI curriculum from the “Last AI Roadmap” video; checked items feed the Resume. |
| Resume | Auto-built from what you've completed; print or copy as text. |

## Extending without touching code

- **New question bank:** drop in `q4.js` using the format documented at the top of `q1.js`. Auto-discovered.
- **Roadmap / playbook:** edit `data/roadmap.js` or `data/playbook.js`. Give new items a unique `id`.
- **Projects:** add them in the app (Projects → Add project), or add an object to `data/projects.js`.
- Items can carry `skill: [...]`, `resume: "..."` and `cert: {...}`; once checked, they appear on the Resume.

## AI workspace: daily briefing, poll, self-improving agents

```
GitHub Action (daily 11:00 UTC)             The website (static)
  agents/run.mjs                              Briefing page reads data/briefings/*.js
  Researcher (web search) -> Editor ->        you vote + answer the poll
  Critic -> weekly Poll agent                 "Send" opens a prefilled GitHub Issue
  writes data files, commits  <------------   Action ingests it -> data/profile.js / feedback.js
```

**Agents write data, never code.** All model output is validated and written only to a fixed whitelist
(`data/briefings/*`, `data/strategy.js`, `data/poll.js`; ingestion writes `data/profile.js`, `data/feedback.js`).
Briefing sources must be URLs the researcher actually retrieved. The site escapes all text and only links http(s).
Every strategy change the Critic makes is committed to git and shown on the Briefing page, so it is easy to audit or revert.

### One-time setup
1. Add your key: `gh secret set ANTHROPIC_API_KEY` (paste when prompted). Set a monthly spend limit on that key in the Anthropic console.
2. Repo Settings > Actions > General > Workflow permissions: **Read and write**.
3. Optional repo variables: `AGENT_MODEL` (default `claude-sonnet-5-5`), `TOKEN_BUDGET` (default 200000 tokens per run).
4. Run it once: Actions > daily-briefing > Run workflow (tick **dry_run** first to test without spending anything).
Without the secret the scheduled job exits with a warning and costs nothing.

### Local commands
- `node agents/test.mjs` runs the agent tests (whitelist, injection fixtures, ingestion rules).
- `node agents/run.mjs --dry-run` runs the whole pipeline on fake fixtures in a temp copy; it never touches the repo or the API.
- `ANTHROPIC_API_KEY=... node agents/run.mjs --force` generates today's briefing for real.

### Tuning
- `agents/prompts/*.md` are the agents' instructions (edit by hand; agents cannot change them).
- `data/strategy.js` holds beats, queries and sources that the Critic adjusts within bounds (max 5 changes per run).
- `data/poll.js` has the five core questions; the weekly Poll agent adds up to 3 adaptive ones.
- The repo is public, so keep poll answers low-sensitivity.

## Backup

Sidebar → **Export backup** downloads one JSON file with everything (progress, projects, profile, score history).
**Import** restores it. Commit the export to git if you want history.

## Files

```
index.html          app shell
css/style.css       hub styles (dark, print-friendly resume)
css/exam.css        exam skin used while CAF Practice is open
js/core.js          storage, router, bank loader, shared helpers
js/tests.js         practice-test engine + domain accuracy + drills
js/dashboard.js  roadmap.js  projects.js  playbook.js  resume.js
data/               roadmap, playbook, learn, seed projects; profile, strategy, poll, feedback; briefings/
agents/             research agents (run.mjs, ingest.mjs), prompts, fixtures, tests
.github/            workflows (daily briefing, ingest feedback) and issue templates
q1.js q2.js q3.js   question banks (60 questions each)
archive/            previous standalone practice-exam page
```

## Notes

- Practice questions are independent study material, not actual exam content.
- Scaled score estimate = 100 + 900 × percent correct (Anthropic's real scaling isn't published); pass line 720 ≈ 69%.
- Playbook source: reel by @swerikcodes, built from on-screen text (no audio transcript was available).

## Ask panel (live explainer)

The **Ask** button (bottom right) opens a panel that calls the Claude API directly from your browser. Paste an API key once
(use a separate key with a low spend limit). It is stored only in this browser under its own localStorage entry, so
**Export backup does not include it** and the repo never sees it. Highlight any text on a page and press **Explain**, or type a
question. “Save to glossary” keeps terms in your backup. Note: localStorage is shared by every page under
`daviswhiting10.github.io`, so only host pages there that you trust.

## News feeds

`data/strategy.js` → `sources.feeds` lists public RSS feeds (WSJ Technology and US Business to start). The daily run reads
their headlines and short descriptions as extra leads for the researcher. No logins: for paywalled outlets the briefing only
has the headline and snippet, and links out so you can read the article with your own subscription.
