# Security

- No server-side regex execution endpoint exists.
- Test strings and supported file contents remain in the browser.
- Potentially expensive matching runs in a terminable Web Worker.
- User strings are rendered as React text nodes, not executable HTML.
- The project does not use `eval` or `new Function`.
- Download names are sanitized; ZIP entries use sanitized file names.
- Object URLs are revoked after downloads.
- Uploaded file contents are not stored in localStorage.
- Shared URLs are explicit, length-limited, and show a privacy warning.
- Result display is capped to prevent the DOM from growing without limit.
- The Render blueprint adds content-type, referrer, permissions, and content-security headers.

A malicious pattern may still consume Worker CPU until the timeout. A browser extension, compromised device, copied URL, screenshot, or downloaded file remains outside the site's complete control. Report a security issue through the configured contact address without including real secrets.
