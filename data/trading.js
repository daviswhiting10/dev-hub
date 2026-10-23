// TRADING — seed content for the Trading tab. Education only, not financial advice. Edit this file to change the text.
// Research pass 2026-10-23 (sources listed at the bottom). Origin: a swing-trading beginner video, then pruned to what holds up.
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.trading = {
  account: { size: 50, riskPct: 10 },
  plan: [
    "This is the high-risk, short-term sleeve, separate from your long-term holds. The $50 is tuition: expect to lose some or all of it while you learn, and plan so that no single trade can take more than a small slice.",
    "At $50 the usual 1% rule means risking 50 cents a trade, which is not workable. Instead: risk at most $5 (10%) per trade, one open position at a time, no leverage, no margin.",
    "Grow it slowly: aim for one trade a week at most, held for days, decided once a day after the close. Skipping a week is a valid trade.",
    "Circuit breaker: if the account falls to $35 (down 30%), stop and review the whole journal before another trade. Do not add money to \"fix\" it.",
    "Stick to liquid US stocks and ETFs. Avoid leveraged or inverse ETFs (built to be held for a day, so they drift away from the index over days and weeks), options at this size, and leveraged forex or CFDs, where regulators report most retail accounts lose money."
  ],
  setup: [
    "Account type: a cash account, not margin. A cash account cannot lose more than you put in and has no pattern-day-trader limit.",
    "Fractional shares: you need them to buy a slice of a stock with $50. Many brokers list $0 minimums and $0 commissions with fractional shares (NerdWallet's list includes Fidelity, SoFi and Interactive Brokers); compare them yourself, this page does not pick one for you.",
    "Check the order types for fractional shares before funding. Brokers often limit fractions to market orders or day-only orders, which can rule out a stop-loss order. If so, your stop is a price you check after the close, and you sell the next morning if it closes below it. A gap can still take you past that price.",
    "Settlement: stock trades settle one business day after the trade (T+1). In a cash account, do not sell something you bought with money that has not settled. With one position at a time and holds of several days this rarely matters.",
    "PDT rule: FINRA replaced the $25,000 day-trading minimum, effective June 2026, but brokers may keep the old rules until October 2027. Ask your broker which applies. Swing trades held overnight are not day trades either way.",
    "Taxes: gains on positions held under a year are taxed as ordinary income. Keep the journal as your record. Ask a tax professional about wash-sale rules if you re-buy something you sold at a loss."
  ],
  video: {
    title: "Your rules (v1, a hypothesis to test)",
    summary: "Buy pullbacks inside an uptrend, at a level where buyers showed up before, with the stop, the size and the exit decided first. Hold for days on the daily chart. Each rule is tagged by how much evidence stands behind it.",
    rules: [
      { id: "liquid", tag: "practical", t: "Liquid name: a large US stock or ETF that trades heavily every day, so you get in and out near the price you see." },
      { id: "trend", tag: "common practice", t: "Uptrend: the daily close is above the 50-day moving average, and the 50-day is above the 200-day. The 200-day filter keeps you out of stocks in a major downtrend." },
      { id: "level", tag: "common practice, subjective", t: "Pullback to a level that held before: old support, a former resistance level that was broken and is now support, or the 50-day average. The stock should be pausing after a run, not collapsing." },
      { id: "catalyst", tag: "practical", t: "No earnings report or other known event inside your planned holding period. Gaps over events jump past stops." },
      { id: "plan", tag: "risk management", t: "Plan before you enter: write the stop (just below the level), the target (the recent swing high), and check reward-to-risk is at least 2:1. Risk no more than $5." },
      { id: "confirm", tag: "optional, untested", t: "Optional confirmation: the day closes back up from the level (a green close above the prior day's close), instead of buying while it is still falling." },
      { id: "exit", tag: "risk management", t: "Exit by the plan: sell at the stop or the target. Never move a stop further away, and never add to a loser." }
    ],
    removed: [
      "The Fibonacci \"discount below 50%\" rule. It is an arbitrary line, and the video shows no test of it. Even its own live example only worked because the author picked it afterward.",
      "The \"three big candles in a row\" pullback rule. It is an arbitrary count; the level and the trend carry the idea.",
      "Bullish engulfing as a required signal. Single-candle patterns are weak on their own, so it is optional at most.",
      "The 1-hour chart, leveraged forex and CFDs, and shorting. Too fast, too leveraged and too hard for a first account.",
      "Any claim of a record or a \"huge winning trade every week\". The video sells a broker referral, a paid VIP room and a trading robot, and none of its claims is verified."
    ],
    gaps: [
      "I found no backtest of buying pullbacks to the 50-day: no win rates, expectancy or drawdowns. Treat these rules as a hypothesis; your journal is the test. After 20 closed trades, compare your results with simply holding the same stock.",
      "A momentum edge (stocks that have risen tend to keep outperforming) is one of the most-studied effects in markets, but it is measured over months, not a one-week hold, and it comes with sharp reversals.",
      "Most retail traders lose money. The 70-90% figures come from regulator studies of CFD, forex and derivatives traders, not of cash-account swing traders, so nobody can say what your odds are. Expect a small sample and plenty of luck either way.",
      "Commission-free is not cost-free: you still pay the bid-ask spread, and small fractional trades make it a bigger share of a $50 position."
    ]
  },
  weekly: [
    "Once a day, after the close: look at the daily chart of each name on your watchlist. No decisions during market hours.",
    "Sunday: read the Market watch below, update the watchlist (5-10 names), and note any earnings or Fed dates that week.",
    "Mid-week: manage the open trade only by the plan you wrote (stop, target). Do not move a stop further away.",
    "Friday: log every trade in the journal, then press Weekly review for the AI coach's read on your habits."
  ],
  sources: [
    ["FINRA Regulatory Notice 26-10 (intraday margin replaces PDT)", "https://www.finra.org/rules-guidance/notices/26-10"],
    ["TradeStation: day-trade rule change (May 2026)", "https://www.tradestation.com/insights/2026/05/06/day-trade-rule-change/"],
    ["NerdWallet: best brokers for fractional shares", "https://www.nerdwallet.com/best/investing/best-brokers-for-fractional-shares"],
    ["TradeStation: finding pullbacks, with a 200-day filter", "https://www.tradestation.com/insights/?p=42984"],
    ["Colorado Division of Securities: leveraged and inverse ETF alert", "https://securities.colorado.gov/press-release/adviser-alert-inverse-and-leveraged-etfs"],
    ["Outlook Money: SEBI study, 88% of retail derivatives traders lose", "https://www.outlookmoney.com/invest/nearly-88-of-retail-derivatives-traders-incur-losses-even-as-participation-cools-says-sebi-study"]
  ]
};
