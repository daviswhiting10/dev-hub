// ROADMAP DATA — edit this file to change phases, sprints, or milestones. No code changes needed.
// A milestone is { id, t: "title", skill?: ["Skill"], resume?: "Resume bullet shown once checked", cert?: {name, issuer} }.
// RESUME RULE: only items with `cert` or `resume` reach the Digital Resume (and only they add their `skill`s). Give `resume` to big wins only.
// Ids must be unique and stable (progress is saved against them). Add new milestones by adding lines.
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.roadmap = {
  goal: "Working in AI by March 31, 2027 — an offer or signed freelance work.",
  // JOURNEY drives the Roadmap map and the Tests header. Checkpoints point at phases below; "you are here" is derived from
  // today's date and the sprint dates (set `current: { phase: "P2" }` to override). Completed = every milestone in the phase checked.
  journey: {
    endGoal: { label: "AI career — March 2027", date: "2027-03-31" },
    avatar: "assets/yo",   // your photo: drop it at assets/yo (or yo.png / yo.jpg / yo.webp); a styled marker is used until then
    initials: "DW",
    checkpoints: [
      { label: "Foundation", phase: "P1" }, { label: "Build", phase: "P2" },
      { label: "Position", phase: "P3" }, { label: "Hunt", phase: "P4" }
    ]
  },
  phases: [
    { id: "P1", name: "Close the gap", range: "Oct 15 – Oct 28, 2026", tests: "CAF practice (passed)",
      goal: "Pass the CAF retake. Done: passed Oct 2026." },
    { id: "P2", name: "Build proof", range: "Oct 29 – Dec 9, 2026", tests: "Keep the CAF sharp",
      goal: "Ship 3 projects (agentic, RAG, health-adjacent) plus write-ups. Learn Python basics, APIs, git, evals and deployment alongside." },
    { id: "P3", name: "Position", range: "Dec 10, 2026 – Jan 20, 2027",
      goal: "Resume reframe, LinkedIn rebuild, DC market map (gov contractors + health-tech startups), networking 2–3 conversations/week from January." },
    { id: "P4", name: "Hunt", range: "Jan 21 – Mar 31, 2027",
      goal: "Applications plus a parallel freelance track (AI automation for small businesses), interview prep. Done = offer or signed freelance work by March 31." }
  ],
  sprints: [
    { id: "S1", phase: "P1", start: "2026-10-15", end: "2026-10-28", name: "Exam prep + pass",
      focus: "Kill the 0% objectives, then pass the retake (done).",
      milestones: [
        { id: "r1-1", t: "Drill the 0% objectives: parallel tool calls, session resumption, delegation strategy, review architecture" },
        { id: "r1-2", t: "Drill the rest: orchestration patterns, iterative refinement, truncation fixes, built-in tool choice, MCP resources vs tools" },
        { id: "r1-3", t: "Complete Practice Tests 1, 2 and 3 once each" },
        { id: "r1-4", t: "Get every domain to 75%+ on the Domain Accuracy panel" },
        { id: "r1-5", t: "Clear the Missed queue (re-answer every missed question correctly)" },
        { id: "r2-3", t: "Pass the CAF retake",
          cert: { name: "Claude Certified Architect – Foundations (CCAR-F)", issuer: "Anthropic" },
          skill: ["Claude API", "Claude Agent SDK", "Model Context Protocol (MCP)", "Claude Code"],
          resume: "Earned the Claude Certified Architect – Foundations certification covering agentic architecture, tool design/MCP, Claude Code workflows, structured output and context management." }
      ] },
    { id: "S3", phase: "P2", start: "2026-10-29", end: "2026-11-11", name: "Project 1 — Agentic",
      focus: "An agent that completes a real multi-step task.",
      milestones: [
        { id: "r3-1", t: "Pick the real multi-step task Project 1 will automate" },
        { id: "r3-2", t: "Build the agent loop with at least 3 tools", skill: ["Agent design", "Tool use"] },
        { id: "r3-3", t: "Write a small eval set and run it against the agent", skill: ["Evals"] },
        { id: "r3-4", t: "Ship Project 1: repo + README + demo (mark it Shipped in Projects)", skill: ["Git", "Python"] },
        { id: "r3-5", t: "Publish the Project 1 write-up" }
      ] },
    { id: "S4", phase: "P2", start: "2026-11-12", end: "2026-11-25", name: "Project 2 — Retrieval",
      focus: "RAG over a real dataset or document set.",
      milestones: [
        { id: "r4-1", t: "Choose the dataset / document set for Project 2" },
        { id: "r4-2", t: "Build embeddings + retrieval pipeline", skill: ["Embeddings", "RAG"] },
        { id: "r4-3", t: "Create a retrieval eval (questions with known answers) and record the score", skill: ["Evals"] },
        { id: "r4-4", t: "Ship Project 2: repo + README + demo (mark it Shipped in Projects)" },
        { id: "r4-5", t: "Publish the Project 2 write-up" }
      ] },
    { id: "S5", phase: "P2", start: "2026-11-26", end: "2026-12-09", name: "Project 3 + portfolio",
      focus: "Health-adjacent project — your edge — plus a portfolio page.",
      milestones: [
        { id: "r5-1", t: "Define the Project 3 user and problem (fitness / nutrition / client check-in)" },
        { id: "r5-2", t: "Build and test Project 3 with at least one real user", skill: ["Applied AI", "Domain expertise (health & fitness)"] },
        { id: "r5-3", t: "Ship Project 3 (mark it Shipped in Projects)" },
        { id: "r5-4", t: "Portfolio page lists all three projects with write-ups" },
        { id: "r5-5", t: "Deploy something once (any host) to learn the workflow", skill: ["Deployment"] }
      ] },
    { id: "S6", phase: "P3", start: "2026-12-10", end: "2026-12-23", name: "Resume + LinkedIn",
      focus: "Reframe fitness experience as an AI builder.",
      milestones: [
        { id: "r6-1", t: "Resume reframed (use the Digital Resume view as the draft)" },
        { id: "r6-2", t: "LinkedIn rebuilt: headline, About, projects, certification" },
        { id: "r6-3", t: "Two people review the resume and LinkedIn" }
      ] },
    { id: "S7", phase: "P3", start: "2026-12-24", end: "2027-01-06", name: "Market map + networking",
      focus: "Know exactly who to talk to; start talking.",
      milestones: [
        { id: "r7-1", t: "DC market map: 20+ gov contractors and health-tech startups with contacts" },
        { id: "r7-2", t: "Hold 2–3 networking conversations this week" },
        { id: "r7-3", t: "Hold 2–3 networking conversations next week" }
      ] },
    { id: "S8", phase: "P3", start: "2027-01-07", end: "2027-01-20", name: "Networking + applications",
      focus: "Conversations turn into referrals and first applications.",
      milestones: [
        { id: "r8-1", t: "Hold 2–3 networking conversations per week (both weeks)" },
        { id: "r8-2", t: "Submit the first 5 applications" },
        { id: "r8-3", t: "Define the freelance offer: AI automation for small businesses" }
      ] },
    { id: "S9", phase: "P4", start: "2027-01-21", end: "2027-02-03", name: "Hunt",
      focus: "Volume + quality applications; interview reps.",
      milestones: [
        { id: "r9-1", t: "20 applications submitted (running total)" },
        { id: "r9-2", t: "Two mock interviews completed" },
        { id: "r9-3", t: "First interview scheduled" }
      ] },
    { id: "S10", phase: "P4", start: "2027-02-04", end: "2027-02-17", name: "Hunt + freelance",
      focus: "Run both tracks at once.",
      milestones: [
        { id: "r10-1", t: "Reach out to 10 small businesses with the freelance offer" },
        { id: "r10-2", t: "Run one freelance discovery call" },
        { id: "r10-3", t: "Second-round interview or equivalent reached" }
      ] },
    { id: "S11", phase: "P4", start: "2027-02-18", end: "2027-03-03", name: "Close",
      focus: "Convert pipeline to an outcome.",
      milestones: [
        { id: "r11-1", t: "Follow up on every open application and conversation" },
        { id: "r11-2", t: "Send a freelance proposal" }
      ] },
    { id: "S12", phase: "P4", start: "2027-03-04", end: "2027-03-31", name: "Close / buffer",
      focus: "Offer or signed freelance work by March 31.",
      milestones: [
        { id: "r12-1", t: "Offer accepted or freelance work signed",
          resume: "Transitioned into AI work in March 2027." }
      ] }
  ]
};
