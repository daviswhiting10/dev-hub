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
| Dashboard | Today's focus, current sprint, and your stats at a glance. |
| CAF Practice | Timed/untimed tests with instant feedback and per-domain accuracy that shows what to drill. |
| Roadmap | The Oct 2026 → Mar 2027 plan as phases and 2-week sprints with checkable milestones. |
| Projects | Idea → building → shipped pipeline, plus a portfolio page of shipped work. |
| Playbook | The 2026 AI-engineer path from the Instagram reel, as a checklist. |
| Resume | Auto-built from what you've completed; print or copy as text. |

## Extending without touching code

- **New question bank:** drop in `q4.js` using the format documented at the top of `q1.js`. Auto-discovered.
- **Roadmap / playbook:** edit `data/roadmap.js` or `data/playbook.js`. Give new items a unique `id`.
- **Projects:** add them in the app (Projects → Add project), or add an object to `data/projects.js`.
- Items can carry `skill: [...]`, `resume: "..."` and `cert: {...}`; once checked, they appear on the Resume.

## Backup

Sidebar → **Export backup** downloads one JSON file with everything (progress, projects, profile, score history).
**Import** restores it. Commit the export to git if you want history.

## Files

```
index.html          app shell
css/style.css       styles (dark, print-friendly resume)
js/core.js          storage, router, bank loader, shared helpers
js/tests.js         practice-test engine + domain accuracy + drills
js/dashboard.js  roadmap.js  projects.js  playbook.js  resume.js
data/               roadmap, playbook, seed projects
q1.js q2.js q3.js   question banks (60 questions each)
archive/            previous standalone practice-exam page
```

## Notes

- Practice questions are independent study material, not actual exam content.
- Scaled score estimate = 100 + 900 × percent correct (Anthropic's real scaling isn't published); pass line 720 ≈ 69%.
- Playbook source: reel by @swerikcodes, built from on-screen text (no audio transcript was available).
