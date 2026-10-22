// THE VENTURE — the startup idea the Business section is built around. Draft v0: a foundation to build from, not a plan.
// Seed text only. Edits made in the app (Today → Venture) are saved in your browser and win over this file; "Reset" restores it.
// Body format: blank line = new paragraph; lines starting "- " = bullets.
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.venture = {
  name: "Club development platform",
  status: "Draft v0 — brand new, not finalized",
  oneLiner: "The official development record for youth clubs: adults capture objective data, parents trust it, directors renew. Schedule, chat and payments follow.",
  sections: [
    { id: "thesis", title: "Thesis",
      body: "Kids' training apps are engagement products: kids are the user and the feed is the product. This is the opposite split.\n\n- The club is the customer; adults capture the data.\n- It is the official development record. It wins when parents trust the numbers and directors renew.\n- Positioning: \"TeamSnap runs your schedule. We run your players' development, and your schedule too.\"" },
    { id: "users", title: "Who pays, who uses",
      body: "- Clubs and parents pay. Kids don't.\n- Kids stay view-only, or off the app at first. Self-reported numbers aren't believable (\"200 wall-ball reps\"), and collecting data directly from under-13s needs verifiable parental consent (COPPA).\n- Kid-engagement apps (e.g. you.prjct) are more complementary than competitive: they have the engagement, this has verified club data. Partner or integrate later (\"verified measurables\" on a kid's profile there), and tell them early rather than letting them hear it secondhand." },
    { id: "data", title: "Where the stats come from",
      body: "Youth lacrosse has almost no stat crews, so use sources adults will actually fill in:\n\n- Measurables: sprint times, shot speed, wall-ball tests, agility. Tested at tryouts and mid-season; objective, and it plays to the trainer background. Percentile rankings (\"faster than 80% of U13 middies\") are what parents screenshot.\n- Coach ratings: a quick 1-5 on 4-5 skills per player each month, filled in from a voice memo.\n- Game stats: goals, ground balls, caused turnovers, entered by the team parent.\n\nThe product is the trend line: \"Jake's 10-yard split improved 0.3s and his GB rating went from 2 to 4 this season.\"" },
    { id: "sequence", title: "Sequence",
      body: "- 1. Development layer (the wedge): adopted alongside TeamSnap because nobody else does this.\n- 2. Comms and schedule: once parents open it weekly for progress reports, add schedule and chat. TeamSnap becomes redundant.\n- 3. Registration and payments (the money): Stripe Connect, no custom payment infrastructure. Switch clubs between seasons, never mid-season.\n\nNobody switches for a better calendar; development is the reason to switch, operations is why they stay." },
    { id: "money", title: "Money",
      body: "- Registration and dues are where these platforms earn: a small cut (~2-3% processing) of every dollar a club collects. A family paying a few thousand dollars a season is worth far more than a $15 development fee. Verify real dues numbers with directors.\n- TeamSnap benchmark (private, owned by Waud Capital; no published revenue): $18.9M in 2018 (up 53%), ~$58M/yr is a modeled guess (Growjo). 2021 per TeamSnap: 25M+ users, ~19,000 organizations, club registration/payments up 170%. Low-priced subscriptions and ads alone stay small, which is why they push payments.\n- Stickiness: once registration and money run through you, switching away is painful." },
    { id: "advantage", title: "Unfair advantage",
      body: "- Panthers has no existing software, so the full stack can run on your own club from day one with no switching cost.\n- That is a live demo of the whole product to show other directors.\n- Trainer background makes the measurables credible." },
    { id: "risks", title: "Stress tests and open questions",
      body: "- Biggest one: \"statistics-based\" only works if testing days happen. Will Panthers coaches actually run combine testing 2-3 times a season? If yes, that is the moat; if not, the stats are thin.\n- Switching is risky for a club: a failure during registration costs them money and trust.\n- Building two products while launching a club. Scope discipline.\n- Real dues numbers, and what directors would pay, are still unknown. Talk to directors.\n- Whether the kid-engagement app builders would partner or integrate." }
  ]
};
