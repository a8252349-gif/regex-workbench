# Known limitations

- Only the current browser's JavaScript `RegExp` engine is executed. PCRE, Python, Java, .NET, and other engines are comparison topics only.
- Browser support for lookbehind and the `d` and `v` flags can differ. Unsupported flags are disabled when capability detection fails.
- A Worker timeout limits the effect of a slow expression but cannot prove that a pattern is safe for every input.
- The explainer and visualizer are token-based. They provide an accessible flow representation rather than a complete ECMAScript AST or railroad diagram for every future grammar feature.
- The main input uses an accessible textarea plus a separate match presentation rather than CodeMirror or Monaco decoration virtualization. Very large interactive text is therefore intentionally limited.
- Line and column calculations follow JavaScript UTF-16 string indexing. A user-perceived grapheme may span multiple code units.
- Selected files are currently read through the browser File API into memory before Worker processing. The 100 MB advanced mode can strain low-memory devices and is not a true streaming parser.
- CSV input is treated as text lines rather than parsed as full RFC-compliant CSV. Exported CSV fields are escaped correctly for generated results.
- Replacement is preview-first and does not overwrite the source editor, so there is no multi-step document undo history.
- The test-case panel supports execution, expected results, notes, activation state, import, export, duplication, and deletion, but it does not currently provide drag-and-drop reordering.
- Manual AdSense slot variables and ownership infrastructure are prepared, but ads remain disabled by default. Live consent behavior and ad delivery must be verified after configuring Google CMP and receiving approval.
- Browser extensions, operating-system software, and the user's device can observe information outside the application's control.
- The included static output uses the provisional build origin configured during verification. Set the final `NEXT_PUBLIC_SITE_URL`, contact email, and verification values in Render, clear the build cache, and rebuild before public launch.
- A deployed-domain audit and Lighthouse audit cannot be completed until the final site is online.
