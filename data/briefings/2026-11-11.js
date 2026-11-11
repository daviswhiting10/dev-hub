// Daily AI briefing 2026-11-11. Maintained by muse-cron.
window.BRIEFINGS = window.BRIEFINGS || [];
window.BRIEFINGS.push({
  "date": "2026-11-11",
  "headline": "Carbon goes wide with agent swarms, Cursor goes multiplayer, and Anthropic prices its IPO",
  "tldr": "Google widened Gemini 4 Carbon's rollout on Nov 10 and previewed /swarm, a multi-agent mode for Antigravity that runs coordinated coding agents in parallel worktrees — while Cursor made its multi-agent Projects multiplayer. Anthropic filed its IPO price range at $70-$78 a share, OpenAI opened Businesses in ChatGPT so companies can claim profiles and publish Business Agents, and DeepMind used agents to formally verify Signal's crypto code.",
  "for_you": "The day's theme is coordination: swarms, multiplayer agent fleets, and agents that verify each other's work are now shipping products, not demos — and the two cheapest ways to ride that wave are in this briefing (Carbon at $9 a task, and paid eval work at a $60/hr median). The IPO filing is the backdrop: the lab he builds on gets priced in public within weeks.",
  "meta": {
    "generatedBy": "muse-cron"
  },
  "items": [
    {
      "id": "2026-11-11-1",
      "title": "Gemini 4 Carbon goes wide, and Antigravity gets /swarm multi-agent mode",
      "summary": "Google widened Gemini 4 Carbon's rollout on Nov 10 — its model for long-horizon coding, debugging and cybersecurity work — alongside a preview of /swarm in Antigravity, which turns one prompt into a coordinated team of agents: a coordinator, parallel workers in isolated git worktrees, adversarial verifiers, and a shared message board. On CursorBench 4.0, Carbon High tops the board at 60.4% at about $9 per task, against Claude Fable 5.2 Max at 60.0% for about $33. Introductory API pricing is $2/$10 per million tokens through Nov 30, rising to $4 after.",
      "why": "The two patterns his project work needs — a cheap long-horizon reasoning model and a coordinator/workers/verifiers swarm — just shipped together in one tool, and the cost gap vs Fable is 3-4x per task.",
      "analysis": "The two patterns his project work needs — a cheap long-horizon reasoning model and a coordinator/workers/verifiers swarm — just shipped together in one tool, and the cost gap vs Fable is 3-4x per task.",
      "tags": [
        "models",
        "coding",
        "agents"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "AlphaSignal",
          "url": "https://alphasignal.ai/news/google-s-antigravity-launches-swarm-to-run-parallel-coding-agents"
        }
      ]
    },
    {
      "id": "2026-11-11-2",
      "title": "Cursor Projects goes multiplayer: teams and agent fleets in one workspace",
      "summary": "Cursor made Projects multiplayer on Nov 10, in beta for all users. Projects, introduced in September, lets engineers direct a fleet of agents through a single coordinator; now teammates can be invited into a Project to plan, build and ship together alongside the agents, with shared context, memory and documents. Cursor calls it the first workspace where software teams work side by side with all of their agents.",
      "why": "Multi-agent work is becoming team work: the coordination patterns (shared context, a coordinator over a fleet) are the same ones his Life Time follow-up build and his eval/router project will need.",
      "analysis": "Multi-agent work is becoming team work: the coordination patterns (shared context, a coordinator over a fleet) are the same ones his Life Time follow-up build and his eval/router project will need.",
      "tags": [
        "coding",
        "agents"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "Cursor",
          "url": "https://cursor.com/blog/projects-multiplayer"
        }
      ]
    },
    {
      "id": "2026-11-11-3",
      "title": "Anthropic files IPO range: $70-$78 a share, up to about a $1.4T valuation",
      "summary": "Anthropic filed updated SEC papers setting an IPO price range of $70-$78 per share, implying a valuation up to about $1.4 trillion, with Nasdaq ticker ANT and a planned mid-to-late November listing. The filing follows Monday's retracted $69.3B pricing document. Major tech firms have committed roughly $26B to buy special-category shares at the IPO price, with no ordinary voting rights. The prospectus reports about $17B in Q3 2026 revenue against nearly $900B in long-term compute and data-center commitments.",
      "why": "The lab he builds on is about to be priced by the public market — $17B quarterly revenue against $900B of compute commitments is the hiring and spending climate his whole transition lands in.",
      "analysis": "The lab he builds on is about to be priced by the public market — $17B quarterly revenue against $900B of compute commitments is the hiring and spending climate his whole transition lands in.",
      "tags": [
        "business",
        "careers"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "Particle News",
          "url": "https://particle.news/story/anthropic-prices-ipo-range-and-pushes-new-claude-models-ahead-of-nasdaq-debut"
        }
      ]
    },
    {
      "id": "2026-11-11-4",
      "title": "OpenAI opens Businesses in ChatGPT: claim a profile, publish a Business Agent",
      "summary": "OpenAI launched Businesses in ChatGPT in beta on Nov 10. Companies can claim a profile in Business Hub, correct their details, add product feeds with prices and stock, and see aggregated mentions and website clicks. Eligible US ecommerce and online-service businesses can also build, test and publish a Business Agent — a branded assistant that chats with shoppers in a clearly labelled conversation separate from ChatGPT's own answers. Agents cannot yet take payments, make bookings or check orders; businesses can sponsor an agent as the destination for ChatGPT ads.",
      "why": "Discovery is moving inside the assistant: the businesses that get mentioned and clicked are the ones that claim their profile and feed it live data — a distribution channel his venture and any client business will need to show up in.",
      "analysis": "Discovery is moving inside the assistant: the businesses that get mentioned and clicked are the ones that claim their profile and feed it live data — a distribution channel his venture and any client business will need to show up in.",
      "tags": [
        "business",
        "agents"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "Reuters",
          "url": "https://www.reuters.com/technology/openai-lets-businesses-claim-chatgpt-profiles-adds-ai-agents-us-e-commerce-firms-2026-11-10/"
        }
      ]
    },
    {
      "id": "2026-11-11-5",
      "title": "DeepMind's AlphaProof Code formally verifies Signal's crypto implementation",
      "summary": "Google DeepMind reported on Nov 10 that AlphaProof Code — a multi-agent formal-verification framework powered by Gemini — was used to prove key security properties of Signal's deployed cryptographic implementation, working in the Lean proof assistant over about four weeks. It is the first high-profile case of agents doing machine-checked proofs on production security code rather than benchmark problems.",
      "why": "Verification is the counterweight to agent autonomy: the same multi-agent pattern that writes code can now prove security properties about it — the governance story his CCAR-P prep and his own approval-gated agent design sit inside.",
      "analysis": "Verification is the counterweight to agent autonomy: the same multi-agent pattern that writes code can now prove security properties about it — the governance story his CCAR-P prep and his own approval-gated agent design sit inside.",
      "tags": [
        "agents",
        "coding"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "SXF Brief",
          "url": "https://sxf.si/brief/"
        }
      ]
    },
    {
      "id": "2026-11-11-6",
      "title": "AI training platforms list 386 software-engineer roles, median $60 an hour",
      "summary": "As of Nov 11, AITraining.jobs lists 386 open roles for software engineers across 28 AI-training platforms, with typical pay of $40-$130 an hour and a median of $60; the highest advertised rate is $400 an hour. The work is reviewing and ranking model-written code, writing coding tasks with tests, and fixing failed attempts in real repositories. Software-and-IT listings across the platforms grew 7.4% over the Oct 14-Nov 10 window, with 147 new listings.",
      "why": "A paid lane that funds the transition and builds exactly the skills he needs: evaluating model code, writing evals with tests, and working in real repos — the same muscle as the eval/router project.",
      "analysis": "A paid lane that funds the transition and builds exactly the skills he needs: evaluating model code, writing evals with tests, and working in real repos — the same muscle as the eval/router project.",
      "tags": [
        "careers"
      ],
      "confidence": "high",
      "sources": [
        {
          "title": "AITraining.jobs",
          "url": "https://aitraining.jobs/ai-training-jobs-for-software-engineers?country=all"
        }
      ]
    }
  ]
});
