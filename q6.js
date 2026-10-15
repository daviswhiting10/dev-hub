// Practice Bank 6 — Remediation: built-in tool selection, MCP (D2), API processing modes (D4), context management (D5)
// Source: CAF score report 2026-10-14 — objectives scored 0–80%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 6,
  title: "Remediation 3: MCP, built-in tools & context management",
  questions: [
{s:4,d:2,q:"You need to find all files matching the pattern *.config.js in a large repository. Which Claude Code built-in tool is appropriate?",
o:["Glob, because it matches file names and paths against a pattern like *.config.js",
"Grep, because it searches file contents and so can find names ending in config.js",
"Read, because it opens files and can scan a large repository for matching names",
"Bash running ls -R and filtering the long output by hand to pick out matches"],
a:[0],e:"Glob is the file-pattern matcher (names and paths), Grep searches contents within files, Read opens a known file, and Bash runs shell commands. Match the tool to the nature of the operation."},

{s:4,d:2,q:"You need to find every call site of deprecated( across the repository's contents. Which tool is the right choice?",
o:["Grep, because it searches file contents for a string or pattern such as deprecated(",
"Glob with the pattern **/deprecated( since it can match across the whole repository",
"Read each file in the repository one by one and scan the text for matching calls",
"Bash with echo, because shell output is the only way to search inside of the files"],
a:[0],e:"Finding call sites is a content search, which is Grep's job. Glob finds files by name pattern and cannot see inside them; reading every file is slow and wasteful."},

{s:4,d:2,q:"You know the exact path src/auth/login.js and need its full contents. Which tool is the right choice?",
o:["Read the file directly at its known path because the location is already available",
"Grep for the string login across the repository and open whichever file comes back",
"Glob for **/login.js first to locate the file before it is opened for its contents",
"Bash with cat, treating the shell as the default option for every single file read"],
a:[0],e:"Read is for opening a known file. Grep and Glob are for finding things when you do not know where they are; using them here only adds pointless round trips."},

{s:1,d:2,q:"An MCP server exposes a read-only product catalog that the agent queries frequently. To cut exploratory tool calls and improve cross-system query efficiency, how should it be exposed?",
o:["As a resource: read-only content the agent can pull without any tool-call overhead",
"As a tool, so that the agent can invoke it whenever it wants to query the catalog",
"As a prompt template that is inserted into the system prompt on every single request",
"As an environment variable that the agent reads from the shell at startup each time"],
a:[0],e:"MCP resources are read-only data and tools are actions. Exposing frequently read content as resources removes wasteful exploratory tool calls."},

{s:1,d:2,q:"Which of these belongs in an MCP server as a tool rather than as a resource?",
o:["An action that provisions a new server, because it has a side effect when invoked",
"A read-only list of the regions that the product currently supports for customers",
"A static FAQ document that explains the most common questions about the product",
"A database schema description that lists each table, column, and its data types"],
a:[0],e:"Side effects belong in tools. Read-only data such as lists, documents, and schemas belongs in resources. The dividing line is whether invoking it changes anything."},

{s:2,d:2,q:"You are adding an MCP server that should be available only within a single project. Which server scope do you select?",
o:["Project scope, so the server is available only within that single project folder",
"User scope, so the server is available everywhere that this user opens Claude Code",
"The widest scope that is available, since it is more convenient for every project",
"Scope has no effect on MCP servers, so any of the available options works equally"],
a:[0],e:"Select the narrowest scope that meets the need: project-only servers get project scope, and personal utilities used everywhere get user scope. Over-scoping leaks tools into contexts where they do not belong."},

{s:2,d:2,q:"The MCP server requires an API key. How should authentication be configured?",
o:["Configure authentication through environment variable expansion in the server config",
"Hardcode the key directly inside the server configuration file for easy reference",
"Paste the key into the chat each time that the agent needs it for a tool request",
"Disable authentication entirely, since local servers never need to prove who they are"],
a:[0],e:"Environment variable expansion keeps secrets out of config files, repos, and chat transcripts. Hardcoded or pasted secrets leak, and disabling authentication is never the answer."},

{s:2,d:2,q:"After adding and configuring the MCP server, what is the final verification step?",
o:["Verify tool discovery by confirming the server's tools appear and can be called",
"Restart the computer so that every process picks up the new server configuration",
"Reinstall the server from scratch to make sure that the installation is not corrupt",
"Assume the setup worked because no error messages were shown during configuration"],
a:[0],e:"Integration is not done at configuration. Verify tool discovery to confirm the tools are actually visible and callable; this catches silent misconfiguration."},

{s:6,d:4,q:"A nightly job must process 50,000 documents. Latency does not matter, but cost does. Which API processing mode fits?",
o:["Asynchronous Message Batches API, which processes bulk work at a lower cost",
"Synchronous Messages API, sending one blocking request at a time for each document",
"Streaming responses from the Messages API so the job gets real-time progress updates",
"A long-lived connection that holds one session open for all of the 50,000 documents"],
a:[0],e:"The Message Batches API is built for large non-urgent workloads: asynchronous, cheaper, with results returned within a processing window. The synchronous Messages API is for latency-sensitive, blocking workflows."},

{s:4,d:5,q:"A codebase exploration spans multiple sessions and exceeds context limits. Which combination sustains coherent exploration?",
o:["Subagent isolation, scratchpad files, and targeted file reading across the sessions",
"One giant session with the whole codebase loaded into the context window up front",
"Raising max_tokens until the full exploration history fits inside the context window",
"Disabling all of the tools so that nothing gets added to the context during the work"],
a:[0],e:"No window is infinite. Isolate subagents so each holds only its slice, persist state to scratchpad files across sessions, and read files with surgical targeting instead of bulk loading."}
  ]
});
