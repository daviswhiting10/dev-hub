// Practice Bank 5 — Remediation: delegation, review architecture, orchestration, subagent prompts (D1), session resumption (D5)
// Source: CAF score report 2026-10-14 — objectives scored 0–67%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 5,
  title: "Remediation 2: Subagents, delegation & orchestration",
  questions: [
{s:3,d:1,q:"You are the engineer designing the coordinator for a competitive-intelligence agent. Subagent A must find pricing changes across 40 competitor sites. The sites vary: some publish PDFs, some have JSON endpoints, and some hide prices behind a login. Your first design gives subagent A a 15-step script, and it fails on about a third of the sites. Which prompt strategy enables adaptive behavior while the coordinator keeps visibility?",
o:["Describe the outcome, constraints, and required report schema, and let the subagent choose how to reach each site's prices",
"Extend the script with extra branches for PDFs, JSON endpoints, and logins, so every site type is spelled out in advance",
"Give the subagent only a list of URLs with no guidance, and let it return whatever format it prefers for each competitor over time",
"Replace the subagent with a scheduled scraper per site, since adaptive behavior is not something subagents can provide overall"],
a:[0],e:"Goal-oriented delegation describes the outcome and constraints, letting the subagent adapt as it discovers new site types. The coordinator keeps visibility and control through the output schema and reporting requirements. A longer script cannot anticipate every case."},

{s:3,d:1,q:"A payroll team uses an agent subtask that must generate a tax filing file by following a regulator's exact sequence of steps in a fixed order, and any deviation causes the filing to be rejected. Which delegation style is appropriate for that subtask?",
o:["Procedural step-by-step instructions, because the sequence is exact and well understood and any deviation is the main risk",
"Goal-oriented instructions, because the subagent should be free to find its own creative route to a valid filing each time",
"No instructions at all, because a capable subagent will infer the regulator's required order of operations from the filing name",
"Goal-oriented instructions with a high temperature, so the subagent explores several orders and keeps whichever one is accepted"],
a:[0],e:"Procedural fits deterministic, exact-sequence work where deviation is the risk. Goal-oriented fits adaptive work where rigidity is the risk. Match the strategy to the subtask."},

{s:3,d:1,q:"You gave a research subagent a goal-oriented prompt so it can adapt to what it finds, but your engineering manager worries the coordinator will lose control of what the subagent does. How does the coordinator keep visibility and control?",
o:["Through a required output schema, reporting requirements, and scoping of tools, context, and role, not by dictating each step",
"By watching every tool call in real time and interrupting whenever the subagent chooses a path the coordinator did not expect as well",
"By accepting that control is lost, since adaptive behavior and coordinator oversight cannot coexist in any design of this kind",
"By switching to step-by-step instructions the moment a result looks unusual, then back again once the subagent is on track overall"],
a:[0],e:"Adaptivity without control is chaos. The coordinator stays in command through output schemas (what comes back), reporting requirements, and scoping of tools, context, and role, not by micromanaging steps."},

{s:2,d:1,q:"You are the lead engineer for a payments platform. A change request asks an agent to migrate the retry logic for production card payments. The change touches ledger writes and requires sign-off from a risk officer before anything ships. Which agentic review architecture fits?",
o:["Plan mode: explore read-only, produce a written plan, and get human approval from the risk officer before any edits are made",
"Direct execution: the agent knows the codebase well enough to make the change and open a pull request for later review over time",
"A multi-phase workflow with no checkpoints, so each phase runs to completion without waiting on any human reviewer in practice",
"Fully autonomous execution with a post-hoc audit, since the risk officer can review the deployed change after it ships overall"],
a:[0],e:"Select the architecture by scope, risk level, and approval requirements: plan mode for high risk plus human approval, direct execution for low-risk routine work, and multi-phase workflows for complex staged efforts."},

{s:2,d:1,q:"A technical writer asks your agent to fix a misspelling in a code comment. It is in one file, with no behavior change and no approvals required. Which architecture is the best match for the risk and scope?",
o:["Direct execution, since the scope is tiny and the risk is close to zero, so extra planning would be pure overhead",
"Plan mode with human approval, so that a reviewer signs off on the comment edit before the file is touched at all",
"A multi-phase workflow with separate analysis, implementation, and verification stages for the one-line comment change",
"Coordinator-worker fan-out with one subagent per file that might contain a similar misspelling elsewhere in the code"],
a:[0],e:"Match the architecture to the risk. A typo fix is minimal scope and near-zero risk, so direct execution is right. Plan mode or multi-phase workflows would be pure overhead."},

{s:3,d:1,q:"A security team needs the same dependency-vulnerability review run on 10 independent services, with all results merged into one report for the CISO. The services do not depend on each other. Which orchestration pattern fits best?",
o:["Coordinator-worker: fan out one subagent per service in parallel, then have the coordinator merge the findings into the report",
"Sequential pipeline: review one service at a time in order and append each result to the report before starting the next overall",
"A single agent that loads all ten services into one huge context and reviews them together in a single long pass",
"Plan mode only, since the review needs just a proposed plan for each service and no execution against the codebases"],
a:[0],e:"Coordinator-worker (fan-out, fan-in) is the pattern for independent parallel work plus a synthesis step. Sequential pipelines are for strict ordering, and one giant context wastes the parallelism."},

{s:3,d:1,q:"A data team's nightly pipeline has three stages: ingest, dedupe, and enrich. Dedupe needs the finished output of ingest, and enrich needs the finished output of dedupe. Which orchestration pattern fits?",
o:["A sequential pipeline, because each stage requires the finished output of the stage before it before it can start its work",
"Parallel execution, because all three stages can start at the same time and be reconciled when they eventually finish",
"Coordinator-worker fan-out, because each stage should be handled by its own dedicated subagent running at the same time",
"Plan mode, because strictly ordered work should always be approved by a human before the first stage begins to run"],
a:[0],e:"Strict data dependencies force a sequential pipeline. Parallel execution is only valid when steps are independent, which is the orchestration mirror of the parallel-tool-call rule."},

{s:3,d:1,q:"An engineer proposes running a refund workflow's steps (validate the order, compute the refund, issue the payment, send the receipt) as parallel subagents to save time. When is parallel execution the wrong choice, and does that apply here?",
o:["It is wrong when later steps need earlier results, and here compute, payment, and receipt each depend on the step before them",
"It is wrong only when there are many subtasks, and here four steps is few enough that parallel execution is a safe choice each time",
"It is wrong when the task is large, and here the workflow is small enough that all four steps can safely run together over time",
"It is wrong when subtasks are fully independent, and here the four steps are independent enough to run in separate agents each time"],
a:[0],e:"Dependencies are what rule parallelism out. Independent subtasks are exactly what parallel execution is for, while shared dependencies demand sequencing or a coordinator-worker design with explicit handoffs."},

{s:3,d:1,q:"Your report-writing subagent keeps messaging the coordinator for findings it needs: source metadata, the three key quotes, and the customer segment. Each round trip adds about 20 seconds to the job. What should you change?",
o:["Build its prompt with all findings, structured data, and source metadata it needs up front, so that it can finish without asking",
"Give the subagent additional search tools so it can go and find the missing context by itself whenever it decides to do so as well",
"Shrink the subagent's context window so that it is forced to focus on only the most recent instruction it has received",
"Replace the subagent with a procedural script that never needs any additional context beyond a fixed set of inputs"],
a:[0],e:"A subagent prompt must be self-sufficient: all findings, structured data, and source metadata included up front. Every return trip for missing context is a prompt-construction failure."},

{s:4,d:5,q:"A long-running repo-migration agent was interrupted at 60% completion when a laptop restarted. Twelve files were migrated and committed since the last checkpoint, and two files were modified by teammates in the meantime. How should you resume without repeating work or losing state?",
o:["Restore the saved state, re-analyze only the files that changed since the checkpoint, and inject the recorded progress into the agent's context",
"Restart from the beginning so the agent rebuilds all of its context from scratch and never acts on outdated information",
"Enlarge the context window and replay the earlier conversation, hoping the full prior history still fits and stays accurate for this run",
"Ask the engineer to write a summary of what happened before the crash and treat that summary as the complete and reliable state"],
a:[0],e:"Session resumption means targeted re-analysis of what changed plus context injection to restore state. Combined with state persistence (scratchpad or state files), completed work is never repeated or lost."}
  ]
});
