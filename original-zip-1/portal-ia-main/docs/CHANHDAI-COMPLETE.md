# Portal IA - original hierarchy restoration

Branch de continuidade: `handoff/portal-original-ui-audit` (derivada de `experiment/chanhdai-completo`).
Local preview: http://127.0.0.1:5194/.

The current revision supersedes the earlier editorial Chanh Dai layout. Following Tommy Geoco's UI Audit, original institutional copy and visual hierarchy take precedence over the experimental reference.

65 restored files match `portal-codigo-original.zip` exactly after newline normalization. The original home order, Montserrat display typography, heading sizes and weights, header, navigation, reading layouts, search and installation sections are restored. The remaining Chanh Dai preset changes only neutral surfaces and border finishes; it contains no layout or typography overrides.

Evidence: `original-copy-restoration.json`, `original-fidelity-browser.json`, `UI-AUDIT-ORIGINAL-FIDELITY.json`. Browser review covers ten principal routes at 1440 and 390 pixels, with no horizontal overflow or JavaScript page errors. Six automated accessibility scans found no WCAG A/AA violations with reduced motion enabled.

Typecheck, lint and production build passed. The complete unit suite remains at 449 passing, 24 failing and 36 skipped tests. Missing private catalogue content and existing prototype infrastructure limitations prevent a green full gate; no private content was invented.

The restoration was published at https://portal-ia-craft-preview.vercel.app in deployment dpl_D35RjVPRv2SpzkhS9CbbkZbd77So. The handoff branch adds the GitHub shortcut next to the theme switch; see HANDOFF-PORTAL.md for continuation instructions.
