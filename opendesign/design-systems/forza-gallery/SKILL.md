---
name: forza-gallery
description: Forza-inspired automotive-game UI design system for a car-enthusiast portfolio. Dark-only, sharp-edged, red used sparingly. Use for any car-gallery, showroom, or vehicle-detail surface in this project.
---

# Forza Gallery design system

A premium automotive-game UI, referencing **Forza Motorsport 4** menus and **Forza Horizon** cinematic screens, adapted for a modern web portfolio. The dark background exists so the car — and eventually the live WebGL 3D model — is the undisputed star of every screen.

## Tone
Showroom that doubles as a workshop: precise, technical, a little dramatic, never garish. Red (`#e8002d`) is for emphasis only — active tab, category label, available-count badge, stat fill, S-class plate. Never decoration.

## Tokens
Canonical tokens live in `tokens/colors_and_type.css`. Key roles:
- **Backgrounds:** `--bg-primary #0d0d0d` (page), `--bg-surface #1a1a1a` (panels/strips), `--bg-elevated #242424` (hover/selected).
- **Accent:** `--accent-red #e8002d`, hover `--accent-red-dim #9b0020`.
- **Text:** `--text-primary #f0f0f0` (names), `--text-secondary #8a8a8a` (body), `--text-label #c0c0c0` (nav/stat labels).
- **Lines:** `--border-subtle #2e2e2e` — 1px rules used liberally to section content (a key Forza signature).
- **Class plates:** S=red, A=orange, B=yellow, C=green, D=blue.

## Type
- Display + tracked labels: **Barlow Semi Condensed**.
- Body: **Barlow**.
- Class badges / stat numerals: **Space Mono**.
- Section labels: ALL CAPS, `letter-spacing: 0.18em`, 11px, red or grey.
- Car names: 24–36px bold, tight tracking.

## Layout rules
- Sharp edges — radius max 4px. No drop shadows; use borders + layering. No gradients except subtle dark-to-darker vignettes on image panels.
- Left-aligned content; numbers/metadata right-align in their column.
- Generous negative space, especially around the 3D viewport.
- Reusable patterns: bottom **filmstrip** (manufacturer emblems / car thumbnails), **vertical rotated side label** ("MANUFACTURER SELECT", "CAR SELECT").

## Components (see the mockup component library)
NavTab · SectionLabel · ClassBadge · StatBar · EmblemTile · CarThumbnailCard · CarProfileCard · HoverArrow · VerticalRotatedLabel · DividerRule.

## Don't
No light mode / white backgrounds. No emoji or decorative icons (UI chevrons/arrows/× only). No rounded corners > 4px. No features beyond the wireframe flow: Home → Gallery → Manufacturer Select → Individual Car → Scroll-down Detail.
