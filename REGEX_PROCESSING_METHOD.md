# Regex processing method

The real execution engine is the current browser's JavaScript `RegExp`.

1. Slash-form input is parsed without treating escaped slashes or slashes inside character classes as a terminator.
2. Flags are validated, deduplicated, and ordered.
3. Interactive matching runs in `/public/regex-worker.js`.
4. Live runs use a 300 ms timeout; manual runs use 1,000 ms. File work receives a larger bounded timeout.
5. On timeout, the Worker is terminated. JavaScript cannot interrupt a running `RegExp` from inside the same thread.
6. Global zero-width matches advance `lastIndex` manually to prevent an infinite loop.
7. Full match indexes, line, column, numbered groups, named groups, and optional-group participation are serialized to the UI.
8. Replacement uses JavaScript replacement tokens and can add or remove `g` according to first/all selection.
9. File filtering removes stateful `g` and `y` flags for independent line checks.
10. The explainer is a conservative token parser. Unknown or newer syntax is not given a confident fabricated explanation.
11. ReDoS warnings are static heuristics for nested quantifiers, repeated wildcards, ambiguous repeated alternatives, and several unbounded regions. They are not vulnerability verdicts.
