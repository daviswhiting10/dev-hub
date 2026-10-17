// AGENT STRATEGY — what the research agents look for. The Critic agent may adjust this file within strict bounds
// (add/drop queries and sources, reweight topics; max 5 changes per run) and logs every change in `changelog`.
// Everything is committed to git, so any change is diffable and revertable.
// Seed priorities come from the two Nick Saraev videos (themes only — claims in them are leads to verify, not facts).
window.HUB_STRATEGY = {
  version: 1,
  updated: "2026-10-16",
  limits: { maxItems: 8, minItems: 5, maxSearches: 8, maxQueriesPerBeat: 6, maxChangesPerRun: 5 },
  beats: [
    { id: "agents-mcp", name: "Agents & MCP", weight: 3,
      queries: ["Claude Agent SDK and MCP news this week", "new MCP servers and agent frameworks", "multi-agent systems production lessons"] },
    { id: "frontier-labs", name: "Frontier labs & models", weight: 3,
      queries: ["Anthropic OpenAI Google DeepMind model release announcement", "frontier AI lab news this week"] },
    { id: "dev-tools", name: "AI dev tools", weight: 2,
      queries: ["Claude Code Cursor Codex new features", "AI coding assistant benchmarks and updates"] },
    { id: "jobs-income", name: "AI, jobs & income", weight: 2,
      queries: ["AI impact on jobs entry-level labor market study", "AI skills hiring demand report"] },
    { id: "agent-safety", name: "Agent safety & security", weight: 2,
      queries: ["AI agent incident security report", "AI agents escaping control or misbehaving case study"] },
    { id: "health-fitness-ai", name: "Health & fitness AI", weight: 1,
      queries: ["AI in fitness coaching and nutrition products", "health AI startups funding"] }
  ],
  sources: {
    prefer: ["anthropic.com", "openai.com", "deepmind.google", "arxiv.org", "huggingface.co", "github.com"],
    avoid: [],
    // Public RSS feeds read as extra leads (headlines + short descriptions only; no logins). https only.
    feeds: [
      { name: "WSJ Technology", url: "https://feeds.content.dowjones.io/public/rss/RSSWSJD" },
      { name: "WSJ US Business", url: "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness" }
    ]
  },
  seedLeads: [
    "OpenAI / Hugging Face incident technical report (cited in video: How to Survive the Next 2 Years of AI)",
    "Stanford Digital Economy Lab research on AI and early-career employment",
    "Recursive self-improvement discussions among the major labs"
  ],
  changelog: [
    { date: "2026-10-16", version: 1, summary: "Initial strategy seeded from your profile and the two videos.", changes: [] }
  ]
};
