// TEST SUITES — one card on the Tests tab per entry. Adding a suite needs only an entry here plus its question files.
//   id          unique, stable (progress is saved against the banks, not this id)
//   title       card heading
//   description one or two sentences
//   banks       ids of the question banks in the suite (the `id` in each window.EXAMS.push({ id, ... }))
//   files       optional extra question-bank scripts to load (q1.js, q2.js, ... are found automatically)
//   questions   optional fallback count; the real count is read from the loaded banks
window.HUB_TESTS = {
  suites: [
    { id: "caf", title: "CAF practice exams (CCAR-F)",
      description: "Scenario-based practice for the Claude Certified Architect – Foundations (passed Oct 2026). Keep them for review, with domain accuracy and weak-spot drills.",
      banks: [1, 2, 3, 4, 5, 6, 7, 8], questions: 230 }
  ]
};
