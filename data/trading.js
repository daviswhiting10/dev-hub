// TRADING — seed content for the Trading tab. Education only, not financial advice. Edit this file to change the text.
// Validated against primary sources by Muse (2026-10-23); the corrections are applied here. Origin: a swing-trading beginner
// video, pruned to what holds up. "Planned risk" is deliberate: with no live stop on fractional shares, the real loss can exceed it.
window.HUB_DATA = window.HUB_DATA || {};
window.HUB_DATA.trading = {
  account: { size: 50, riskPct: 10, riskCap: 5 },
  plan: [
    "This is the high-risk, short-term sleeve, separate from your long-term holds. The $50 is tuition. The product of this account is the journal, not the profit: a great year (+30%) is $15, spreads weigh heavily at this size, and the expected result after costs is probably slightly negative. What you buy is the education.",
    "Planned risk per trade = 10% of your current balance, capped at $5. Position size = planned risk ÷ stop distance (as a % of the entry price). On a $50 position, a stop 10% away risks $5. A stop 15% away needs a smaller position (about $33, which fractional shares allow). A stop 4% away risks about $2. Skip the trade if the stop is so tight that spread and normal noise would set it off.",
    "One open position at a time, no leverage, no margin. At $50 diversifying is impossible, and one position keeps the journal honest and nearly removes settlement problems.",
    "Cadence: at most one trade a week, held for days, decided once a day after the close. Skipping a week is a valid trade.",
    "\"Planned\" is the honest word. At most brokers a stop on a fractional position is a price you check after the close, not a live order, and a gap (earnings, news) can take the real loss well past $5.",
    "Review gate at $35: that is three full losses, and even a coin-flip trader loses three in a row about once in eight tries, so this will fire from ordinary luck. It is a pause, not a verdict. Before another trade, work out from the journal: how many times you broke your rules, what spreads and costs you really paid, your win rate and average R. Then resume at a smaller planned risk, or not at all. Never add money to \"fix\" it.",
    "Stick to liquid US stocks and ETFs. Avoid leveraged or inverse ETFs (regulators say daily-reset funds are typically unsuitable for anyone holding longer than one trading session), options at this size, and leveraged forex or CFDs."
  ],
  setup: [
    "Account type: a cash account, not margin. A cash account cannot lose more than you put in. The pattern-day-trader rule is a margin-account concept, and overnight swing trades are not day trades anyway.",
    "PDT rule: FINRA's Regulatory Notice 26-10 replaces the $25,000 day-trading minimum with new intraday margin standards, effective June 4, 2026. Firms may phase in over up to 18 months, until October 20, 2027, so ask your broker which rules it applies.",
    "Fractional shares are how you trade at $50, and they are restricted. Fidelity: market or limit orders, day-only, no stops. Schwab: fractional orders cannot be stop, market-on-close or conditional orders. SoFi: stops work only for whole shares. Webull's disclosure says market orders only, but its help page says market and limit (they contradict each other); no stops under either. Robinhood: its pages do not say whether a standalone fractional stop exists. Interactive Brokers is the exception: its disclosure lists stop and stop-limit orders for fractional shares.",
    "So at most brokers your stop is a price you check after the close, and you sell the next morning if it closes below it. A gap can still take you past that price. This workaround is the main mechanism, so the planned risk above is a plan, not a guarantee.",
    "Brokers, checked on each one's own site: Fidelity, SoFi, Interactive Brokers (IBKR Lite) and J.P. Morgan Self-Directed all list $0 to open and $0 commission on online US stock and ETF trades, and all offer fractional shares. Fractional minimums: $1 at Fidelity, $5 at SoFi, $5 at J.P. Morgan (S&P 500 and Nasdaq-100 names only, market orders only). IBKR Lite's pricing for fractional trades is unclear on its own page, so do not assume they are free. This page does not pick one for you.",
    "Settlement: stock trades settle one business day after the trade (T+1). A good-faith violation is buying with the proceeds of a sale that has not settled and then selling that purchase early. Freeriding (buying and selling the same security before paying for it) is stricter and can freeze the account for 90 days. Brokers set their own penalties for good-faith violations. With one position at a time and multi-day holds, neither should come up.",
    "Taxes (US, general information, not advice): positions held one year or less are short-term, and net short-term gains are taxed as ordinary income. If you sell at a loss and re-buy the same or a substantially identical security within 30 days before or after the sale, the wash-sale rule defers the loss into the new shares' cost basis. There is no exception for small accounts. Ask a tax professional."
  ],
  video: {
    title: "Your rules (v1, a hypothesis to test)",
    summary: "Buy pullbacks inside an uptrend, at a level where buyers showed up before, with the stop, the size and the exit decided first. Hold for days on the daily chart. These rules are unproven: each is tagged by how much stands behind it, and the journal is the test.",
    rules: [
      { id: "liquid", tag: "practical", t: "Liquid name: a large US stock or ETF that trades heavily every day, so you get in and out near the price you see." },
      { id: "catalyst", tag: "practical, and the most important rule here", t: "No earnings report or other known event inside your planned holding period. With after-close stops, a gap over an event is how a $5 plan becomes a bigger loss." },
      { id: "trend", tag: "risk hygiene, not evidence of profit", t: "Uptrend: the daily close is above the 50-day moving average, and the 50-day is above the 200-day. The filter's job is to keep you out of downtrends. It is not evidence the trades will profit." },
      { id: "level", tag: "common practice, subjective", t: "Pullback to a level that held before: old support, a former resistance level that was broken and is now support, or the 50-day average. The stock should be pausing after a run, not collapsing." },
      { id: "plan", tag: "bookkeeping", t: "Plan before you enter: write the stop (just below the level), the target, and the planned risk (10% of balance, at most $5). Check the reward-to-risk. 2:1 is a discipline rule, not proof a trade is good." },
      { id: "confirm", tag: "optional, untested", t: "Optional confirmation: the day closes back up from the level (a green close above the prior day's close), instead of buying while it is still falling." },
      { id: "exit", tag: "risk management", t: "Exit by the plan: sell at the stop or the target. Never move a stop further away, and never add to a loser." }
    ],
    removed: [
      "The Fibonacci \"discount below 50%\" rule. It is an arbitrary line with no test behind it. The video shows it only on hand-picked charts: its first live candidate never retraced to the discount zone, so the rules would have skipped it (the presenter says buying anyway would have made money), and its one worked example is a single winner picked while replaying the price.",
      "The \"three big candles in a row\" pullback rule. It is an arbitrary count; the level and the trend carry the idea.",
      "Bullish engulfing as a required signal. Single-candle patterns are weak on their own, so it is optional at most.",
      "The 1-hour chart, leveraged forex and CFDs, and shorting. Too fast, too leveraged and too hard for a first account.",
      "Any claim of a record or a \"huge winning trade every week\". The video sells a broker referral, a paid VIP room, a trading robot and a Discord, and its claims (18 years, fast withdrawals) are the presenter's own and unverified."
    ],
    gaps: [
      "Nobody has published a rigorous test of this exact entry. Studies of moving-average rules in general are old and mixed, and the apparent profits concentrate in small, illiquid stocks, not the liquid names used here. Treat every rule as a hypothesis.",
      "Momentum is one of the most-studied effects in markets: past winners beat past losers over 3-12 months (Jegadeesh & Titman, 1993), with occasional crashes (Daniel & Moskowitz, 2016). None of that is evidence for a one-week hold. At one week to one month the older research finds the opposite: returns tend to reverse (Jegadeesh, 1990; Lehmann, 1990). This strategy's holding period sits in the reversal window, not the momentum window.",
      "2:1 reward-to-risk is bookkeeping, not an edge. At 2:1 you must win more than 1 trade in 3 before costs just to break even, and random prices would hit a 2:1 target about 1 time in 3 anyway. A target at the prior swing high also caps the big continuation moves that trends pay for. What counts is your actual win rate times your average win against your average loss, from the journal.",
      "20 trades cannot show skill. The win rate from 20 trades carries a margin of error of roughly 22 points, and it takes 100+ trades for even a rough read. After 20 closed trades, compare with simply holding over the same dates, after costs, as a check on your discipline and your real costs, not as proof of an edge. If you did not follow the rules, the test tested nothing.",
      "Regulators that have measured this find most retail traders in leveraged products lose money, but each number is for a specific product and place: EU regulators found 74-89% of retail CFD accounts typically lose money (ESMA, 2018); the CFTC says about two out of three US retail forex traders lose money each quarter; SEBI found 93% of individual equity F&O traders in India lost money over FY2022-24, and 87.7% in FY2026. No regulator publishes a loss rate for cash-account stock swing traders. These figures are for leveraged products, not for buying shares.",
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
    ["FINRA Regulatory Notice 26-10: intraday margin replaces the day-trading rules (Apr 20, 2026)", "https://www.finra.org/rules-guidance/notices/26-10"],
    ["SEC-FINRA Investor Alert (Aug 18, 2009) and FINRA Notice 09-31: leveraged and inverse ETFs", ""],
    ["ESMA (2018): 74-89% of retail CFD accounts typically lose money", ""],
    ["CFTC: about two out of three US retail forex traders lose money each quarter", ""],
    ["SEBI press release 37/2024 (Sep 23, 2024), and its FY2026 study: individual equity F&O traders", ""],
    ["IRS Topic 409 (capital gains) and Publication 550 (wash sales)", "https://www.irs.gov/taxtopics/tc409"],
    ["Each broker's own fractional-share disclosure pages: Fidelity, Schwab, SoFi, Webull, Interactive Brokers, J.P. Morgan", ""],
    ["TradeStation (practitioner commentary, not an authority): pullbacks with a 200-day filter", "https://www.tradestation.com/insights/?p=42984"]
  ]
};
