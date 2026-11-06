// Daily AI briefing 2026-11-05. Maintained by muse-cron.
window.BRIEFINGS = window.BRIEFINGS || [];
window.BRIEFINGS.push({
  "date": "2026-11-05",
  "headline": "Tencent's Hy4 goes multimodal, coding agents get cheaper and more governed, and Anthropic's roadshow clock starts",
  "tldr": "Tencent shipped the full Hy4 on Nov 4 with vision and computer-use capabilities, though the weights are still only promised, while Cognition launched SWE-2 Flash at 3x the speed and a fifth of the price of its bigger sibling. GitHub put Copilot inside JetBrains Air on the open Agent Client Protocol, SailPoint found 99% of agent-deploying enterprises lack the identity tools to govern them, and Anthropic's roadshow can't start before Nov 10 while OpenAI leans toward 2027.",
  "for_you": "Exam-first read: the SailPoint governance gap and the Agent Client Protocol are CCAR-P territory \u2014 identity, permissions and orchestration are what the exam tests and what enterprises will pay for. SWE-2 Flash is the cheap-fast tier his Life Time agent's routine work should run on, and the Anthropic roadshow clock gives the IPO story a date to watch.",
  "meta": {
    "generatedBy": "muse-cron"
  },
  "items": [
    {
      "id": "2026-11-05-1",
      "title": "Tencent releases full Hy4: vision and computer use arrive, weights still promised",
      "summary": "Tencent released the full Hy4 on Nov 4, adding vision and computer-use capabilities to the 770-billion-parameter MoE previewed in August. It is live via Tencent Cloud, OpenRouter and Tencent apps including CodeBuddy, WorkBuddy and Yuanbao, at unchanged list prices ($0.834 per million input tokens, $2.501 output) with a 1M-token context window. The weights and a full system card are promised 'in the coming days' \u2014 unlike the August preview, which shipped open weights on day one. A cheaper Hy4 Flash follows.",
      "why": "Open-weight models keep adding the agentic capabilities (vision, computer use) that matter for real builds \u2014 but 'weights promised, not shipped' is the new normal to watch before counting on them.",
      "analysis": "Open-weight models keep adding agentic capabilities, but 'weights promised' is the new normal \u2014 verify before building on it.",
      "tags": [
        "models",
        "agents"
      ],
      "confidence": "medium",
      "sources": [
        {
          "title": "Unite.AI",
          "url": "https://www.unite.ai/tencent-releases-full-hy4-model-with-vision-and-computer-use/"
        }
      ]
    },
    {
      "id": "2026-11-05-2",
      "title": "Cognition launches SWE-2 Flash: 3x faster, one-fifth the price, aimed at routine agent work",
      "summary": "Cognition announced SWE-2 Flash on Nov 4, reporting 3x the speed and one-fifth the price of its larger SWE-2 sibling. It is built on Thinking Machines Lab's Inkling-Small (276B total parameters, 12B active) and aimed at routine software-agent work \u2014 automations, code review, feature development, documentation \u2014 in Devin Desktop and CLI, free through Nov 30. Weights are not being shared publicly yet.",
      "why": "The coding-agent price war is moving to small fast models for routine work \u2014 the tier his Life Time agent's grunt work should run on, not the frontier model.",
      "analysis": "Small fast models are becoming the workhorse tier for routine agent tasks; the frontier model is for the hard 10%.",
      "tags": [
        "coding-tools",
        "models"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "Unite.AI",
          "url": "https://www.unite.ai/cognition-launches-swe-2-flash-for-faster-lower-cost-coding-agents/"
        }
      ]
    },
    {
      "id": "2026-11-05-3",
      "title": "GitHub Copilot joins JetBrains Air as a coding agent, on the open Agent Client Protocol",
      "summary": "GitHub said Nov 3 that Copilot can now be picked as a coding agent inside JetBrains Air, JetBrains' agentic development environment, built on the open Agent Client Protocol. Developers can hand work to Copilot and steer it locally in the IDE or in isolated cloud sandboxes via Air Teams, with cloud runs billed against the Copilot plan \u2014 no second AI budget needed.",
      "why": "Agents are becoming interchangeable behind an open protocol \u2014 the ecosystem bet his CCAR-P orchestration study is built on, and a sign the tooling war is moving to who orchestrates best.",
      "analysis": "The open Agent Client Protocol turns coding agents into interchangeable parts \u2014 orchestration, not the model, becomes the moat.",
      "tags": [
        "coding-tools",
        "agents"
      ],
      "confidence": "medium",
      "sources": [
        {
          "title": "Vinish.Dev",
          "url": "https://vinish.dev/github-copilot-jetbrains-air-agent-integration"
        }
      ]
    },
    {
      "id": "2026-11-05-4",
      "title": "SailPoint: 89% of enterprises deploy AI agents, 99% lack the identity tools to govern them",
      "summary": "SailPoint research published Nov 5 found 89% of EMEA enterprises have deployed AI agents, but 99% lack the identity-security tools to govern them, and only 22% have mature capability to detect shadow AI. Over half of organizations are still at the earliest, most manual stage of identity security, despite regulatory pressure from DORA and the EU AI Act.",
      "why": "The governance gap is the market: agent identity, permissions and audit trails are exactly the CCAR-P governance domain \u2014 and a ready-made contracting pitch for a builder who can speak it.",
      "analysis": "Enterprises deployed agents faster than they can govern them; identity and audit trails are now the buying decision.",
      "tags": [
        "agents",
        "business"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "Computer Weekly",
          "url": "https://www.computerweekly.com/news/366653557/SailPoint-Anarchy-reigns-over-enterprise-agentic-AI"
        }
      ]
    },
    {
      "id": "2026-11-05-5",
      "title": "Anthropic's roadshow can't start before Nov 10; OpenAI leans toward a 2027 IPO",
      "summary": "Anthropic filed its public S-1 on Oct 26 for a Nasdaq listing under ticker ANT, and the filing must sit public at least 15 days before a roadshow, so the roadshow cannot start before Nov 10, with a late-November listing expected and reports putting the sought valuation at $1.5\u20132 trillion. OpenAI has only a confidential June filing and is reported to be leaning toward a 2027 IPO, its CEO having said 'not 2026.'",
      "why": "The IPO clock is now a calendar event \u2014 roadshow from Nov 10 \u2014 and the public-vs-confidential split is the clearest signal yet of which lab lists first.",
      "analysis": "The IPO race has a calendar now: Anthropic's roadshow floor is Nov 10, and OpenAI has effectively conceded 2026.",
      "tags": [
        "business"
      ],
      "confidence": "medium",
      "sources": [
        {
          "title": "Leverage Shares",
          "url": "https://leverageshares.com/us/insights/anthropic-vs-openai-stock/"
        }
      ]
    }
  ]
});
