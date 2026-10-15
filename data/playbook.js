// 2026 AI ENGINEER PLAYBOOK — edit this file to change steps or items. No code changes needed.
// Distilled from the Instagram reel "22 Y/O CTO Explains How To Become An AI Engineer In 2026" (@swerikcodes, 59s),
// captured Oct 15, 2026 from on-screen text and captions (no audio transcript was available).
// An item is { id, t: "title", link?: "url", skill?: ["Skill"], resume?: "Resume bullet once checked" }.
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.playbook = {
  source: "Erik Cupsa (@swerikcodes) — “AI engineering in 2026 explained in 60 seconds”",
  principle: "Learn in this order, build as you go, and finish by shipping something real people use.",
  steps: [
    { id: "pb1", n: 1, name: "Python", why: "Everything else is built on it. Pick one course and finish it.",
      items: [
        { id: "pb1-1", t: "Work through ONE of: CS50x, 100 Days of Code (Angela Yu), or 30 Days of Python", link: "https://github.com/Asabeneh/30-Days-Of-Python", skill: ["Python"] },
        { id: "pb1-2", t: "Use Python Tutor to visualize code execution when stuck", link: "https://pythontutor.com" },
        { id: "pb1-3", t: "Write 5 small scripts that call an API and save the results", skill: ["APIs"] },
        { id: "pb1-4", t: "Learn git basics: commit, branch, push to GitHub", skill: ["Git"] }
      ] },
    { id: "pb2", n: 2, name: "ML fundamentals", why: "Understand what models are doing so you can debug them.",
      items: [
        { id: "pb2-1", t: "Start Andrew Ng’s Machine Learning Specialization (Coursera, free to audit)", link: "https://www.coursera.org/specializations/machine-learning-introduction", skill: ["Machine learning fundamentals"] },
        { id: "pb2-2", t: "Watch 3Blue1Brown’s neural network series", link: "https://www.youtube.com/@3blue1brown" },
        { id: "pb2-3", t: "Use StatQuest to fill statistics/ML gaps as they show up", link: "https://www.youtube.com/@statquest" }
      ] },
    { id: "pb3", n: 3, name: "LLMs", why: "“The core part of your work.”",
      items: [
        { id: "pb3-1", t: "Watch Karpathy’s “Neural Networks: Zero to Hero” playlist", link: "https://www.youtube.com/@AndrejKarpathy/playlists", skill: ["Neural networks", "LLM internals"] },
        { id: "pb3-2", t: "Learn the transformer architecture well enough to explain it to a friend", skill: ["Transformers"] },
        { id: "pb3-3", t: "Learn embeddings: what they are and how similarity search uses them", skill: ["Embeddings"] }
      ] },
    { id: "pb4", n: 4, name: "AI engineering", why: "Where you actually build: agents that use real tools.",
      items: [
        { id: "pb4-1", t: "Build an agentic app: a model that plans, calls tools, observes, and repeats", skill: ["Agentic applications", "Tool use"] },
        { id: "pb4-2", t: "Build a RAG app over documents you care about", skill: ["RAG"] },
        { id: "pb4-3", t: "Add evals so you can tell whether a change made things better", skill: ["Evals"] }
      ] },
    { id: "pb5", n: 5, name: "Ship", why: "A product with real users beats any certificate.",
      items: [
        { id: "pb5-1", t: "Study production practices: Made With ML", link: "https://madewithml.com", skill: ["MLOps"] },
        { id: "pb5-2", t: "Study Full Stack Deep Learning for deployment and monitoring", link: "https://fullstackdeeplearning.com", skill: ["Deployment", "Monitoring"] },
        { id: "pb5-3", t: "Ship one product to real users and collect feedback", skill: ["Product delivery"],
          resume: "Shipped an AI product to real users and iterated on their feedback." }
      ] }
  ]
};
