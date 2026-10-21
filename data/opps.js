// OPPORTUNITY CARDS — business ideas Davis collects and Claude analyzes (shown on the Today tab under Jobs Radar).
// Hand-curated, not published by Muse. Add a card by adding an object. All text is escaped at render time; links must be http(s).
// `evidence` says what the card rests on, so a reader can tell the video's claims (`fromSource`) from Claude's own reasoning (`analysis`).
window.HUB_OPPS = [
  {
    id: "app-layer-on-generation-apis",
    added: "2026-10-21",
    title: "Build the app layer on top of someone else's AI model",
    tag: "AI startup route",
    source: { title: "Instagram video by Atlas Berry (paid ad for Higgsfield)", url: "https://www.instagram.com/p/Dew_jvAhA00/" },
    evidence: "No transcript was available (speech-to-text not installed). Based on the post caption and on-screen slides read by OCR, so slide numbers below are approximate. The video is labeled #ad, a promotion for Higgsfield's API.",
    tldr: "Don't build the AI model. Build the product people use around it: the experience, the trend, the audience. Rent generation through an API.",
    philosophy: [
      "Big labs and platforms (OpenAI, Google, Amazon, Meta, Apple, Microsoft, Adobe, Salesforce appear in the slides) spend billions on models and sell them to everyone through APIs. A startup cannot win that fight.",
      "What the API does not give you is a finished product for a specific person with a specific job. That gap, the application layer, is where the video says consumer money is going.",
      "The pitch in this video: Higgsfield handles generation; you build the experience around it. It points out that Higgsfield has no official mobile or desktop app yet, so \"the lane is open\" for a third party to build one."
    ],
    fromSource: [
      "Slide: a list of the \"Top 50 Consumer AI Apps\" by monthly usage, including Midjourney, OpenArt, Perplexity, Notion, HeyGen, Descript, Speechify.",
      "Slide: image-generation growth, Leonardo monthly uniques vs. Midjourney Discord members (2022 to 2023). The point appears to be that apps built on a model can grow as fast as the model's own community.",
      "Slide: what the top 1% of AI spenders over-index on, as a multiple of all AI buyers. Readable entries include n8n 22.9x, Manus 18.2x, Nous Research 14.6x, Fireflies.ai 12.6x, Notion 9.2x. Higgsfield and HeyGen also appear but their numbers were not legible.",
      "Caption: Genjutsu is Higgsfield's model for putting people into viral videos; you upload a clip and photos and get back a postable video."
    ],
    examples: [
      { name: "Higgsfield Genjutsu + a custom app", note: "The video's own example: use the Higgsfield API to build a mobile or desktop app that puts users into trending videos. The model does the generation; you own the interface, trend selection and sharing." },
      { name: "Leonardo", note: "Shown in the video as an image-generation app that grew quickly alongside Midjourney. It is an example of an app-layer company, as the video frames it." },
      { name: "Perplexity, Notion, HeyGen, Descript", note: "Listed in the Top 50 slide as consumer apps. Each is a product built around models rather than a model itself. How much of each runs on third-party models is not something this video says." }
    ],
    implications: [
      "Where it is strong: low capital to start, fast to test, and you can aim at a narrow audience the big platforms ignore. You can ship in weeks.",
      "Where it is weak: you depend on one vendor's price, quality and terms. A thin wrapper has little defense. If the model company ships its own app, which the video says Higgsfield has not yet, your lane closes. Viral-trend products rise and fall quickly.",
      "What decides the outcome is distribution and a repeat reason to return, not the model. Ask who the user is, how you reach them, and why they come back next week.",
      "This idea is one route. Other routes to weigh: sell AI services to small businesses, build for a regulated industry, or build tools for developers or agents. The card's next steps compare them."
    ],
    fit: "Your profile points at health and fitness AI, agents and MCP, and getting hired or earning by March 31, 2027. The app-layer route fits your 'ship three projects' phase. It is a poor fit if the product is only a viral-video novelty with no link to a domain you know.",
    next: [
      "Route comparison (goal 1): list 4 candidate routes (app layer, AI services for small businesses, regulated-industry vertical, developer or agent tools) and score each on time to first revenue, capital, defensibility and fit with your domain knowledge.",
      "Narrow the pick (goal 2): choose one user, one painful job, and one model API. Write a one-page spec and a two-week test: who you would show it to and what would count as a signal.",
      "Check the claims: before relying on the video's numbers, find the original data behind the over-indexing chart, and read the Higgsfield API terms (pricing, usage rights, whether apps are allowed)."
    ]
  }
];
