# Vipul Ojha Portfolio — Complete Replication Specification

> **Purpose:** implementation-ready research and acceptance criteria for recreating the portfolio at `https://vipulojha.github.io/#home`.
>
> **Observed:** October 24, 2026. The requested GitHub Pages URL renders the `vipulojha.dev` portfolio experience. The specification below records the visible page, source structure, responsive behavior, interaction model, visual system, content, and external destinations observed from the live site.

### Live source references inspected

- Page markup and metadata: `https://vipulojha.github.io/`
- Stylesheet: `https://vipulojha.github.io/styles.css`
- Client behavior: `https://vipulojha.github.io/app.js`
- Profile image: `https://vipulojha.github.io/assets/avatar.png`
- Favicon: `https://vipulojha.github.io/favicon.svg`
- Social preview: `https://vipulojha.github.io/assets/social-card.png`

## 1. Replication target

Recreate a single-page personal portfolio with the same information architecture and interaction model:

- Editorial portfolio layout rather than a conventional card-grid landing page.
- A large, CSS-built smartphone mockup on the left/above the fold.
- A contextual detail panel on the right/below the phone.
- The phone behaves like a miniature app launcher: tapping a section opens a slide-up sheet inside the device while the desktop detail panel switches to the same section.
- Hash-based navigation remains shareable: `#home`, `#about`, `#projects`, `#stack`, `#contact`, `#canteen`, `#workout`, `#pos`, `#inventory`, and `#ohman`.
- Light/dark theme toggle, project filters, clipboard email action, keyboard escape/back behavior, external GitHub/demo links, and mail links.
- Graceful non-JavaScript fallback: hide the phone and show all detail panels as ordinary document sections.

### Assumption

This document is an implementation brief, not a request to copy private credentials or deploy anything. Reuse the portfolio copy, photograph, and project links only with the site owner's permission.

## 2. Page map

| Route/hash | Desktop detail panel | Phone launcher/sheet | Purpose |
|---|---|---|---|
| `#home` | Overview | Home screen | Intro and navigation hub |
| `#about` | Curious by default. | THE PERSON / 01 | Short biography and GitHub CTA |
| `#projects` | Things I’ve built. | SELECTED WORK / 02 | Filterable project list |
| `#stack` | Tools of the trade. | THE TOOLKIT / 03 | Skills grouped by category |
| `#contact` | Have an idea? Let’s talk. | GET IN TOUCH / 04 | Email CTA and copy action |
| `#canteen` | Smart Canteen System. | WEB APP / 01 | Project detail |
| `#workout` | Workout Tracker. | ANDROID / 02 | Project detail |
| `#pos` | POS System. | WEB APP / 03 | Project detail |
| `#inventory` | Core Inventory System. | HACKATHON · WEB / 04 | Project detail and live demo |
| `#ohman` | ohman. | DESKTOP · FORK / 05 | Project detail and attribution |

Invalid or missing hashes resolve to the overview/home state.

## 3. Visual direction

### Design language

- Warm editorial desk / paper aesthetic with restrained dark-olive, clay, beige, and muted green accents.
- Useful, quiet, tactile, and slightly analog; avoid glossy gradients, neon colors, or generic SaaS styling.
- Large expressive typography paired with compact uppercase metadata.
- The phone is the visual anchor; the right-hand content is calm and text-led.
- Use thin borders, rounded pills, subtle paper grain, soft shadows, and short state transitions.

### Fonts

Load from Google Fonts, or use equivalent local fallbacks:

- **Body/UI:** `DM Sans`, weights 400/500/600/700/800.
- **Headings/brand:** `Space Grotesk`, weights 400/500/600/700.

Recommended CSS font stacks:

```css
font-family: 'DM Sans', sans-serif;
font-family: 'Space Grotesk', sans-serif;
```

### Light theme tokens

```css
:root {
  color-scheme: light;
  --paper: #ebe5d9;
  --ink: #312c26;
  --muted: #716a60;
  --accent: #bf6849;
  --line: #cfc5b6;
  --panel: #f6f0e5;
  --soft: #e3d8c7;
  --shadow: 0 28px 55px rgba(51, 40, 28, .16);
}
```

### Dark theme tokens

```css
html[data-theme='dark'] {
  color-scheme: dark;
  --paper: #29251f;
  --ink: #f0e8dc;
  --muted: #b9aea0;
  --accent: #de9473;
  --line: #51473c;
  --panel: #373028;
  --soft: #453b32;
  --shadow: 0 28px 55px rgba(0, 0, 0, .27);
}
```

### Background and texture

- Light mode page background: `--paper` plus two soft radial highlights:
  - warm white highlight near 15% / 7%;
  - muted brown highlight near 90% / 85%.
- Dark mode: deep brown background with a restrained warm radial highlight.
- Add a fixed, pointer-events-none paper/noise overlay using a low-opacity inline SVG `feTurbulence` texture.
- Text selection uses a pale clay background and dark ink.

### Shape, spacing, and motion

- Global `box-sizing: border-box`.
- Body default: 15px, `1.65` line-height.
- Header/footer max width: 1060px, normally `calc(100% - 64px)`.
- Main experience max width: 920px, normally `calc(100% - 64px)`.
- Phone width: 318px; height: 650px; 6px outer border; 48px outer radius; 37px inner screen radius.
- Main grid: 318px phone column + flexible detail column; gap `clamp(45px, 7vw, 96px)`.
- Main vertical padding: 66px top / 72px bottom; minimum height about 730px on desktop.
- Detail panel max width: 490px.
- Detail heading: roughly 42–58px, `Space Grotesk`, weight 500, tight letter spacing (`-0.07em`), line height about 1.02.
- Entry animation: 240ms ease, slight upward translation and opacity change.
- Phone sheet animation: 220–240ms slide upward with opacity/visibility transitions.
- Respect `prefers-reduced-motion: reduce`: disable animation/transition and avoid smooth scrolling.

## 4. Global shell

### Header

- Full-width centered header with a bottom 1px border.
- Desktop minimum height: 90px.
- Brand at left: `vipul ojha` in Space Grotesk, lowercase, 19px, tight tracking, with the final dot colored `--accent`.
- Navigation at right: `About`, `Projects`, `Stack`, `Contact`.
- Theme control at far right: a rounded transparent bordered button displaying `◐`.
- Header navigation links and theme button use small muted text and become accent colored on hover.
- Header is a semantic `<header>` containing a `<nav aria-label="Main navigation">`.

### Footer

- Centered max width 1060px with a top border.
- Desktop minimum height about 68px, laid out as two sides:
  - `© {currentYear} Vipul Ojha · Made with curiosity in India.`
  - `GitHub ↗ · Email ↗`
- Year is generated at runtime from `new Date().getFullYear()`.
- On narrow screens, wrap the two sides and align to the top of the footer row.

### Accessibility shell

- Add a skip link to `#main`, visually hidden above the viewport until focused.
- Use visible `:focus-visible` outlines: approximately 3px accent outline with 4px offset.
- Use real links for navigation and external destinations; use buttons for theme, filter, back/home, and clipboard actions.
- Add `aria-label` to icon-only phone dock controls and phone navigation buttons.
- Add `aria-current="page"` to the active phone launcher when a section is open.
- Keep a live status region for copy-to-clipboard feedback.

## 5. Main layout and phone mockup

### Desktop composition

```text
┌──────────────────────────────────────────────────────────────┐
│ brand                                      nav  theme         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│     ┌────────────── phone ──────────────┐  eyebrow           │
│     │ status / island                   │  large title       │
│     │ home widgets OR detail sheet      │  intro copy        │
│     │ app launcher grid                 │  actions           │
│     │ dock                              │  metadata          │
│     └───────────────────────────────────┘                    │
│       Tap an icon to take a closer look ↗                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ footer                                                       │
└──────────────────────────────────────────────────────────────┘
```

### Phone frame

- CSS-only device frame; no separate phone frame image.
- Outer frame uses a dark metallic linear gradient, inset highlights, layered shadows, and a small right-side button/edge detail.
- Screen uses layered warm beige/peach/green radial gradients plus a large soft diagonal lower shape.
- Add an iPhone-like status row:
  - left: `9:41`;
  - centered dark dynamic island, about 90×25px;
  - right decorative `● ▰`.
- Screen content starts below the 40px status area.

### Phone home widgets

1. **Profile widget**
   - Translucent rounded card, about 83px tall.
   - 44×44px rounded avatar frame on the left.
   - `HELLO, I'M`, `Vipul Ojha`, `Student · developer · builder` on the right.
2. **Motto widget**
   - Slightly warmer translucent card, about 75px tall.
   - Leading `✳` and two lines: `Useful over flashy.` / `Built to be used.`
3. **Selected work widget**
   - Muted green translucent card, about 85px tall.
   - `SELECTED WORK` and `5 little things` / `I've built ↗`.
   - Clicking opens the projects state.
4. **App grid**
   - Eight launchers in a 4-column grid:
     - `✳` About
     - `{ }` Stack
     - `▤` Canteen
     - `◉` Workout
     - `₹` POS
     - `▦` Inventory
     - `✺` ohman
     - `✉` Contact
   - Each icon is a 46×46px rounded square with its own muted color, white symbol, inset highlight, and shadow.
   - Hover lifts the icon about 3px.
5. **Dock**
   - Bottom translucent blurred rounded bar, approximately 57px tall.
   - Three controls: `GH`, `✉`, `⌂`.
   - GitHub opens the profile in a new tab; email opens `mailto:`; home returns to overview.

### Phone detail sheet

- When a non-overview section is active:
  - dim/scale the home screen to about 0.94 and opacity about 0.32;
  - reveal a sheet from the bottom covering the content area below the status row;
  - use an opaque panel background, top toolbar, scrollable body, and bottom home indicator;
  - toolbar contains a `←` back button and the current sheet title;
  - the home indicator is a centered rounded bar and also acts as a return-home button;
  - phone sheet content is generated from templates for each section.
- Sheet body has compact 10–13px copy, rounded cards, compact buttons, and project list rows.
- Project sheet includes small decorative CSS illustrations for each project (receipt, progress ring, terminal, boxes, abstract symbol); these are visual-only and not functional media.

## 6. Content specification

### Overview (`#home`)

- Eyebrow: `A SMALL CORNER OF THE INTERNET ✳`
- Heading: `A little window` / `into my world.` with `world.` accent colored and italic-like emphasis removed in the final visual style.
- Lead: `Hi, I’m Vipul — a student and developer from India building useful things for real people.`
- Supporting copy: `From desktop utilities and Android apps to web and business tools, I enjoy turning everyday problems into practical software and learning something new with every build.`
- Primary action: `Explore my work ↗` → `#projects`.
- Secondary action: `A little about me →` → `#about`.
- Metadata: `BASED IN INDIA · ALWAYS LEARNING`.

### About (`#about`)

- Eyebrow: `01 / THE PERSON`.
- Heading: `Curious by default.`
- Lead: `Hi, I’m Vipul.`
- Body: `I’m a student from India interested in software engineering and product development. I enjoy turning everyday problems into practical tools — and learning something new with every build.`
- Closing line: `Useful over flashy. Built to be used.`
- Actions: `Find me on GitHub ↗` and `Say hello →`.

### Projects (`#projects`)

- Eyebrow: `02 / SELECTED WORK`.
- Heading: `Things I’ve built.`
- Lead: `A mix of web, Android, and desktop projects — each one a chance to make something useful.`
- Filter controls: `All`, `Web`, `Android`, `Desktop`.
- Initial count: `5 projects`.
- Projects:

| # | Category | Name | Description | Tags | Detail hash | External action |
|---|---|---|---|---|---|---|
| 01 | WEB APP | Smart Canteen System | A canteen management system built with PHP and MySQL. | PHP · MySQL | `#canteen` | GitHub: `https://github.com/vipulojha/smart-canteen-system` |
| 02 | ANDROID | Workout Tracker | An Android app with login, workout plans, exercises, and progress tracking. | Java · Android | `#workout` | GitHub: `https://github.com/vipulojha/workout_tracker` |
| 03 | WEB APP | POS System | A JavaScript project for managing products and transactions. | JavaScript | `#pos` | GitHub: `https://github.com/vipulojha/-POS-System` |
| 04 | HACKATHON · WEB | Core Inventory System | An inventory system created for a hackathon. | Inventory tools | `#inventory` | Demo: `https://coreinventorysystem-odoo.vercel.app`; GitHub: `https://github.com/vipulojha/CoreInventorySystem-Odoo` |
| 05 | DESKTOP · FORK | ohman | A fork of a C# utility for OMEN and Victus fan, GPU, and lighting controls. Credit for the original project belongs to its upstream authors. | C# · Windows | `#ohman` | Fork: `https://github.com/vipulojha/ohman` |

- Render the list as bordered rows, with project number on its own line at narrow widths, title/description/tags in the middle, and repository/demo action(s) on the right.
- Add `More on GitHub ↗` linking to `https://github.com/vipulojha?tab=repositories`.

### Stack (`#stack`)

- Eyebrow: `03 / THE TOOLKIT`.
- Heading: `Tools of the trade.`
- Lead: `Languages and tools I’ve used across projects, with plenty more to learn.`
- Groups and tags:
  - **Languages & web:** C#, Java, JavaScript, HTML & CSS, PHP, PowerShell.
  - **Data & platforms:** MySQL, Android, Desktop, Web.
  - **Workflow:** Git, GitHub, Build · Learn · Iterate.
- Tags are compact bordered pills.

### Contact (`#contact`)

- Eyebrow: `04 / GET IN TOUCH`.
- Heading: `Have an idea?` / `Let’s talk.`
- Lead: `Whether you want to collaborate, share feedback, or just say hi — my inbox is open.`
- Primary action: `Email me ↗` → `mailto:vipul.ojha.dev@gmail.com`.
- Secondary action: `Copy email ⧉`.
- Visible email: `vipul.ojha.dev@gmail.com`.
- Copy success text: `Email copied to clipboard.`
- Copy failure text: `Could not copy. Use the email link instead.`

### Project detail panels

Each detail panel includes the category eyebrow, title, lead, tags when applicable, a primary external CTA, and `All projects →` back link when there is no separate live demo.

- **Canteen:** `01 / WEB APP`; `Smart Canteen System.`; PHP, MySQL; repository CTA.
- **Workout:** `02 / ANDROID`; `Workout Tracker.`; Java, Android; repository CTA.
- **POS:** `03 / WEB APP`; `POS System.`; JavaScript; repository CTA.
- **Inventory:** `04 / HACKATHON · WEB`; `Core Inventory System.`; live demo CTA, GitHub CTA, all-projects link.
- **ohman:** `05 / DESKTOP · FORK`; `ohman.`; body repeats fork attribution; C#, Windows; view-fork CTA.

## 7. Behavior and state model

### State

```text
selectedPanel: overview | about | projects | stack | contact |
               canteen | workout | pos | inventory | ohman
filter: all | web | android | desktop
theme: light | dark
invoker: last launcher/link that opened the phone sheet
```

### Panel switching

Implement one `reveal(key, options)` function that:

1. Validates the key against known panels.
2. Hides every desktop detail panel except the selected one.
3. Keeps the phone home visible for `overview`; otherwise hides it and opens the phone sheet.
4. Clears and repopulates sheet content from the matching template.
5. Updates the sheet toolbar title from the cloned screen title.
6. Preserves the current project filter when opening the projects sheet.
7. Adds `aria-current="page"` to the matching phone launcher.
8. Optionally updates the URL hash using `history.replaceState`.
9. Optionally moves focus to the sheet back button, or returns focus to the original launcher/brand when going home.

### Navigation rules

- Intercept same-origin internal links with `data-open` only for ordinary primary-click navigation.
- Do not intercept modified clicks (`Ctrl`, `Cmd`, `Shift`, `Alt`) or links that target another window.
- `hashchange` must call the same panel-switching path.
- `#home` maps internally to `overview`.
- Back button, phone home indicator, dock home, brand, and `Escape` return to overview.
- External GitHub/demo links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

### Project filtering

- Filter buttons use `data-filter` values: `all`, `web`, `android`, `desktop`.
- Each card uses `data-category`.
- Nonmatching cards are hidden, not removed from the DOM.
- Update `aria-pressed` on all filter buttons.
- Recalculate count as singular/plural: `1 project` or `N projects`.
- Apply the same filter to project links inside the phone projects sheet.
- Initial state: `all`, count `5 projects`.

### Theme

- On startup, read `localStorage.theme` if it is `light` or `dark`.
- Otherwise use `window.matchMedia('(prefers-color-scheme: dark)')`.
- Apply theme through `html[data-theme="dark"]`.
- Toggle `aria-pressed` and label dynamically:
  - dark active → `Switch to light theme`;
  - light active → `Switch to dark theme`.
- Persist a valid user selection back to local storage.

### Clipboard

- Copy exactly `vipul.ojha.dev@gmail.com` with `navigator.clipboard.writeText`.
- Provide success/failure text in an `aria-live="polite"` status region.
- Keep the email mailto link available if clipboard permissions fail.

### Clock

- The current implementation displays the decorative fixed text `9:41`; it is not a live clock. Preserve that behavior unless intentionally changing the design.

## 8. Responsive behavior

### Desktop / wide (`>760px`)

- Two-column layout with phone and detail content side by side.
- Header nav in one row.
- Phone centered in its column; detail text aligned to its column.
- Footer uses a horizontal two-side layout.

### Tablet / mobile (`≤760px`)

- Header/footer width becomes `calc(100% - 36px)`.
- Header may wrap; brand stays first, navigation can move to a full-width row.
- Main experience becomes a vertical flex layout, phone first and detail second.
- Main width: `min(520px, calc(100% - 36px))`.
- Detail panel becomes full available width.
- Heading remains large but uses a responsive clamp around 42–54px.
- Footer wraps and aligns content to the start.

### Small mobile (`≤460px`, `≤400px`, `≤340px`)

- Navigation gap and font sizes reduce.
- At ≤460px, nav takes a new row while theme control stays aligned right.
- At ≤400px, phone is constrained to available width and heading bottoms out around 42px.
- At ≤340px, global width becomes `calc(100% - 26px)`, phone height reduces to about 620px, home padding shrinks, and app icons reduce to about 41px.
- The phone home screen and sheet bodies must scroll without showing a visible scrollbar.

## 9. Assets and metadata

### Required assets

- `assets/avatar.png` — profile photo displayed in the phone profile widget. Use as a square cropped image with `object-fit: cover`.
- `favicon.svg` — document favicon.
- `assets/social-card.png` — social preview image.

### Document metadata

```html
<html lang="en">
<meta name="theme-color" content="#f8f6f0">
<meta name="description" content="Vipul Ojha is a student and developer from India building practical desktop, Android, and web tools. Explore projects and get in touch.">
<link rel="canonical" href="https://vipulojha.github.io/">
<meta property="og:type" content="website">
<meta property="og:title" content="vipulojha.dev">
<meta property="og:description" content="Practical software for the web, Android, and desktop. Projects, skills, and ways to connect.">
<meta property="og:url" content="https://vipulojha.github.io/">
<meta property="og:image" content="https://vipulojha.github.io/assets/social-card.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="vipulojha.dev">
<title>vipulojha.dev</title>
```

### External destinations

- Profile: `https://github.com/vipulojha`
- Email: `vipul.ojha.dev@gmail.com`
- Smart Canteen: `https://github.com/vipulojha/smart-canteen-system`
- Workout Tracker: `https://github.com/vipulojha/workout_tracker`
- POS System: `https://github.com/vipulojha/-POS-System`
- Core Inventory demo: `https://coreinventorysystem-odoo.vercel.app`
- Core Inventory repository: `https://github.com/vipulojha/CoreInventorySystem-Odoo`
- ohman fork: `https://github.com/vipulojha/ohman`

## 10. Suggested component structure

Keep the implementation framework-agnostic. The following decomposition maps cleanly to HTML/CSS/JS, React, Vue, or another component system:

```text
AppShell
├── SkipLink
├── SiteHeader
│   ├── BrandLink
│   ├── MainNav
│   └── ThemeToggle
├── Main
│   └── Experience
│       ├── PhoneColumn
│       │   ├── PhoneFrame
│       │   │   ├── PhoneStatus
│       │   │   ├── PhoneHomeScreen
│       │   │   │   ├── ProfileWidget
│       │   │   │   ├── MottoWidget
│       │   │   │   ├── SelectedWorkWidget
│       │   │   │   ├── AppGrid
│       │   │   │   └── PhoneDock
│       │   │   └── PhoneSheet
│       │   │       ├── SheetToolbar
│       │   │       └── SheetBody
│       │   └── PhoneHint
│       └── DetailColumn
│           └── DetailPanel (one active at a time)
└── SiteFooter
```

Data-drive the five project records and the five project detail records so the desktop list, phone list, filters, and detail panels cannot drift apart.

## 11. Acceptance checklist

### Structure and content

- [ ] Requested URL/hash mapping works for every listed section.
- [ ] Header, phone, detail panel, and footer match the described composition.
- [ ] All five projects, descriptions, tags, categories, and external links are present.
- [ ] Stack groups and contact copy are complete.
- [ ] Avatar, favicon, and social card paths are wired.

### Visual fidelity

- [ ] Light palette, dark palette, paper texture, borders, rounded cards, shadows, and accent color match.
- [ ] Phone dimensions, dynamic island, status row, widgets, app grid, dock, sheet, and home indicator match.
- [ ] Desktop two-column layout and mobile stacked layout match the breakpoints.
- [ ] Typography uses DM Sans for body/UI and Space Grotesk for headings/brand.
- [ ] Reduced-motion behavior is honored.

### Interaction fidelity

- [ ] Header links, phone launchers, widgets, detail links, back, home, and `Escape` switch state correctly.
- [ ] URL hash updates without a full page reload and direct hash entry opens the correct state.
- [ ] Theme preference is detected, toggled, labeled, and persisted.
- [ ] Project filters update visible cards, phone project rows, active button state, and count.
- [ ] Copy email reports success/failure accessibly.
- [ ] External links open safely in a new tab where specified.

### Accessibility and fallback

- [ ] Skip link works.
- [ ] Keyboard users can reach every control and escape the phone sheet.
- [ ] Focus returns to a sensible opener when a sheet closes.
- [ ] All icon-only links have accessible labels.
- [ ] `aria-current`, `aria-pressed`, `aria-live`, and button labels are correct.
- [ ] With JavaScript disabled, the page still presents readable content and ordinary anchor navigation.

## 12. Manual verification matrix

| Test | Expected result |
|---|---|
| Load with no hash | Overview/home is visible; phone home is visible |
| Load `#about` directly | About desktop panel and phone sheet are active |
| Click phone About | URL becomes `#about`; sheet opens; focus moves to back |
| Press Escape in a sheet | Overview returns; focus returns to opener when possible |
| Click `Web` filter | 3 web cards remain; count updates to `3 projects`; phone list matches |
| Click `Android` filter | 1 card remains; count reads `1 project` |
| Click `Desktop` filter | 1 card remains; count reads `1 project` |
| Click theme toggle | Palette, label, pressed state, and local storage update |
| Reload after theme change | Saved theme remains |
| Click Copy email | Status reports copied email, or fallback message if clipboard is unavailable |
| Disable JavaScript | Phone is hidden; readable detail panels are shown as normal sections |
| Resize to 760px and below | Layout stacks; header/footer wrap without horizontal overflow |
| Resize to 340px and below | Phone and content fit without horizontal overflow |
| Enable reduced motion | Transitions and animations are removed |

## 13. Implementation note

The live experience is intentionally small and dependency-light: semantic HTML, one stylesheet, one client-side script, Google Fonts, and a few image assets are sufficient. Preserve that simplicity unless the replication project has a concrete need for a framework. The most important fidelity work is not a complex backend; it is matching the responsive phone/detail split, the warm editorial visual system, and the synchronized hash-driven state across desktop and phone surfaces.

## 14. Validation run

The specification was checked against the live source on **October 24, 2026** rather than being treated as an untested design theory.

### Automated live-source contract check

The validator fetched the page, stylesheet, script, favicon, avatar, and social-card assets and checked the implementation details described above.

```text
22 passed, 0 failed
```

Verified:

- All six primary source/assets returned HTTP 200.
- HTML contains 10 detail panels, 5 project cards, 4 filter buttons, and 5 phone project templates.
- Required theme and Open Graph metadata are present.
- Skip link and `main` landmark are present.
- Light and dark CSS token sets are present.
- All documented responsive breakpoints are present: 760px, 460px, 400px, and 340px.
- Reduced-motion CSS is present.
- Phone-sheet open/closed styles are present.
- JavaScript contains hash navigation, `history.replaceState`, theme persistence, project filtering, clipboard handling, and Escape-to-close behavior.

### Browser smoke checks

Direct hash navigation was opened and observed in the rendered browser for:

- `#home` — overview text, phone home widgets, launcher grid, and footer visible.
- `#about` — About sheet and desktop panel visible.
- `#projects` — phone project list, desktop project list, four filters, count, and five project entries visible.
- `#inventory` — project illustration, live demo, repository, and all-projects actions visible.
- `#contact` — email link, copy-email button, contact copy, and phone contact sheet visible.

### Remaining end-to-end gap

The source-level checks verify that filtering, clipboard, theme persistence, and keyboard handlers are wired, but the browser automation session did not complete a reliable click assertion for the offscreen filter/copy controls because the browser control references became stale after navigation. Before shipping a new implementation, run the manual matrix in Section 12 with the actual replica in a normal browser, especially:

1. Click each project filter and verify the card count and phone list.
2. Toggle light/dark mode, reload, and verify persistence.
3. Click `Copy email` and verify the live status message.
4. Open a phone sheet, press `Escape`, and verify focus returns to the opener.
