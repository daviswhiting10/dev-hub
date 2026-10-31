// AGENT STRATEGY — what the research agents look for. The Critic agent may adjust this file within strict bounds
// (add/drop queries and sources, reweight topics; max 5 changes per run) and logs every change in `changelog`.
// Everything is committed to git, so any change is diffable and revertable.
window.HUB_STRATEGY = {
  "version": 10,
  "updated": "2026-10-31",
  "limits": {
    "maxItems": 8,
    "minItems": 5,
    "maxSearches": 4,
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
        "agent framework release OpenAI Agents SDK LangGraph new version production",
        "MCP server or agent framework release this week github.com"
      ]
    },
    {
      "id": "frontier-labs",
      "name": "Frontier labs & models",
      "weight": 3,
      "queries": [
        "Anthropic OpenAI Google DeepMind model release announcement",
        "frontier AI lab news this week",
        "open-weight model release Hugging Face agentic coding benchmark",
        "new frontier model launch evals system card agentic capabilities this week"
      ]
    },
    {
      "id": "dev-tools",
      "name": "AI dev tools",
      "weight": 2,
      "queries": [
        "Claude Code Cursor Codex new features",
        "AI coding assistant benchmarks and updates",
        "Claude Code changelog release notes anthropic.com OR github.com new version",
        "Claude Code latest release notes changelog github.com anthropics claude-code"
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
        "AI agent engineer hiring trends new data October 2026",
        "AI agent engineer job openings salary data and employer demand this month"
      ]
    },
    {
      "id": "agent-safety",
      "name": "Agent safety & security",
      "weight": 2,
      "queries": [
        "AI agent incident security report",
        "AI agents escaping control or misbehaving case study",
        "AI agent sandbox escape disclosure lab incident regulator advisory",
        "AI agent security survey primary research unauthorized actions enterprise CISO report"
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
    },
    {
      "date": "2026-10-19",
      "version": 5,
      "summary": "The briefing has only 3 items, below the 5-item minimum. Relevance is good: it covers frontier labs, jobs and agent safety, which match the reader's get-hired goal. The Anthropic IPO and fund item is new. The CERT-In item follows an earlier CERT-In briefing (\"Agent containment failures... India CERT",
      "changes": [
        {
          "op": "add_query",
          "beat": "agent-safety",
          "value": "AI agent security survey primary research unauthorized actions enterprise CISO report",
          "reason": "Today's survey item came from secondary write-ups (Security Today, CIO Dive), so a query aimed at primary research should surface the original reports."
        }
      ]
    },
    {
      "date": "2026-10-21",
      "version": 6,
      "summary": "Today's briefing has 4 items, below the 5-item minimum. Relevance is strong, since it covers agent safety, MCP and frontier labs. Novelty is mostly fine, but the MCP spec follow-ups are the third briefing in a row on the same story. Clarity is good. The jobs-income, dev-tools and health beats are mi",
      "changes": [
        {
          "op": "add_query",
          "beat": "jobs-income",
          "value": "AI agent engineer job openings salary data and employer demand this month",
          "reason": "The briefing has no real jobs-income item (the S-1 story is only loosely tagged), and the reader's goal is get-hired."
        },
        {
          "op": "drop_query",
          "beat": "agents-mcp",
          "value": "MCP server specification update registry adoption enterprise",
          "reason": "MCP spec follow-ups have appeared in at least three recent briefings, including today's, so this query keeps returning the same story."
        }
      ]
    },
    {
      "date": "2026-10-22",
      "version": 7,
      "summary": "The briefing fits the reader's get-hired goal and topics. The Barclays item and the Azure MCP item are new, and the Claude Code item is relevant. Two problems: it has only 4 items, below the 5-item minimum, and the PHP2Shell follow-up largely repeats yesterday's story. The Claude Code item is low co",
      "changes": [
        {
          "op": "add_query",
          "beat": "dev-tools",
          "value": "Claude Code changelog release notes anthropic.com OR github.com new version",
          "reason": "Today's Claude Code item is low confidence and relies on a third-party release tracker, so a query aimed at primary changelogs should give better sourcing."
        }
      ]
    },
    {
      "date": "2026-10-25",
      "version": 8,
      "summary": "The briefing has 3 items, below the 5-item minimum. It is relevant to the agent-safety, dev-tools and get-hired goals, but most of it follows up on recent briefings. The Black October update, Claude Code 2.1.305 and the OpenAI fired-researchers story all appeared in earlier titles. It has nothing on",
      "changes": [
        {
          "op": "add_query",
          "beat": "agents-mcp",
          "value": "agent framework release OpenAI Agents SDK LangGraph new version production",
          "reason": "Today's agents-mcp coverage was only a Claude Code changelog side-item, and recent briefings repeated MCP spec and launch stories, so this adds a different angle."
        },
        {
          "op": "add_query",
          "beat": "frontier-labs",
          "value": "new frontier model launch evals system card agentic capabilities this week",
          "reason": "The only frontier-labs item today was a low-confidence insider-risk follow-up of an earlier story, so the beat needs primary model and release coverage."
        }
      ]
    },
    {
      "date": "2026-10-29",
      "version": 9,
      "summary": "The briefing is relevant but thin. It has only 4 items against a 5-item minimum. Two of them are low confidence, with cut-off notes or headline-only coverage. The OpenAI sandbox-escape story and the Warren letter are on topic and add detail. However, agent-safety and Claude Code sandbox hardening ha",
      "changes": [
        {
          "op": "add_query",
          "beat": "dev-tools",
          "value": "Claude Code 2.1.309 release notes changelog github.com anthropics claude-code",
          "reason": "The Claude Code item was low confidence because the notes were cut off, so a changelog-targeted query should recover the specifics."
        },
        {
          "op": "add_query",
          "beat": "agents-mcp",
          "value": "MCP server or agent framework release this week github.com",
          "reason": "Agents-MCP is a weight-3 beat but produced no items today, leaving the briefing under the 5-item minimum."
        }
      ]
    },
    {
      "date": "2026-10-31",
      "version": 10,
      "summary": "The briefing has only 3 items, below the 5-item minimum. It covers dev-tools and frontier-labs and has nothing on agent safety, jobs, or health. The Claude Code 2.1.310 item is useful and on-goal. The Mistral item is a follow-up to a story already covered, so it adds little. The WSJ item is low-conf",
      "changes": [
        {
          "op": "drop_query",
          "beat": "dev-tools",
          "value": "Claude Code 2.1.309 release notes changelog github.com anthropics claude-code",
          "reason": "It is pinned to version 2.1.309, which 2.1.310 has already replaced, and 2.1.309 was already covered in earlier briefings, so it returns stale results."
        },
        {
          "op": "add_query",
          "beat": "dev-tools",
          "value": "Claude Code latest release notes changelog github.com anthropics claude-code",
          "reason": "A version-agnostic query will keep picking up new releases such as 2.1.310 without manual edits, and the reader has no feedback yet that would justify a bigger change."
        }
      ]
    }
  ]
};
