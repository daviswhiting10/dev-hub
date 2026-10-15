// Practice Bank 5 — Remediation: delegation, review architecture, orchestration, subagent prompts (D1), session resumption (D5)
// Source: CAF score report 2026-10-14 — objectives scored 0–67%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 5,
  title: "Remediation 2: Subagents, delegation & orchestration",
  questions: [
{s:3,d:1,q:"Goal-oriented versus procedural subagent instructions: which approach enables adaptive behavior in the subagent?",
o:["Goal-oriented: describe the outcome and constraints, and let the subagent adapt to findings",
"Procedural: exact step-by-step instructions leave nothing to chance for the subagent",
"Neither: subagents should only ever run fixed scripts that the coordinator wrote in advance",
"Both behave identically in practice, so the choice only affects how the prompt is worded"],
a:[0],e:"Goal-oriented delegation describes the outcome and constraints, letting the subagent adapt as new information appears. The coordinator keeps visibility and control through output schemas and reporting requirements."},

{s:3,d:1,q:"When is procedural (step-by-step) delegation the better choice over goal-oriented delegation?",
o:["The subtask is well understood and must run an exact sequence without any deviation",
"The subtask is novel and exploratory, so the subagent needs room to choose its path",
"You want the subagent to be maximally creative about how it approaches the assignment",
"Procedural instructions are never better, because goal-oriented prompts always win out"],
a:[0],e:"Procedural fits deterministic, exact-sequence work where deviation is the risk. Goal-oriented fits adaptive work where rigidity is the risk. Match the strategy to the subtask."},

{s:3,d:1,q:"With goal-oriented delegation, how does the coordinator maintain visibility and control over the subagent?",
o:["Structured output schemas, reporting requirements, and scoping of tools, context, and role",
"Watching every tool call the subagent makes in real time and interrupting when it strays",
"It cannot keep visibility, because losing control is the accepted cost of adaptive agents",
"Switching to procedural instructions in the middle of the task whenever results look off"],
a:[0],e:"Adaptivity without control is chaos. The coordinator stays in command through output schemas (what comes back), reporting requirements, and scoping of tools, context, and role, not by micromanaging steps."},

{s:2,d:1,q:"A task involves migrating production payment logic. It is high risk and needs human sign-off. Which agentic review architecture fits?",
o:["Plan mode: explore read-only, propose a plan, and get human approval before any changes",
"Direct execution: make the change immediately since the agent already knows the codebase",
"A multi-phase workflow with no checkpoints so that each phase runs to completion alone",
"Fully autonomous execution with a post-hoc review after the payment changes are deployed"],
a:[0],e:"Select the architecture by scope, risk level, and approval requirements: plan mode for high risk plus human approval, direct execution for low-risk routine work, and multi-phase workflows for complex staged efforts."},

{s:2,d:1,q:"The task is fixing a typo in a code comment. Which agentic review architecture is appropriate?",
o:["Direct execution, because the scope is tiny and the risk is close to zero for the change",
"Plan mode with human approval, so a reviewer signs off before the comment is edited",
"A multi-phase workflow with separate analysis, implementation, and verification phases",
"Coordinator-worker fan-out with one subagent per file that could contain a similar typo"],
a:[0],e:"Match the architecture to the risk. A typo fix is minimal scope and near-zero risk, so direct execution is right. Plan mode or multi-phase workflows would be pure overhead."},

{s:3,d:1,q:"Ten independent files each need the same security review, with the results merged into one report. Which orchestration pattern fits?",
o:["Coordinator-worker: fan out one subagent per file, then the coordinator merges the findings",
"Sequential pipeline: review one file at a time in order and append each result to a report",
"A single agent that loads all ten files into one giant context and reviews them together",
"Plan mode with no execution, since the review only needs a proposed plan for the files"],
a:[0],e:"Coordinator-worker (fan-out, fan-in) is the pattern for independent parallel work plus a synthesis step. Sequential pipelines are for strict ordering, and one giant context wastes the parallelism."},

{s:3,d:1,q:"In a pipeline, step 2 strictly requires step 1's output, and step 3 strictly requires step 2's. Which pattern fits?",
o:["Sequential pipeline, because each step requires the output of the step before it",
"Parallel execution, because all three steps can start at the same moment in time",
"Coordinator-worker fan-out, because each step should have its own dedicated subagent",
"Plan mode, because strictly ordered work should always be approved by a human first"],
a:[0],e:"Strict data dependencies force a sequential pipeline. Parallel execution is only valid when steps are independent; this is the orchestration mirror of the parallel-tool-call rule."},

{s:3,d:1,q:"When is parallel execution the WRONG orchestration choice?",
o:["When subtasks share dependencies, so later steps need the results of earlier steps",
"When there are many subtasks, because parallel runs slow down as the count increases",
"When the overall task is large, since large tasks must always be run one step at a time",
"When subtasks are independent, because independent work should always be run in order"],
a:[0],e:"Dependencies are what rule parallelism out. Independent subtasks are exactly what parallel execution is for; shared dependencies demand sequencing or a coordinator-worker design with explicit handoffs."},

{s:3,d:1,q:"A subagent keeps returning to the coordinator to ask for context it should already have. What is the fix?",
o:["Build its prompt with all findings, structured data, and source metadata needed up front",
"Give the subagent more tools so it can go find the missing context on its own each time",
"Shrink its context window so that it is forced to focus on only the most recent request",
"Replace the subagent with a procedural script that never needs any additional context"],
a:[0],e:"A subagent prompt must be self-sufficient: all findings, structured data, and source metadata included up front. Every return trip for missing context is a prompt-construction failure."},

{s:4,d:5,q:"An agent session is interrupted mid-task. How do you resume accurately without repeating prior work?",
o:["Re-analyze only the changed files and inject the saved state to restore context",
"Restart from the beginning so that the agent rebuilds all of its context from scratch",
"Enlarge the context window and hope that the full prior history still fits inside of it",
"Ask the user to write a summary of what happened and treat that as the complete state"],
a:[0],e:"Session resumption means targeted re-analysis of what changed plus context injection to restore state. Combined with state persistence (scratchpad or state files), completed work is never repeated or lost."}
  ]
});
