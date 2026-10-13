# Show Your Voice Design System

## 0. Research Log

- Embedded refs: shortlisted `elevenlabs.md`, `spotify.md`, `linear.app.md` -> picked `taste-skill.md` + `elevenlabs.md` because the product name points to voice/audio and the requested scope is a clean React app foundation, not an experimental landing page.
- Lazyweb: skipped - networked screen research is not needed for this initial environment setup.
- Imagen drafts: skipped - the request is for frontend scaffolding, not a finished visual concept.
- Skipped lanes: StyleGallery and component catalog research - no concrete spatial or component problem yet.

## 1. Atmosphere & Identity

Show Your Voice should feel like a quiet studio for making expression visible. The signature is warm acoustic restraint: near-white surfaces, fine shadows, pill controls, and a simple waveform motif that makes the voice concept present without turning the starter screen into a fake product mockup.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | `--surface-primary` | `#ffffff` | `#11100f` | Main app background |
| Surface/secondary | `--surface-secondary` | `#f7f6f4` | `#1a1816` | Section and panel background |
| Surface/elevated | `--surface-elevated` | `#ffffff` | `#24211e` | Cards, controls, floating panels |
| Surface/warm | `--surface-warm` | `#f5f2ef` | `#302a25` | Featured callouts and secondary actions |
| Text/primary | `--text-primary` | `#111111` | `#f6f2ee` | Headlines and primary UI text |
| Text/secondary | `--text-secondary` | `#4e4e4e` | `#c8c0b8` | Body copy and helper text |
| Text/tertiary | `--text-tertiary` | `#777169` | `#948b82` | Metadata and muted labels |
| Border/default | `--border-default` | `#e5e2dd` | `#39342f` | Cards, controls, dividers |
| Border/subtle | `--border-subtle` | `rgba(0, 0, 0, 0.05)` | `rgba(255, 255, 255, 0.08)` | Hairlines and soft edges |
| Accent/primary | `--accent-primary` | `#111111` | `#f6f2ee` | Primary CTA background |
| Accent/warm | `--accent-warm` | `#e9ded4` | `#5c4b3d` | Warm secondary emphasis |
| Focus/ring | `--focus-ring` | `rgba(70, 130, 210, 0.5)` | `rgba(147, 197, 253, 0.56)` | Keyboard focus rings |
| Status/success | `--status-success` | `#2e7d55` | `#75d49c` | Positive state |
| Status/warning | `--status-warning` | `#9a6a1f` | `#f0bd63` | Warning state |
| Status/error | `--status-error` | `#b3403d` | `#ff8d87` | Error state |

### Rules

- Accent is functional: primary action, focus, or an actual state. Decorative accents stay out of the system.
- New colors must be added here before they appear in code.
- State is shown with tonal fills, shadow, and text changes. Do not use colored accent borders for selected, focused, or active states.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | `clamp(3rem, 8vw, 6rem)` | 300 | 1.02 | -0.03em | Hero and first-run product statement |
| H1 | `clamp(2.25rem, 5vw, 4.25rem)` | 300 | 1.08 | -0.02em | Page titles |
| H2 | `2rem` | 400 | 1.18 | -0.01em | Section headings |
| H3 | `1.375rem` | 500 | 1.3 | 0 | Card headings |
| Body/lg | `1.25rem` | 400 | 1.45 | 0.01em | Lead copy |
| Body | `1rem` | 400 | 1.6 | 0.01em | Default text |
| Body/sm | `0.875rem` | 400 | 1.5 | 0.01em | Supporting UI text |
| Caption | `0.75rem` | 500 | 1.4 | 0.04em | Metadata and compact labels |

### Font Stack

- Primary: `"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif`
- Display: `"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif`
- Mono: `"SFMono-Regular", "Cascadia Code", "Roboto Mono", monospace`

### Rules

- Use light display weight for the largest text. It should feel airy, not loud.
- Body text never drops below 14px.
- Letter spacing is subtle and positive for body text.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
| --- | --- | --- |
| `--space-1` | `4px` | Tight inline gaps |
| `--space-2` | `8px` | Compact controls |
| `--space-3` | `12px` | Form and button padding |
| `--space-4` | `16px` | Standard clusters |
| `--space-5` | `20px` | Comfortable inline groups |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Group separation |
| `--space-10` | `40px` | Section internal spacing |
| `--space-12` | `48px` | Major content rhythm |
| `--space-16` | `64px` | Page-level rhythm |
| `--space-20` | `80px` | Hero spacing |

### Grid

- Max content width: 1180px
- Column system: responsive two-column hero that collapses to one column below 820px
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px

### Rules

- Use tokens for spacing intent; use `clamp()`, percentages, and intrinsic sizing for browser mechanics.
- Primary content must collapse to one readable column at 390px without horizontal scroll.

## 5. Components

### App Shell

- **Structure**: root container with header, main, and footer landmarks.
- **Variants**: starter landing, future authenticated shell.
- **Spacing**: `--space-4` to `--space-20`.
- **States**: responsive nav compacts without wrapping; focus states remain visible.
- **Accessibility**: semantic landmarks, skip-free linear reading order.
- **Motion**: initial content fades and translates under reduced-motion control.
- **Layout**: stack and responsive split.

### Button

- **Structure**: semantic `button` or `a` styled as pill control.
- **Variants**: primary black, warm secondary, ghost.
- **Spacing**: `--space-3` vertical, `--space-5` horizontal.
- **States**: hover lift, active press, disabled opacity, visible focus ring.
- **Accessibility**: labels stay text, 44px minimum touch target.
- **Motion**: transform and shadow only.
- **Layout**: cluster item.

### Surface Card

- **Structure**: rounded section or article with heading, body, optional supporting visual.
- **Variants**: elevated, warm, quiet.
- **Spacing**: `--space-6`.
- **States**: hover shadow only when interactive.
- **Accessibility**: no card-only click targets unless the whole card is a semantic link.
- **Motion**: opacity and transform for entrance only.
- **Layout**: stack.

### Waveform Motif

- **Structure**: decorative group of vertical bars marked `aria-hidden`.
- **Variants**: hero large, compact inline.
- **Spacing**: fixed internal gap with responsive container sizing.
- **States**: static by default; no infinite animation in the foundation.
- **Accessibility**: decorative only, not announced.
- **Motion**: optional future transform/opacity animation with reduced-motion fallback.
- **Layout**: visual asset.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | 120ms | ease-out | Button hover and press |
| Standard | 220ms | ease-in-out | Surface transition |
| Emphasis | 520ms | cubic-bezier(0.16, 1, 0.3, 1) | First paint hero reveal |

### Rules

- Animate only `transform`, `opacity`, and `filter`.
- Respect `prefers-reduced-motion`; reduce movement to opacity changes.
- Interactive elements must have hover, active, and focus states.

## 7. Depth & Surface

### Strategy

Use mixed depth with warm low-opacity shadow stacks and subtle borders.

| Level | Value | Usage |
| --- | --- | --- |
| Inset edge | `inset 0 0 0 1px var(--border-subtle)` | Fine surface definition |
| Card | `0 0 0 1px rgba(0,0,0,0.04), 0 8px 28px rgba(78,50,23,0.06)` | Starter cards |
| Warm lift | `0 10px 30px rgba(78,50,23,0.08)` | Featured warm actions |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `--radius-sm` | `8px` | Inputs and compact elements |
| `--radius-md` | `16px` | Cards |
| `--radius-lg` | `24px` | Hero and large panels |
| `--radius-full` | `9999px` | Buttons and pills |

### Rules

- Elevation must pair shadow, scale, and highlight. A shadow alone is not a state.
- Nested radii are concentric: inner radius is smaller than outer radius.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG target: 2.2 AA.
- Body contrast minimum: 4.5:1. Large text minimum: 3:1.
- Focus must be visible on every interactive element.
- System color scheme preference is respected.
- Reduced motion preference is respected.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| None | n/a | n/a | n/a |
