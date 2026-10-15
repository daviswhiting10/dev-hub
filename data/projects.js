// SEED PROJECTS — pre-loaded the first time the app runs. Add more in the app (Projects → Add project),
// or add a new object here with a unique id and it will appear automatically on next load.
// status: "idea" | "building" | "shipped"
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.projects = [
  { id: "proj-agentic", title: "Project 1 — Agentic",
    desc: "An agent that completes a real multi-step task end to end, using tools and checking its own work.",
    skills: ["Agent design", "Tool use"], status: "idea", repo: "", demo: "", writeup: "", note: "" },
  { id: "proj-retrieval", title: "Project 2 — Retrieval",
    desc: "RAG over a real dataset or document set, with an eval that measures whether retrieval is actually good.",
    skills: ["Embeddings", "Retrieval", "Evals"], status: "idea", repo: "", demo: "", writeup: "", note: "" },
  { id: "proj-health", title: "Project 3 — Health-adjacent",
    desc: "Fitness/health plus AI — your edge. Ideas: programming, nutrition, or client check-in tooling.",
    skills: ["Domain expertise", "Applied AI"], status: "idea", repo: "", demo: "", writeup: "", note: "" }
];
