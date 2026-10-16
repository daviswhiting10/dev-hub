// Hand-rolled validators/sanitizers. Everything coming from a model (or an issue) passes through here before it is
// saved. Strings are length-capped and stripped of control characters; the site additionally escapes all text.
const CTRL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
export const str = (x, n) => String(x == null ? "" : x).replace(CTRL, "").trim().slice(0, n);
export const isHttp = (u) => { try { const p = new URL(String(u)); return p.protocol === "http:" || p.protocol === "https:"; } catch { return false; } };
export const normTitle = (t) => String(t).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const CONF = ["high", "medium", "low"];

export const BRIEFING_TOOL = {
  name: "submit_briefing",
  description: "Submit the final ranked daily briefing.",
  input_schema: {
    type: "object", required: ["headline", "tldr", "for_you", "items"],
    properties: {
      headline: { type: "string", description: "One-line theme for today, max 100 chars" },
      tldr: { type: "string", description: "2-3 sentence summary of the day. On a quiet day, say so plainly." },
      for_you: { type: "string", description: "1-2 sentences tying today's news to the reader's career transition, exam prep, or projects" },
      items: { type: "array", minItems: 1, maxItems: 8, description: "5-8 items; fewer on a quiet news day. Never pad.", items: {
        type: "object", required: ["title", "summary", "why", "tags", "confidence", "sources"],
        properties: {
          title: { type: "string" }, summary: { type: "string", description: "1-2 sentences, plain text" },
          why: { type: "string", description: "One sentence on why it matters to THIS user" },
          analysis: { type: "string", description: "Optional deeper analysis, plain text, max ~120 words" },
          tags: { type: "array", items: { type: "string" }, description: "Beat ids, e.g. agents-mcp" },
          confidence: { type: "string", enum: CONF },
          sources: { type: "array", items: { type: "object", required: ["title", "url"], properties: { title: { type: "string" }, url: { type: "string" } } } }
        } } } } }
};
export const CRITIQUE_TOOL = {
  name: "submit_critique",
  description: "Score today's briefing and propose small, evidence-based strategy changes.",
  input_schema: {
    type: "object", required: ["summary", "scores", "changes"],
    properties: {
      summary: { type: "string" },
      scores: { type: "object", properties: { relevance: { type: "integer" }, novelty: { type: "integer" }, clarity: { type: "integer" } } },
      changes: { type: "array", maxItems: 5, items: { type: "object", required: ["op", "value", "reason"], properties: {
        op: { type: "string", enum: ["add_query", "drop_query", "set_weight", "add_preferred_source", "add_avoid_source", "remove_avoid_source"] },
        beat: { type: "string" }, value: { type: "string" }, reason: { type: "string" } } } } }
  }
};
export const POLL_TOOL = {
  name: "submit_poll_update",
  description: "Propose at most 3 adaptive poll questions and which to retire.",
  input_schema: {
    type: "object", required: ["add", "retire"],
    properties: {
      retire: { type: "array", items: { type: "string" } },
      add: { type: "array", maxItems: 3, items: { type: "object", required: ["id", "type", "text", "options"], properties: {
        id: { type: "string" }, type: { type: "string", enum: ["single", "multi"] }, text: { type: "string" },
        options: { type: "array", minItems: 2, maxItems: 6, items: { type: "object", required: ["id", "label"], properties: { id: { type: "string" }, label: { type: "string" } } } } } } } }
  }
};

// ---- briefing ----
export function cleanBriefing(raw, { date, allowedUrls, limits, recentTitles = [], meta = {} }) {
  if (!raw || !Array.isArray(raw.items)) throw new Error("briefing has no items");
  const seen = new Set(recentTitles.map(normTitle));
  const items = [];
  for (const it of raw.items) {
    const title = str(it?.title, 200); if (!title) continue;
    const key = normTitle(title); if (seen.has(key)) continue; seen.add(key);
    const sources = [];
    for (const s of Array.isArray(it.sources) ? it.sources : []) {
      const url = String(s?.url || "").trim();
      if (isHttp(url) && allowedUrls.has(url) && sources.length < 5) sources.push({ title: str(s.title, 200) || url, url });
    }
    let confidence = CONF.includes(it.confidence) ? it.confidence : "medium";
    if (!sources.length && confidence === "high") confidence = "low"; // nothing verifiable
    items.push({
      id: date + "-" + (items.length + 1), title, summary: str(it.summary, 600), why: str(it.why, 400), analysis: str(it.analysis, 1500),
      tags: (Array.isArray(it.tags) ? it.tags : []).map((t) => str(t, 30)).filter(Boolean).slice(0, 5), confidence, sources
    });
    if (items.length >= limits.maxItems) break;
  }
  if (!items.length) throw new Error("no valid items after cleaning");
  return { date, headline: str(raw.headline, 120) || "Your AI briefing", tldr: str(raw.tldr, 500), for_you: str(raw.for_you, 400), meta, items };
}

// ---- strategy ----
const DOMAIN = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export function applyCritique(strategy, critique, { date }) {
  const lim = strategy.limits, applied = [], rejected = [];
  const beats = new Map(strategy.beats.map((b) => [b.id, b]));
  for (const c of (Array.isArray(critique?.changes) ? critique.changes : []).slice(0, lim.maxChangesPerRun)) {
    const op = c?.op, value = str(c?.value, 120), reason = str(c?.reason, 200), beat = c?.beat ? str(c.beat, 40) : undefined;
    const b = beat ? beats.get(beat) : undefined; let ok = false;
    if (op === "add_query" && b && value && !/https?:\/\//i.test(value) && b.queries.length < lim.maxQueriesPerBeat && !b.queries.includes(value)) { b.queries.push(value); ok = true; }
    else if (op === "drop_query" && b && b.queries.length > 1 && b.queries.includes(value)) { b.queries = b.queries.filter((q) => q !== value); ok = true; }
    else if (op === "set_weight" && b && /^[0-3]$/.test(value)) { b.weight = Number(value); ok = true; }
    else if (op === "add_preferred_source" && DOMAIN.test(value) && !strategy.sources.prefer.includes(value) && strategy.sources.prefer.length < 25) { strategy.sources.prefer.push(value); ok = true; }
    else if (op === "add_avoid_source" && DOMAIN.test(value) && !strategy.sources.avoid.includes(value) && strategy.sources.avoid.length < 25) { strategy.sources.avoid.push(value); ok = true; }
    else if (op === "remove_avoid_source" && strategy.sources.avoid.includes(value)) { strategy.sources.avoid = strategy.sources.avoid.filter((s) => s !== value); ok = true; }
    (ok ? applied : rejected).push({ op: str(op, 30), beat, value, reason });
  }
  if (applied.length) {
    strategy.version += 1; strategy.updated = date;
    strategy.changelog.push({ date, version: strategy.version, summary: str(critique.summary, 300) || "Strategy adjusted.", changes: applied });
    strategy.changelog = strategy.changelog.slice(-60);
  }
  return { applied, rejected };
}

// ---- poll (adaptive questions) ----
const QID = /^a-[a-z0-9-]{2,30}$/;
export function applyPollUpdate(poll, update, { date }) {
  const keep = (poll.adaptive || []).filter((q) => !(update?.retire || []).includes(q.id) && (Date.parse(date) - Date.parse(q.added || date)) / 86400000 <= 28);
  const taken = new Set([...poll.core.map((q) => q.id), ...keep.map((q) => q.id)]);
  for (const q of Array.isArray(update?.add) ? update.add : []) {
    if (keep.length >= 3 || !QID.test(String(q?.id)) || taken.has(q.id) || !["single", "multi"].includes(q.type)) continue;
    const opts = (Array.isArray(q.options) ? q.options : []).map((o) => ({ id: str(o?.id, 30).toLowerCase().replace(/[^a-z0-9-]/g, "-"), label: str(o?.label, 80) })).filter((o) => o.id && o.label).slice(0, 6);
    const text = str(q.text, 140); if (opts.length < 2 || !text) continue;
    keep.push({ id: q.id, type: q.type, text, options: opts, added: date }); taken.add(q.id);
  }
  poll.adaptive = keep; if (keep.length) poll.version += 1; return poll;
}
