// SAMPLE briefing — placeholder so the page works before the first agent run. Real briefings are written daily by
// agents/run.mjs. Items here are about the workspace itself, not news.
window.BRIEFINGS = window.BRIEFINGS || [];
window.BRIEFINGS.push({
  date: "2026-10-16",
  headline: "Welcome to your AI workspace",
  meta: { sample: true, generatedBy: "hand-written sample", profileVersion: "seed", strategyVersion: 1 },
  items: [
    { id: "2026-10-16-1", title: "How your daily briefing works",
      summary: "Every morning an agent searches the web for the topics you track, an editor ranks and de-duplicates the results, and a critic tunes the strategy based on your feedback.",
      why: "The more you vote (useful / skip / more like this) and the more often you answer the poll, the better the next briefing fits you.",
      analysis: "Pipeline: researcher (web search) → editor (ranking, structured output) → critic (strategy tuning, logged in the changelog below) → weekly poll proposer. Agents only write data files; nothing they produce is executed.",
      tags: ["workspace"], confidence: "high", sources: [] },
    { id: "2026-10-16-2", title: "Start here: The Last AI Roadmap Video You’ll Ever Watch",
      summary: "A 36-minute one-week AI curriculum: history, how LLMs work, the AI stack, the major labs, recursive self-improvement, tools, prompting, and monetizing.",
      why: "It is now your Learn tab: seven days of checkable tasks that feed your Resume.",
      analysis: "Built from the video's chapter titles; refine the tasks once you've watched it.",
      tags: ["learn"], confidence: "high",
      sources: [{ title: "The Last AI Roadmap Video You’ll Ever Watch (YouTube)", url: "https://www.youtube.com/watch?v=KjKlBvX9G7w" }] },
    { id: "2026-10-16-3", title: "Watch: How to Survive the Next 2 Years of AI",
      summary: "Three kinds of AI risk (physical security, jobs and income, beliefs and identity) and what to do about each.",
      why: "Its themes seed what your agents watch first: agent safety, labor-market impact, and the frontier labs.",
      analysis: "The video cites several reports; the agents treat them as leads to verify, not established facts.",
      tags: ["agent-safety", "jobs-income"], confidence: "medium",
      sources: [{ title: "How to Survive the Next 2 Years of AI (YouTube)", url: "https://www.youtube.com/watch?v=X1ObmRAgp5A" }] }
  ]
});
