// AGENT STRATEGY — what the research agents look for. The Critic agent may adjust this file within strict bounds
// (add/drop queries and sources, reweight topics; max 5 changes per run) and logs every change in `changelog`.
// Everything is committed to git, so any change is diffable and revertable.
window.HUB_STRATEGY = {
  "version": 4,
  "updated": "2026-10-18",
  "limits": {
    "maxItems": 8,
    "minItems": 5,
    "maxSearches": 8,
    "maxQueriesPerBeat": 6,
    "maxChangesPerRun": 5
  },
  "beats": [
    {
      "id": "agents-mcp",
      "name": "Agents & MCP",
      "weight": 3,
      "queries": [
        "Claude Agent SDK and MCP news this week",
        "new MCP servers and agent frameworks",
        "multi-agent systems production lessons",
        "MCP server specification update registry adoption enterprise"
      ]
    },
    {
      "id": "frontier-labs",
      "name": "Frontier labs & models",
      "weight": 3,
      "queries": [
        "Anthropic OpenAI Google DeepMind model release announcement",
        "frontier AI lab news this week",
        "open-weight model release Hugging Face agentic coding benchmark"
      ]
    },
    {
      "id": "dev-tools",
      "name": "AI dev tools",
      "weight": 2,
      "queries": [
        "Claude Code Cursor Codex new features",
        "AI coding assistant benchmarks and updates"
      ]
    },
    {
      "id": "jobs-income",
      "name": "AI, jobs & income",
      "weight": 2,
      "queries": [
        "AI impact on jobs entry-level labor market study",
        "AI skills hiring demand report",
        "AI engineer agent developer job postings hiring demand skills 2026",
        "portfolio projects and skills hiring managers want for AI agent engineer roles",
        "AI agent engineer hiring trends new data October 2026"
      ]
    },
    {
      "id": "agent-safety",
      "name": "Agent safety & security",
      "weight": 2,
      "queries": [
        "AI agent incident security report",
        "AI agents escaping control or misbehaving case study",
        "AI agent sandbox escape disclosure lab incident regulator advisory"
      ]
    },
    {
      "id": "health-fitness-ai",
      "name": "Health & fitness AI",
      "weight": 1,
      "queries": [
        "AI in fitness coaching and nutrition products",
        "health AI startups funding"
      ]
    }
  ],
  "sources": {
    "prefer": [
      "anthropic.com",
      "openai.com",
      "deepmind.google",
      "arxiv.org",
      "huggingface.co",
      "github.com"
    ],
    "avoid": [],
    "feeds": [
      {
        "name": "WSJ Technology",
        "url": "https://feeds.content.dowjones.io/public/rss/RSSWSJD"
      },
      {
        "name": "WSJ US Business",
        "url": "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness"
      }
    ]
  },
  "seedLeads": [
    "OpenAI / Hugging Face incident technical report (cited in video: How to Survive the Next 2 Years of AI)",
    "Stanford Digital Economy Lab research on AI and early-career employment",
    "Recursive self-improvement discussions among the major labs"
  ],
  "changelog": [
    {
      "date": "2026-10-16",
      "version": 1,
      "summary": "Initial strategy seeded from your profile and the two videos.",
      "changes": []
    },
    {
      "date": "2026-10-17",
      "version": 2,
      "summary": "The briefing is strong and relevant. It covers agent safety, frontier labs, dev tools and the jobs evidence. It's mostly new, with no overlap with recent titles. Some items are labeled medium confidence and one is described as still developing, so they need careful reading. The briefing has no MCP-s",
      "changes": [
        {
          "op": "add_query",
          "beat": "jobs-income",
          "value": "AI engineer agent developer job postings hiring demand skills 2026",
          "reason": "The reader's goal is get-hired, and today's only jobs item was a macro study with nothing on in-demand skills or roles."
        },
        {
          "op": "add_query",
          "beat": "agents-mcp",
          "value": "MCP server specification update registry adoption enterprise",
          "reason": "The agents-mcp beat has weight 3, but today's briefing had no MCP-specific item. Agent coverage came only through safety and dev-tools stories."
        }
      ]
    },
    {
      "date": "2026-10-17",
      "version": 3,
      "summary": "Solid briefing: six items, well matched to the get-hired goal and the agents, dev-tools, safety and jobs topics. Novelty is good. The rogue-agent incident follows the earlier OpenAI/Hugging Face incident item, but it adds new details (the wallet case, the count of 19). Jobs coverage is useful and da",
      "changes": [
        {
          "op": "add_query",
          "beat": "jobs-income",
          "value": "portfolio projects and skills hiring managers want for AI agent engineer roles",
          "reason": "The goal is get-hired and today's only jobs item was market-level data, so an actionable skills/portfolio query could add practical content; the change is small and reversible."
        }
      ]
    },
    {
      "date": "2026-10-18",
      "version": 4,
      "summary": "The briefing fits the reader's goal (get hired, analysis depth, low hype) and mostly covers new material: Muse Spark Open, the China export controls and the Claude Code/Codex convergence are fresh. Weaknesses: the MCP and agent-containment items follow up on recent briefings. The jobs coverage is th",
      "changes": [
        {
          "op": "add_query",
          "beat": "jobs-income",
          "value": "AI agent engineer hiring trends new data October 2026",
          "reason": "Jobs coverage today was one low-confidence background item (the Stanford canaries study) plus a newsroom listing, and the reader's goal is get-hired."
        },
        {
          "op": "add_query",
          "beat": "agent-safety",
          "value": "AI agent sandbox escape disclosure lab incident regulator advisory",
          "reason": "Agent containment has appeared in two consecutive briefings, so a query aimed at primary disclosures and regulator advisories should add new detail instead of rehashing the same story."
        },
        {
          "op": "add_query",
          "beat": "frontier-labs",
          "value": "open-weight model release Hugging Face agentic coding benchmark",
          "reason": "The Muse Spark Open item was strong and relevant, and this query should surface similar open-weight releases."
        }
      ]
    }
  ]
};
