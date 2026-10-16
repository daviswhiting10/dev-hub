// THE POLL — five core questions that tune your agents. `adaptive` questions (max 3) are proposed weekly by the
// Poll agent from gaps it sees in your feedback; they expire after ~4 weeks. Answer on the Briefing page.
// types: single | multi | text
window.HUB_POLL = {
  version: 1,
  core: [
    { id: "goal", type: "single", text: "What is your main goal with AI over the next 6 months?",
      options: [
        { id: "get-hired", label: "Get hired in an AI role" },
        { id: "freelance", label: "Land freelance / consulting work" },
        { id: "build-products", label: "Build my own products" },
        { id: "stay-informed", label: "Stay informed and sharp" } ] },
    { id: "depth", type: "single", text: "How deep should the daily briefing go?",
      options: [
        { id: "skim", label: "Skim: headlines and one line each" },
        { id: "analysis", label: "Analysis: what happened and why it matters" },
        { id: "technical", label: "Technical: details, papers, code" } ] },
    { id: "topics", type: "multi", text: "Which topics should the agents track? (pick any)",
      options: [
        { id: "agents-mcp", label: "Agents & MCP" },
        { id: "frontier-labs", label: "Frontier labs & models" },
        { id: "dev-tools", label: "AI dev tools" },
        { id: "jobs-income", label: "AI, jobs & income" },
        { id: "agent-safety", label: "Agent safety & security" },
        { id: "health-fitness-ai", label: "Health & fitness AI" },
        { id: "policy", label: "Policy & regulation" },
        { id: "startups-funding", label: "Startups & funding" } ] },
    { id: "minutes", type: "single", text: "How much time can you give the briefing each day?",
      options: [
        { id: "3", label: "About 3 minutes" },
        { id: "10", label: "About 10 minutes" },
        { id: "20", label: "20+ minutes" } ] },
    { id: "hype", type: "single", text: "How should the agents treat hype and unverified claims?",
      options: [
        { id: "low", label: "Filter hard: only well-sourced items" },
        { id: "medium", label: "Include notable rumors, clearly labeled" },
        { id: "high", label: "Show me everything, labeled by confidence" } ] }
  ],
  adaptive: []
};
