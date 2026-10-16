// FEEDBACK LEDGER — your votes on briefing items, appended by agents/ingest.mjs when you send feedback from the site.
// The Critic agent reads it to tune the strategy. Capped at the latest 300 votes.
window.HUB_FEEDBACK = { votes: [] };
