// Shared helpers for the research agents. No dependencies (Node 20+).
// SAFETY MODEL: model output is DATA. It is validated, serialized with JSON.stringify, and written only to a fixed
// whitelist of data files. Nothing a model returns is ever executed or used to build a path or command.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Files each script may write (paths are relative to the repo root).
export const ALLOW_RUN = [/^data\/briefings\/\d{4}-\d{2}-\d{2}\.js$/, /^data\/briefings\/index\.js$/, /^data\/strategy\.js$/, /^data\/poll\.js$/];
export const ALLOW_INGEST = [/^data\/profile\.js$/, /^data\/feedback\.js$/];

export function safeWrite(rel, content, allow, root = ROOT) {
  if (typeof rel !== "string" || rel.includes("\0")) throw new Error("bad path");
  const norm = path.posix.normalize(rel.replace(/\\/g, "/"));
  if (norm.startsWith("..") || norm.startsWith("/") || /^[a-zA-Z]:/.test(norm) || !allow.some((r) => r.test(norm)))
    throw new Error("refusing to write outside the whitelist: " + rel);
  const abs = path.join(root, norm);
  if (!abs.startsWith(path.resolve(root) + path.sep)) throw new Error("path escapes root: " + rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
}

// Data files are `window.X = {...};` scripts. Evaluate them in an empty VM context (no Node globals) to read them.
export function loadWindowFile(rel, root = ROOT) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return {};
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(abs, "utf8"), ctx, { timeout: 2000 });
  return ctx.window;
}
export function listBriefingFiles(root = ROOT) {
  const dir = path.join(root, "data/briefings");
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.js$/.test(f)).sort().reverse() : [];
}

// JSON that is safe to embed in a <script src> file.
export const toJs = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c").replace(new RegExp("\\u2028", "g"), "\\u2028").replace(new RegExp("\\u2029", "g"), "\\u2029");

export function workRoot(dry) {
  if (!dry) return ROOT;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dev-hub-dry-"));
  fs.cpSync(path.join(ROOT, "data"), path.join(tmp, "data"), { recursive: true });
  return tmp;
}

// ---------- Claude API ----------
const budget = { used: 0, limit: Number(process.env.TOKEN_BUDGET || 200000) };
export const usage = () => budget.used;
const byModel = {};  // { model: { input, output } } so each run can report what it cost
export const usageByModel = () => JSON.parse(JSON.stringify(byModel));

export async function claude({ system, messages, tools, tool_choice, max_tokens = 4000, dry, fixture, model }) {
  if (dry) return JSON.parse(fs.readFileSync(path.join(ROOT, "agents/fixtures", fixture), "utf8"));
  if (budget.used >= budget.limit) throw new Error("token budget exhausted (" + budget.used + "/" + budget.limit + ")");
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const body = { model: model || process.env.AGENT_MODEL || "claude-sonnet-5-5", max_tokens, system, messages };
  if (tools) body.tools = tools;
  // Some models reject a forced tool_choice, so we ask for the tool in the prompt instead, and re-ask once if it is skipped.
  const forced = tool_choice && tool_choice.type === "tool" ? tool_choice.name : null;
  if (forced) body.system = system + "\n\nYou MUST finish by calling the `" + forced + "` tool exactly once with your complete answer. Do not reply with plain text instead.";
  else if (tool_choice) body.tool_choice = tool_choice;
  let lastErr, retried = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify(body)
    });
    if (res.ok) {
      const j = await res.json();
      budget.used += (j.usage?.input_tokens || 0) + (j.usage?.output_tokens || 0);
      const m = (byModel[body.model] = byModel[body.model] || { input: 0, output: 0 });
      m.input += j.usage?.input_tokens || 0; m.output += j.usage?.output_tokens || 0;
      if (forced && !(j.content || []).some((b) => b.type === "tool_use" && b.name === forced) && !retried && budget.used < budget.limit) {
        retried = true;
        body.messages = [...messages, { role: "assistant", content: j.content }, { role: "user", content: "Now call the `" + forced + "` tool with your complete answer." }];
        continue;
      }
      return j;
    }
    lastErr = new Error("API " + res.status + ": " + (await res.text()).slice(0, 300));
    if (res.status !== 429 && res.status < 500) break;
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  throw lastErr;
}

export const textOf = (resp) => (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
export function toolInput(resp, name) {
  const b = (resp.content || []).find((x) => x.type === "tool_use" && x.name === name);
  if (!b || typeof b.input !== "object" || b.input === null) throw new Error("model did not return the " + name + " tool call");
  return b.input;
}
