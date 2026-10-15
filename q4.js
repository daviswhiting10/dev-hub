// Practice Bank 4 — Remediation: parallel tool calls (D1), iterative refinement & truncation (D4)
// Source: CAF score report 2026-10-14 — objectives scored 0%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 4,
  title: "Remediation 1: Parallel calls, refinement & truncation",
  questions: [
{s:3,d:1,q:"An agent must read five independent source files to explain how authentication works. What approach minimizes total round-trip latency?",
o:["Emit all five Read calls together in one response turn so they execute in parallel",
"Issue one Read call per turn across five turns so each result informs the next call",
"Ask the user to paste the contents of each file into chat before starting the analysis",
"Read the files in alphabetical order so the results stay organized and easy to compare"],
a:[0],e:"Independent tool calls emitted in a single turn run in parallel, so total latency is roughly the slowest call instead of the sum of five round trips. Sequential turns multiply latency for no benefit."},

{s:4,d:1,q:"Call #2 needs the output of call #1 (for example, a Glob to find a config file, then a Read to open it). What is the correct approach?",
o:["Emit the Glob first, then emit the Read in a later turn once the path is returned",
"Emit both calls in the same turn and let the runtime reorder them by dependency",
"Skip the Glob entirely and guess the config file path from common naming habits",
"Run both calls at once and discard whichever of the two results arrives second"],
a:[0],e:"Dependent calls must be sequenced across turns, because you cannot use a result you do not have yet. Parallel emission is only valid for independent calls with no data dependencies."},

{s:3,d:1,q:"Which set of subtasks is safe to parallelize within a single response turn?",
o:["Search three unrelated repositories for the same symbol and compare their results",
"Write file A, then read file A back in the same turn to verify the saved contents",
"Create a database record, then query that record back to confirm it was inserted",
"Deploy a service, then run smoke tests against the newly created deployment"],
a:[0],e:"Parallelize only independent subtasks. The three searches share no dependencies; every other option has a strict data dependency (write then read, create then query, deploy then test) and must be sequenced."},

{s:4,d:1,q:"An agent must (1) Grep the repo for TODO comments, (2) read package.json, and (3) read the file with the most TODOs. What is the minimum number of turns?",
o:["Two turns: Grep and read package.json together, then read the file the Grep identified",
"One turn: emit all three calls together because every call is a read-only operation",
"Three turns: one call per turn, which is the safest way to avoid ordering mistakes",
"Two turns: all three calls first, then a second turn used only to verify the results"],
a:[0],e:"Steps 1 and 2 are independent, so they go in one turn. Step 3 depends on step 1's result, so it must wait for the next turn. Two turns is the optimum."},

{s:3,d:1,q:"What is the main latency benefit of parallel tool execution over sequential execution?",
o:["Independent subtasks finish in about the time of the slowest one, not the sum of all",
"It uses fewer tokens overall because the model reasons about all the subtasks at once",
"It produces higher-quality outputs because each call receives more of the model's focus",
"It lowers API cost because parallel requests are billed at a discounted per-call rate"],
a:[0],e:"Latency math: parallel is roughly max(duration), sequential is sum(duration). Parallelism attacks round-trip latency, not token usage, quality, or cost."},

{s:5,d:4,q:"A code-review agent keeps flagging the same class of false positive. Which refinement inputs fix this most effectively?",
o:["Concrete input-output examples, targeted feedback on the specific failures, and batched issue descriptions",
"A higher sampling temperature plus extra turns so the agent has more room to think everything through",
"Fewer available tools, which reduces the decision complexity the agent has to handle during every review",
"A longer system prompt that restates the overall review goal with much more detail and added emphasis"],
a:[0],e:"Iterative refinement means concrete examples, targeted feedback on specific failures, and batched issue descriptions for consolidated evaluation. Restating the goal more loudly does not fix a repeated failure mode."},

{s:5,d:4,q:"Why batch multiple issue descriptions together instead of feeding failures back one at a time?",
o:["Batching lets the model compare cases together and calibrate, not patch one case at a time",
"Batching always uses fewer tokens, so it is cheaper than sending each issue description separately",
"The API rejects feedback that arrives as a single issue description, so batching is mandatory",
"Batching eliminates hallucinations entirely because the model sees every failure in one message"],
a:[0],e:"Batched issues let the model compare cases and calibrate its judgments, which is what consolidated evaluation means. One-at-a-time feedback tends to fix one case while quietly regressing others."},

{s:5,d:4,q:"After targeted feedback, the agent fixes the reported failures but regresses on cases it previously got right. What refinement change addresses this?",
o:["Batch diverse issue descriptions with concrete examples so every case is evaluated together",
"Lower the temperature to zero so the agent stops changing answers that were already correct",
"Give the agent more tools so it can verify each earlier answer independently after every fix",
"Accept the regressions, because the task is beyond what the model is able to do reliably"],
a:[0],e:"Fixing one reported case while breaking others is a common sign that feedback is too narrow. Batching diverse issues, with examples, keeps all the cases in view so the model calibrates across them."},

{s:6,d:4,q:"A large review task returns truncated JSON: the structured output cuts off mid-object. What is the correct fix?",
o:["Split the task into smaller scoped API calls and merge the resulting data structures",
"Raise max_tokens far beyond practical limits and retry the same large request again",
"Switch from tool use to prompt-based formatting so the model writes shorter output",
"Set the temperature to zero and retry, which makes the model stop cutting off JSON"],
a:[0],e:"The prescribed fix for truncation is to decompose the work into smaller scoped calls and merge the results. Raising max_tokens does not address reliability, because huge single outputs stay fragile."},

{s:6,d:4,q:"Why is “just increase max_tokens” the wrong response to structured-output truncation?",
o:["Huge single outputs stay fragile, so decomposing the work is the more robust fix",
"The max_tokens parameter is deprecated and is ignored by current model versions",
"It only takes effect when streaming is enabled, which the review job does not use",
"It raises latency but never cost, so it is only suitable for low-volume workloads"],
a:[0],e:"Bigger limits move the failure point instead of removing it. Smaller scoped calls bound the damage of any single failure and merge deterministically."}
  ]
});
