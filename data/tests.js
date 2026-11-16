// TEST SUITES — one card on the Tests tab per entry. Adding a suite needs only an entry here plus its question files.
//   id          unique, stable (progress is saved against the banks, not this id)
//   title       card heading
//   description one or two sentences
//   banks       ids of the question banks in the suite (the `id` in each window.EXAMS.push({ id, ... }))
//   files       optional extra question-bank scripts to load (q1.js, q2.js, ... are found automatically)
//   questions   optional fallback count; the real count is read from the loaded banks
//   href        optional: link the card to a locally served app instead (localhost only; no question data on this site)
window.HUB_TESTS = {
  suites: [
    { id: "caf", title: "CAF practice exams (CCAR-F)",
      description: "Scenario-based practice for the Claude Certified Architect – Foundations (passed Oct 2026). Keep them for review, with domain accuracy and weak-spot drills.",
      banks: [1, 2, 3, 4, 5, 6, 7, 8], questions: 230 },
    { id: "cap", title: "Exams: CCAR-P (Professional)",
      description: "Four 63-question practice exams for the Claude Certified Architect – Professional, one per course module group. Private: they run from the local ccar-p-exams repo, not from this site.",
      eyebrow: "Private · runs locally", href: "http://localhost:8010/",
      note: "Start it with: cd ccar-p-exams && python3 -m http.server 8010" }
  ]
};
