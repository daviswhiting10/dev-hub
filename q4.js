// Practice Bank 4 — Remediation: parallel tool calls (D1), iterative refinement & truncation (D4)
// Source: CAF score report 2026-10-14 — objectives scored 0%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 4,
  title: "Remediation 1: Parallel calls, refinement & truncation",
  questions: [
{s:3,d:1,q:"You are a platform engineer building an internal “Explain this service” agent. When an engineer asks how authentication works, the agent needs to read five independent files: auth/login.ts, auth/session.ts, auth/middleware.ts, config/auth.yaml, and the OAuth provider adapter. Traces show the agent issuing one Read per turn, and the full answer takes about 25 seconds, mostly spent waiting between turns. Each individual Read takes about 3 seconds. What change cuts the total latency the most?",
o:["Have the agent emit all five Read calls in a single response turn, so the independent reads run in parallel and the wait is about one read",
"Have the agent keep one Read per turn but cache each file after reading it, so later questions about authentication reuse the contents",
"Have the agent read the files in order of size with the smallest first, so early turns finish quickly and later turns see more context over time",
"Have the agent ask the engineer to attach the five files in the chat, so that no Read tool calls are needed at all while it answers overall"],
a:[0],e:"Independent tool calls emitted in a single turn execute in parallel, so total latency is roughly the slowest call (about 3 seconds) instead of the sum of five round trips. Caching helps later questions but not this one, reordering does not remove the turns, and asking the user to paste files just moves the work."},

{s:4,d:1,q:"Your CI-triage agent is asked to find the pipeline config for a failing repository and then read the matching file to diagnose the failure. To save a turn, the agent plans to emit a Glob for **/*.pipeline.yml and a Read of the resulting file in the same response. What is wrong with this plan, and what should it do instead?",
o:["The Read depends on the path the Glob returns, so the agent must wait for the Glob result and issue the Read in the next turn",
"Nothing is wrong, since the runtime reorders tool calls by dependency and feeds the Glob result into the Read automatically",
"The Read should use a guessed path based on the repository name, so both calls are independent and still run in one turn",
"Both calls should be dropped in favor of a Bash command that runs cat on a wildcard pattern, which always finishes in one step"],
a:[0],e:"Dependent calls must be sequenced across turns, because you cannot use a result you do not have yet. Parallel emission is only valid for independent calls with no data dependencies. Guessing a path trades correctness for speed."},

{s:3,d:1,q:"A release manager asks your automation agent to prepare a go/no-go summary for tonight's deploy. The agent has four candidate sets of subtasks and wants to run as many as is safe in the same turn. Which set can be emitted together in one response turn?",
o:["Query the incident tracker, check the staging dashboard, and list the open release blockers, none of which uses another's output",
"Create the release branch, then tag the commit on that new branch, which requires the branch name returned by the first call",
"Write the draft summary to a file, then read the file back to confirm that the contents match what was written a moment ago",
"Open a deployment ticket, then attach the build log to that ticket, which needs the ticket ID created by the first call"],
a:[0],e:"Parallelize only independent subtasks. The tracker query, the dashboard check, and the blocker list share no dependencies. Every other option has a strict data dependency (branch then tag, write then read, ticket then attachment) and must be sequenced."},

{s:4,d:1,q:"Your agent is asked to (1) Grep the repository for TODO comments, (2) read package.json to check which test runner is configured, and (3) open whichever file contains the most TODOs. The team lead wants the fewest turns that still keep the results correct. What is the minimum number of turns?",
o:["Two turns: Grep and read package.json together in turn one, then read the top file that the Grep identified in turn two",
"One turn: emit all three calls together, since every call only reads data and therefore cannot conflict with another one",
"Three turns: one call per turn, which is the safest way to avoid ordering mistakes between the dependent file reads over time",
"Two turns: emit all three calls in turn one, then use a second turn only to verify that the results are consistent"],
a:[0],e:"Steps 1 and 2 are independent, so they go in one turn. Step 3 depends on step 1's result, so it must wait for the next turn. Two turns is the optimum."},

{s:3,d:1,q:"Your team is deciding whether to refactor an agent so independent subtasks run in parallel. Today its four subtasks take 4s, 6s, 3s, and 5s sequentially (18s in total), and none of them depends on another. A skeptic on the team claims parallelism will also cut token cost by about three quarters. What is the accurate expectation?",
o:["Latency drops to roughly the slowest call, about 6 seconds, while token usage stays about the same because the same work is done",
"Latency drops to roughly 4.5 seconds, the average of the four calls, and token usage drops by about the same proportion over time",
"Latency stays near 18 seconds because the calls share one connection, but cost drops since the requests are billed together",
"Latency drops to about 3 seconds, the fastest call, because the agent stops as soon as any one of the four calls returns"],
a:[0],e:"Latency math: parallel is roughly max(duration) and sequential is sum(duration), so about 6 seconds here. Parallelism attacks round-trip latency, not token usage, quality, or cost."},

{s:5,d:4,q:"You maintain a pull-request review agent. It repeatedly flags the same class of false positive: it labels early-return guard clauses as “complex control flow.” You have already reworded the instructions twice with no effect. Which inputs should your next iteration most likely include?",
o:["Concrete input-output examples of guard clauses it should leave alone, targeted feedback on the failing cases, and a batch of issue descriptions",
"A higher sampling temperature plus extra reasoning turns, so that the agent has more room to reconsider each flagged guard clause when it matters",
"A smaller toolset for the review agent, so that fewer available actions reduce the decisions it must make on each pull request across the whole service",
"A longer system prompt that restates the review goal and adds firmer language about avoiding unnecessary or noisy comments across the whole service"],
a:[0],e:"Iterative refinement means concrete examples, targeted feedback on specific failures, and batched issue descriptions for consolidated evaluation. Restating the goal more loudly does not fix a repeated failure mode."},

{s:5,d:4,q:"While iterating on the review agent, an engineer pastes feedback one failure at a time and re-runs after each. After eight rounds, the fixed cases pass but two earlier ones fail again. A colleague suggests sending several issue descriptions together instead. What is the best reason to batch?",
o:["Seeing several cases at once lets the model calibrate across them and find the pattern, instead of patching one case at a time",
"Batching always lowers token usage, so the iteration loop becomes cheaper even when the agent's behavior stays the same",
"The API rejects feedback that describes only one failure, so each refinement request must contain at least three issues",
"Batching eliminates hallucinations, because the model can cross-check each issue against the others before it responds as a result"],
a:[0],e:"Batched issues let the model compare cases and calibrate its judgments, which is what consolidated evaluation means. One-at-a-time feedback tends to fix one case while quietly regressing others."},

{s:6,d:4,q:"Your data-cleaning agent normalizes customer addresses. After you give it targeted feedback on three reported failures (apartment numbers, PO boxes, and ZIP+4 codes), it fixes those but now mishandles several address types that previously worked. What does this pattern suggest about your refinement inputs?",
o:["The feedback was too narrow; batch diverse issue descriptions with concrete examples so that all cases are evaluated together",
"The temperature is too high, so the agent should be set to zero to stop it from changing answers that were already right",
"The agent needs more tools, so it can re-verify each previously correct answer independently after every single fix",
"The task is beyond the model's ability, so the regressions should be accepted as an unavoidable limit of the approach"],
a:[0],e:"Fixing a few reported cases while breaking others is a common sign that feedback is too narrow. Batching diverse issues, with examples, keeps all of the cases in view so the model calibrates across them."},

{s:6,d:4,q:"A code-review agent audits large pull requests and returns a structured JSON list of findings. On a 400-line PR the JSON is cut off mid-object, which breaks your parser. A teammate wants to apply the obvious fix. Which action best resolves the problem?",
o:["Split the review into smaller scoped calls, such as one per file or module, and merge the returned findings into one structure",
"Raise max_tokens far above practical limits and retry the same single large request, hoping that the output fits this time",
"Switch from tool use to prompt-based formatting, since plain-text JSON is shorter than tool-call JSON and avoids truncation",
"Set the temperature to zero and retry, since deterministic decoding stops the model from ending its output partway through"],
a:[0],e:"The prescribed fix for truncation is to decompose the work into smaller scoped calls and merge the results. Raising max_tokens does not address reliability, because huge single outputs stay fragile."},

{s:6,d:4,q:"A teammate fixes the truncated-JSON problem by raising max_tokens to the model's ceiling on every review. It works for two weeks, then a 900-line PR again returns cut-off output from a slow, timing-out request. Why was raising max_tokens the wrong primary fix?",
o:["Very large single outputs stay fragile, since length limits, timeouts, and partial failures persist; decomposing the work is the robust fix",
"The max_tokens parameter is deprecated and is ignored by current models, so the setting never had any effect on output length across projects",
"It only takes effect when streaming is enabled, which the review service does not use, so the value was silently ignored by the API",
"Raising it increases latency but can never affect cost, so it is only acceptable for low-volume jobs with relaxed deadlines during normal use"],
a:[0],e:"Bigger limits move the failure point instead of removing it. Smaller scoped calls bound the damage of any single failure and merge deterministically."}
  ]
});
