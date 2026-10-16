#!/usr/bin/env node
// Ingests a poll/feedback GitHub Issue (opened by the repo owner) into data/profile.js / data/feedback.js.
//   node agents/ingest.mjs --event "$GITHUB_EVENT_PATH"
// The issue title and body are NEVER interpolated into a shell command; this script reads the event JSON directly,
// verifies the author, parses one JSON object, and validates/clamps every field before writing a whitelisted file.
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { ROOT, DATE_RE, ALLOW_INGEST, safeWrite, loadWindowFile, toJs } from "./lib.mjs";
import { str } from "./schema.mjs";

const PROFILE_HEADER = "// YOUR RESEARCH PROFILE — steers the daily briefing agents. Updated automatically when you submit the poll on the\n// Briefing page (a GitHub Issue is ingested by .github/workflows/ingest-feedback.yml). Safe to hand-edit too.\n// NOTE: this repo is public, so keep it to low-sensitivity preferences.\n";
const FEEDBACK_HEADER = "// FEEDBACK LEDGER — your votes on briefing items, appended by agents/ingest.mjs when you send feedback from the site.\n// The Critic agent reads it to tune the strategy. Capped at the latest 300 votes.\n";

export function parsePayload(body) {
  const s = String(body || ""), a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("no JSON payload found");
  return JSON.parse(s.slice(a, b + 1));
}

export function ingestPoll(payload, { poll, profile, date }) {
  const questions = new Map([...poll.core, ...(poll.adaptive || [])].map((q) => [q.id, q]));
  const answers = payload.answers && typeof payload.answers === "object" ? payload.answers : {};
  const next = { ...profile, adaptive: { ...(profile.adaptive || {}) } };
  for (const [qid, q] of questions) {
    if (!(qid in answers)) continue;
    const a = answers[qid], valid = new Set((q.options || []).map((o) => o.id));
    let v;
    if (q.type === "single") { if (typeof a === "string" && valid.has(a)) v = a; }
    else if (q.type === "multi") { if (Array.isArray(a)) v = [...new Set(a.filter((x) => typeof x === "string" && valid.has(x)))].slice(0, 8); }
    else if (q.type === "text") { if (typeof a === "string") v = str(a, 200); }
    if (v === undefined) continue;
    if (qid === "goal") next.goal = v; else if (qid === "depth") next.depth = v; else if (qid === "hype") next.hype = v;
    else if (qid === "minutes") next.minutes = Number(v); else if (qid === "topics") next.topics = v; else if (qid === "notes") next.notes = v;
    else next.adaptive[qid] = v;
  }
  next.source = "poll"; next.updated = date; return next;
}

export function ingestFeedback(payload, { feedback, date }) {
  const out = []; const seen = new Set();
  for (const v of (Array.isArray(payload.votes) ? payload.votes : []).slice(0, 40)) {
    const item = str(v?.item, 40), d = str(v?.date, 10), vote = v?.vote;
    if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]{1,6}$/.test(item) || !DATE_RE.test(d) || !["up", "down", "more"].includes(vote) || seen.has(item)) continue;
    seen.add(item);
    out.push({ date: d, item, vote, title: str(v.title, 140), tags: (Array.isArray(v.tags) ? v.tags : []).slice(0, 5).map((t) => str(t, 30)).filter(Boolean), received: date });
  }
  const kept = (feedback.votes || []).filter((x) => !seen.has(x.item));
  return { votes: [...kept, ...out].slice(-300), added: out.length };
}

export function ingest(event, { root = ROOT, owner, date = new Date().toISOString().slice(0, 10) } = {}) {
  const issue = event?.issue; if (!issue) throw new Error("not an issue event");
  const login = String(issue.user?.login || "").toLowerCase(), want = String(owner || event.repository?.owner?.login || "").toLowerCase();
  if (!want || login !== want) throw new Error("issue author is not the repository owner; ignoring");
  const title = String(issue.title || ""), payload = parsePayload(issue.body);
  if (title.startsWith("[hub-poll]") && payload.kind === "poll") {
    const poll = loadWindowFile("data/poll.js", root).HUB_POLL, profile = loadWindowFile("data/profile.js", root).HUB_PROFILE;
    const next = ingestPoll(payload, { poll, profile, date });
    safeWrite("data/profile.js", PROFILE_HEADER + "window.HUB_PROFILE = " + toJs(next) + ";\n", ALLOW_INGEST, root);
    return { kind: "poll", summary: "Profile updated from poll answers." };
  }
  if (title.startsWith("[hub-feedback]") && payload.kind === "feedback") {
    const feedback = loadWindowFile("data/feedback.js", root).HUB_FEEDBACK || { votes: [] };
    const r = ingestFeedback(payload, { feedback, date });
    safeWrite("data/feedback.js", FEEDBACK_HEADER + "window.HUB_FEEDBACK = " + toJs({ votes: r.votes }) + ";\n", ALLOW_INGEST, root);
    return { kind: "feedback", summary: r.added + " vote(s) recorded." };
  }
  throw new Error("issue title and payload kind do not match a poll or feedback submission");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const i = process.argv.indexOf("--event"); if (i < 0) throw new Error("usage: ingest.mjs --event <path>");
    const r = ingest(JSON.parse(fs.readFileSync(process.argv[i + 1], "utf8")));
    console.log(r.summary);
  } catch (e) { console.error("REJECTED:", e.message); process.exit(1); }
}
