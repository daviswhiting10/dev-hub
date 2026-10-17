// Public RSS feeds as extra leads for the Researcher (headlines + short descriptions only; no logins, no paywalled text).
// Feeds are declared in data/strategy.js (`sources.feeds`). Everything fetched is untrusted data.
import { isHttp, str } from "./schema.mjs";

const decode = (s) => String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " ")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const tag = (x, t) => { const m = new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">", "i").exec(x); return m ? decode(m[1]) : ""; };

export function parseRss(xml, limit = 15) {
  const out = [];
  for (const m of String(xml).matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const link = tag(m[0], "link"), title = str(tag(m[0], "title"), 200);
    if (title && isHttp(link) && out.length < limit) out.push({ title, link, desc: str(tag(m[0], "description"), 240), date: str(tag(m[0], "pubDate"), 40) });
  }
  return out;
}

// Returns [{feed, items}]. A failing feed is skipped with a warning; it never fails the run.
export async function fetchFeeds(feeds, fetchImpl = fetch) {
  const out = [];
  for (const f of (Array.isArray(feeds) ? feeds : []).slice(0, 6)) {
    if (!f || !isHttp(f.url) || !f.url.startsWith("https://")) continue;
    try {
      const r = await fetchImpl(f.url, { headers: { "user-agent": "dev-hub-research/1.0" }, signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      out.push({ feed: str(f.name || f.url, 60), items: parseRss(await r.text()) });
    } catch (e) { console.warn("feed skipped (" + (f.name || f.url) + "): " + e.message); }
  }
  return out;
}
