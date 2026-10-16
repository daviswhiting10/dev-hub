// YOUR RESEARCH PROFILE — steers the daily briefing agents. Updated automatically when you submit the poll on the
// Briefing page (a GitHub Issue is ingested by .github/workflows/ingest-feedback.yml). Safe to hand-edit too.
// NOTE: this repo is public, so keep it to low-sensitivity preferences.
window.HUB_PROFILE = {
  updated: "2026-10-16",
  source: "seed",                 // "seed" until you answer the poll; then "poll"
  goal: "get-hired",              // get-hired | freelance | build-products | stay-informed
  depth: "analysis",              // skim | analysis | technical
  minutes: 10,                    // daily reading budget: 3 | 10 | 20
  hype: "low",                    // hype tolerance: low | medium | high
  topics: ["agents-mcp", "frontier-labs", "dev-tools", "jobs-income", "agent-safety", "health-fitness-ai"],
  notes: ""                       // optional free text (max 200 chars), e.g. sources to trust or avoid
};
