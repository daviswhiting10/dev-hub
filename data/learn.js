// LEARN — a one-week AI curriculum built from the chapters of Nick Saraev's “The Last AI Roadmap Video You’ll Ever Watch”
// (https://www.youtube.com/watch?v=KjKlBvX9G7w). PROVISIONAL: built from the video's chapter titles; the transcript wasn't
// available, so refine the tasks once you've watched. Checked items feed the Resume (skills / highlights).
// An item is { id, t, link?, skill?, resume? } — same shape as data/playbook.js.
window.HUB_DATA = window.HUB_DATA || {};
(function () {
  var V = "https://www.youtube.com/watch?v=KjKlBvX9G7w&t=";
  window.HUB_DATA.learn = {
    source: "Nick Saraev — The Last AI Roadmap Video You’ll Ever Watch (36:15)",
    principle: "Seven days, one idea a day: understand the machine, the industry, and how to put it to work.",
    steps: [
      { id: "ln1", n: 1, name: "Day 1 · AI history (1950s → now)", why: "Know where the field came from so today's news has context.",
        items: [
          { id: "ln1-1", t: "Watch the history segment (1:20)", link: V + "80s" },
          { id: "ln1-2", t: "Write a one-page timeline: early AI → deep learning → transformers → chatbots → agents", skill: ["AI history"] } ] },
      { id: "ln2", n: 2, name: "Day 2 · How LLMs actually work", why: "The mental model behind every capability and failure.",
        items: [
          { id: "ln2-1", t: "Watch “How LLMs Actually Work” (5:42)", link: V + "342s" },
          { id: "ln2-2", t: "Explain tokens, embeddings, attention, and next-token prediction in your own words", skill: ["LLM fundamentals"] } ] },
      { id: "ln3", n: 3, name: "Day 3 · The AI stack", why: "Chips, data centers, models, apps: where value and bottlenecks sit.",
        items: [
          { id: "ln3-1", t: "Watch “The AI Stack” (12:49)", link: V + "769s" },
          { id: "ln3-2", t: "Sketch the stack from hardware to applications and mark where you want to work", skill: ["AI infrastructure"] } ] },
      { id: "ln4", n: 4, name: "Day 4 · The major AI labs", why: "Who builds what, and what each lab is betting on.",
        items: [
          { id: "ln4-1", t: "Watch “The Major AI Labs” (18:46)", link: V + "1126s" },
          { id: "ln4-2", t: "Make a one-line profile of each major lab: strengths, flagship models, direction", skill: ["AI landscape"] } ] },
      { id: "ln5", n: 5, name: "Day 5 · Recursive self-improvement", why: "The idea behind the fastest-moving parts of the field (and your own agents).",
        items: [
          { id: "ln5-1", t: "Watch “Recursive Self-Improvement” (23:49)", link: V + "1429s" },
          { id: "ln5-2", t: "Summarize it in five bullets and note how your Briefing agents apply it to themselves", skill: ["Recursive self-improvement"] } ] },
      { id: "ln6", n: 6, name: "Day 6 · Tools and prompting", why: "Hands-on: the tools to learn and how to talk to models well.",
        items: [
          { id: "ln6-1", t: "Watch “The Tools to Learn” (26:42)", link: V + "1602s" },
          { id: "ln6-2", t: "Try each tool the video names for 15 minutes and keep notes on what each is best at", skill: ["AI tooling"] },
          { id: "ln6-3", t: "Watch “How to Prompt” (28:51), then rewrite three of your own prompts using its structure", link: V + "1731s", skill: ["Prompt engineering"] } ] },
      { id: "ln7", n: 7, name: "Day 7 · Turning AI into money", why: "Connect what you learned to income and your edge in health and fitness.",
        items: [
          { id: "ln7-1", t: "Watch “Turning AI Into Money” (31:09)", link: V + "1869s" },
          { id: "ln7-2", t: "List three ways to monetize AI skills using your fitness background", skill: ["AI business"] },
          { id: "ln7-3", t: "Watch “AI Opportunities Are Coming” (34:55) and pick one area to track in your daily briefing", link: V + "2095s",
            resume: "Completed a structured one-week AI curriculum covering LLM fundamentals, the AI stack, major labs, tooling, and prompting." } ] }
    ]
  };
})();
