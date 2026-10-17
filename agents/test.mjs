#!/usr/bin/env node
// Self-contained tests for the agents (no framework). Run: node agents/test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT, ALLOW_RUN, ALLOW_INGEST, safeWrite, loadWindowFile } from "./lib.mjs";
import { main } from "./run.mjs";
import { ingest } from "./ingest.mjs";
import { applyCritique, cleanBriefing } from "./schema.mjs";

let passed = 0;
const J = (x) => JSON.parse(JSON.stringify(x)); // values read from the VM sandbox belong to another realm; normalize before deepEqual
const t = async (name, fn) => { try { await fn(); passed++; console.log("  ok  " + name); } catch (e) { console.error("  FAIL " + name + "\n       " + e.message); process.exitCode = 1; } };

const tmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), "hub-test-")); fs.cpSync(path.join(ROOT, "data"), path.join(d, "data"), { recursive: true }); return d; };

await t("safeWrite rejects traversal, absolute and non-whitelisted paths", () => {
  const root = tmp();
  for (const bad of ["../x.js", "data/../agents/run.mjs", "/etc/passwd", "data/briefings/../../index.html", "data/briefings/x.js", ".github/workflows/x.yml", "agents/prompts/editor.md", "data/learn.js", "data/briefings/2026-10-17.js/../../../x", "C:\\x"])
    assert.throws(() => safeWrite(bad, "x", ALLOW_RUN, root), /refusing|escapes|bad path/, bad);
  assert.throws(() => safeWrite("data/profile.js", "x", ALLOW_RUN, root), /refusing/); // run.mjs may not write the profile
  assert.throws(() => safeWrite("data/strategy.js", "x", ALLOW_INGEST, root), /refusing/); // ingest may not write the strategy
  safeWrite("data/briefings/2026-10-17.js", "// ok", ALLOW_RUN, root);
});

await t("dry run writes a valid briefing, updates index, applies only valid strategy changes", async () => {
  const v0 = loadWindowFile("data/strategy.js").HUB_STRATEGY.version; // the repo's strategy advances as real runs happen
  const r = await main(["--dry-run", "--date", "2026-10-18", "--force"]); // 2026-10-18 is a Sunday -> weekly path too
  const b = loadWindowFile("data/briefings/2026-10-18.js", r.root).BRIEFINGS[0];
  assert.equal(b.date, "2026-10-18");
  assert.match(b.tldr, /Fixture tl;dr/); assert.match(b.for_you, /transition/);
  const titles = b.items.map((i) => i.title);
  assert.ok(!titles.includes("How your daily briefing works"), "duplicate of a recent title must be dropped");
  const first = b.items[0];
  assert.deepEqual(J(first.sources.map((s) => s.url)), ["https://example.com/fixture-agents-story"], "only URLs the researcher retrieved may remain");
  const unsourced = b.items.find((i) => /Unsourced/.test(i.title));
  assert.equal(unsourced.confidence, "low", "high confidence without sources is downgraded");
  assert.ok(b.items.every((i) => /^2026-10-18-\d+$/.test(i.id) || i.id === "2026-10-18-w"));
  const idx = loadWindowFile("data/briefings/index.js", r.root).BRIEFING_INDEX;
  assert.equal(idx[0], "2026-10-18"); assert.ok(idx.includes("2026-10-16"));
  const s = loadWindowFile("data/strategy.js", r.root).HUB_STRATEGY;
  assert.equal(s.version, v0 + 1); assert.equal(r.applied.length, 1);
  assert.ok(s.beats.find((x) => x.id === "agents-mcp").queries.includes("fixture query about agent evaluation"));
  assert.equal(s.beats.find((x) => x.id === "frontier-labs").weight, 3, "invalid weight rejected");
  assert.equal(s.sources.prefer.includes("../../etc/passwd"), false);
  const p = loadWindowFile("data/poll.js", r.root).HUB_POLL;
  assert.deepEqual(J(p.adaptive.map((q) => q.id)), ["a-agent-depth"], "weekly poll: valid question added, invalid id rejected");
  assert.ok(b.items.some((i) => i.id === "2026-10-18-w"), "weekly retrospective item present");
  // repo data untouched by dry runs
  assert.equal(fs.existsSync(path.join(ROOT, "data/briefings/2026-10-18.js")), false);
});

await t("critique limits: at most 5 changes, query caps, ops allow-list", () => {
  const s = { limits: { maxChangesPerRun: 5, maxQueriesPerBeat: 3 }, version: 1, changelog: [], beats: [{ id: "b", weight: 1, queries: ["a", "b"] }], sources: { prefer: [], avoid: [] } };
  const changes = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ op: "add_query", beat: "b", value: "q" + n, reason: "r" }));
  const r = applyCritique(s, { summary: "s", changes }, { date: "2026-10-17" });
  assert.equal(s.beats[0].queries.length, 3); // capped by maxQueriesPerBeat
  assert.ok(r.applied.length <= 5);
  assert.throws(() => cleanBriefing({ items: [] }, { date: "2026-10-17", allowedUrls: new Set(), limits: { maxItems: 8 } }), /no items|valid items/);
});

await t("ingest: owner-only, validates poll answers and feedback votes", () => {
  const root = tmp(); const owner = "daviswhiting10";
  const ev = (login, title, payload) => ({ repository: { owner: { login: owner } }, issue: { user: { login: login }, title, body: "### Payload\n\n" + JSON.stringify(payload) } });
  assert.throws(() => ingest(ev("mallory", "[hub-poll] x", { kind: "poll", answers: { goal: "freelance" } }), { root, owner }), /not the repository owner/);
  ingest(ev(owner, "[hub-poll] x", { kind: "poll", answers: { goal: "freelance", depth: "bogus", topics: ["agents-mcp", "<script>", "policy"], minutes: "20", hype: "medium", notes: "x".repeat(500) + "\u0000" } }), { root, owner, date: "2026-10-17" });
  const p = loadWindowFile("data/profile.js", root).HUB_PROFILE;
  assert.equal(p.goal, "freelance"); assert.equal(p.depth, "analysis", "invalid depth ignored"); assert.deepEqual(J(p.topics), ["agents-mcp", "policy"]);
  assert.equal(p.minutes, 20); assert.equal(p.hype, "medium"); assert.equal(p.source, "poll");
  const votes = [{ date: "2026-10-16", item: "2026-10-16-1", vote: "up", title: "T", tags: ["agents-mcp"] }, { date: "2026-10-16", item: "bad id", vote: "up" }, { date: "2026-10-16", item: "2026-10-16-2", vote: "nuke" }];
  const r = ingest(ev(owner, "[hub-feedback] 3 votes", { kind: "feedback", votes }), { root, owner, date: "2026-10-17" });
  assert.match(r.summary, /^1 vote/);
  assert.equal(loadWindowFile("data/feedback.js", root).HUB_FEEDBACK.votes.length, 1);
  assert.throws(() => ingest(ev(owner, "[hub-poll] x", { kind: "feedback", votes: [] }), { root, owner }), /do not match/);
});

console.log(process.exitCode ? "\nSOME TESTS FAILED" : "\nall " + passed + " tests passed");

// feeds: RSS parsing keeps titles/links only, drops non-http links, decodes entities, and never executes anything
{
  const { parseRss } = await import("./feeds.mjs");
  const xml = `<rss><channel><title>x</title><item><title>It&#x2019;s &lt;b&gt;big&lt;/b&gt;</title><link>https://example.com/a</link><description><![CDATA[Short <i>blurb</i>]]></description></item>
  <item><title>Bad link</title><link>javascript:alert(1)</link></item><item><title></title><link>https://example.com/b</link></item></channel></rss>`;
  const items = parseRss(xml);
  assert.equal(items.length, 1); assert.equal(items[0].link, "https://example.com/a");
  assert.equal(items[0].title, "It’s big"); assert.equal(items[0].desc, "Short blurb");
  console.log("  ok  feeds: RSS parsed, bad links dropped");
}
