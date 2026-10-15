// Practice Bank 6 — Remediation: built-in tool selection, MCP (D2), API processing modes (D4), context management (D5)
// Source: CAF score report 2026-10-14 — objectives scored 0–80%. Format documented at the top of q1.js.
// Authoring convention: the correct option(s) are listed first; the app shuffles options at runtime.
window.EXAMS = window.EXAMS || [];
window.EXAMS.push({
  id: 6,
  title: "Remediation 3: MCP, built-in tools & context management",
  questions: [
{s:4,d:2,q:"While cleaning up a large JavaScript monorepo, an engineer asks the agent to list every config file matching *.config.js so that they can delete the stale ones. Which Claude Code built-in tool should the agent use?",
o:["Glob, because it matches file names and paths against a pattern like *.config.js across the whole repository",
"Grep, because it searches file contents and can find any file whose text mentions the string config.js as well",
"Read, because it opens files and can scan a directory listing for names that match the requested pattern",
"Bash with ls -R piped through a filter, because the shell is the only tool able to list matching names"],
a:[0],e:"Glob is the file-pattern matcher (names and paths), Grep searches contents within files, Read opens a known file, and Bash runs shell commands. Match the tool to the nature of the operation."},

{s:4,d:2,q:"Before removing a deprecated helper, a tech lead needs every call site of deprecated( across the codebase, including ones inside strings and templates. Which built-in tool is the right choice?",
o:["Grep, because it searches file contents for a string or pattern such as deprecated( wherever it appears in the repo",
"Glob with the pattern **/deprecated(, because it can match patterns across every directory of the entire repository each time",
"Read on each file in turn, because only opening a file reveals whether it contains the text that is being sought over time",
"Bash with echo, because the shell is the only way to search inside the contents of files that sit in the repository over time"],
a:[0],e:"Finding call sites is a content search, which is Grep's job. Glob finds files by name pattern and cannot see inside them, and reading every file is slow and wasteful."},

{s:4,d:2,q:"A support engineer needs the full contents of src/auth/login.js, whose exact path they already know, to explain a bug to a customer. Which tool should the agent use?",
o:["Read, directly on the known path, because the location is already available and no searching is needed to open the file",
"Grep for the string login across the repository, then open whichever file the search happens to return first",
"Glob for **/login.js first to locate the file, and only then open it to see its complete contents in full",
"Bash with cat, treating the shell as the default way to open every file regardless of the other tools available"],
a:[0],e:"Read is for opening a known file. Grep and Glob are for finding things when you do not know where they are; using them here only adds pointless round trips."},

{s:1,d:2,q:"Your company's AI assistant queries a read-only product catalog (about 8,000 SKUs) dozens of times per session, and each session begins with many exploratory tool calls just to see what exists. How should the MCP server expose the catalog to cut that overhead?",
o:["As an MCP resource, so the agent can pull read-only content directly without the overhead of an exploratory tool-call loop",
"As an MCP tool, so that the agent can invoke it whenever it wants to query the catalog during a conversation with a user",
"As a prompt template that is inserted into the system prompt on every single request, whether or not it is relevant",
"As an environment variable that the agent reads from the shell at startup, refreshed at the start of each session over time"],
a:[0],e:"MCP resources are read-only data and tools are actions. Exposing frequently read content as resources removes wasteful exploratory tool calls."},

{s:1,d:2,q:"You are designing the MCP server for a cloud-operations assistant. Which of these belongs as a tool rather than as a resource?",
o:["An action that provisions a new server in a region, because invoking it has a side effect on the environment each time",
"A read-only list of the regions that the product currently supports, which changes only with each new release",
"A static FAQ document explaining how billing works, which the assistant consults when answering customer questions over time",
"A database schema description listing each table, column, and data type, used to ground the assistant's queries overall"],
a:[0],e:"Side effects belong in tools. Read-only data such as lists, documents, and schemas belongs in resources. The dividing line is whether invoking it changes anything."},

{s:2,d:2,q:"You are adding an MCP server that exposes your team's internal deployment API. It should be available to everyone working in this one repository and not in anyone's other projects. Which server scope do you select?",
o:["Project scope, so the server is available only to people working inside that single repository and nowhere else",
"User scope, so the server is available everywhere that each person opens Claude Code on their own computer",
"The widest scope that is available, since it is more convenient and avoids having to repeat the setup elsewhere each time",
"Scope has no effect on MCP servers, so any of the available options will behave the same way for the team"],
a:[0],e:"Select the narrowest scope that meets the need: project-only servers get project scope, and personal utilities used everywhere get user scope. Over-scoping leaks tools into contexts where they do not belong."},

{s:2,d:2,q:"The new MCP server needs an API key for your internal ticketing system. Your security lead says no secrets may appear in committed files or chat transcripts. How should authentication be configured?",
o:["Reference the key through environment variable expansion in the server config, so the real value never appears in any file over time",
"Hardcode the key directly inside the server configuration file, since the repository is private and only the team has access",
"Paste the key into the chat each time that the agent needs it, so that it never has to be stored in any file at all",
"Disable authentication for the server entirely, since a server that only runs locally never needs to prove who it is"],
a:[0],e:"Environment variable expansion keeps secrets out of config files, repos, and chat transcripts. Hardcoded or pasted secrets leak, and disabling authentication is never the answer."},

{s:2,d:2,q:"You finished configuring the new MCP server in Claude Code, and no error messages appeared. Your teammate says it is ready for release. What is the final verification step before you call the integration done?",
o:["Verify tool discovery by confirming the server's tools actually appear in the session and can be called successfully",
"Restart the computer so that every process picks up the new server configuration before anyone relies on the server",
"Reinstall the server from scratch to make sure that the installation is not corrupt before sharing it with the team",
"Assume the setup worked because no error messages were shown at any point during the configuration process"],
a:[0],e:"Integration is not done at configuration. Verify tool discovery to confirm the tools are actually visible and callable; this catches silent misconfiguration."},

{s:6,d:4,q:"Finance asks your team to process 50,000 archived vendor documents every night at the lowest possible cost. Nothing downstream needs the results before morning. Which API processing mode fits?",
o:["The asynchronous Message Batches API, which handles bulk work at a lower cost and returns results within its window",
"The synchronous Messages API, sending one blocking request at a time for each document as the job runs overnight each time",
"Streaming responses from the Messages API, so that the job can display real-time progress updates for each document",
"A long-lived connection that holds one session open across all 50,000 documents to avoid repeated request setup each time"],
a:[0],e:"The Message Batches API is built for large non-urgent workloads: asynchronous, cheaper, with results returned within a processing window. The synchronous Messages API is for latency-sensitive, blocking workflows."},

{s:4,d:5,q:"An engineer is mapping a large legacy codebase over several days. Each session exceeds context limits, and the agent keeps re-discovering the same modules. Which combination sustains coherent exploration across sessions?",
o:["Isolate exploration in subagents, persist findings to scratchpad files, and read only targeted parts of files each session",
"Run one giant session with the whole codebase loaded into the context window up front for every working day",
"Raise max_tokens until the full exploration history fits inside the context window for each day's work on it",
"Disable all tools so that nothing is added to the context while the agent reasons about the codebase from memory"],
a:[0],e:"No window is infinite. Isolate subagents so each holds only its slice, persist state to scratchpad files across sessions, and read files with surgical targeting instead of bulk loading."}
  ]
});
