---
name: frontend-page-rules
description: Rules and conventions to follow whenever building or editing frontend pages/components in a React project — covers file/folder structure (one component or page per file, no monolithic files), visual design consistency (spacing, typography, color), and accessibility/responsiveness. If a design.md file exists alongside this skill, it defines the project's actual theme (typography, colors, tokens) and must be read and followed. Use this whenever generating new pages, splitting up existing components, or reviewing frontend code for structure and design quality.
---

# Frontend Page Rules

These are standing rules for building frontend pages in a React project. They apply whether you're scaffolding a new page, adding a feature to an existing one, or refactoring.

## 1. File & Folder Structure

**Never pack multiple pages or unrelated components into one file.** Each page gets its own file, and each non-trivial component gets its own file too.

Default layout:
```
src/
├── pages/          # one file per route/page (e.g. LoginPage.jsx, DashboardPage.jsx)
├── components/      # reusable UI pieces, one per file
│   └── ui/          # small generic building blocks (Button.jsx, Input.jsx, Card.jsx)
├── hooks/           # custom hooks (useAuth.js, useFetch.js)
├── utils/           # pure helper functions, grouped by concern (formatDate.js, validators.js)
├── lib/ or api/      # API/data-fetching logic, separate from UI
└── styles/           # shared design tokens if not using a utility framework
```

Rules of thumb for splitting:
- If a page file is doing layout AND business logic AND API calls, pull the logic and API calls out into hooks/`lib` files.
- A "complicated function" — anything with non-trivial branching, more than ~20-30 lines, or logic reused in more than one place — goes in its own file under `utils/` or `hooks/`, not inline in the component.
- A component gets split out of its parent page as soon as it's reused, or once it starts managing its own state/logic distinct from the page's.
- Name files after what they export (`UserCard.jsx` exports `UserCard`), so the file tree itself is navigable without opening files.
- Keep one default export per file for pages/components; avoid dumping several unrelated components in a single file "for convenience."

## 2. Visual & Design Consistency

**Check for a `design.md` file in this skill's folder first.** If present, it defines this project's actual theme — typography, color palette, and any other tokens — and takes priority over the generic guidance below. Read it before styling any page and use its tokens rather than inventing new ones. If `design.md` doesn't exist yet, fall back to the defaults below.

Establish a small set of design tokens up front and reuse them everywhere — don't let each page invent its own spacing, colors, or type sizes.

- **Spacing**: pick a scale (e.g. 4/8/12/16/24/32/48/64px) and only use values from it. If using Tailwind, stick to the default spacing scale rather than arbitrary values.
- **Typography**: one or two type families max, with a defined scale (e.g. sizes for h1–h3, body, caption). Don't mix ad-hoc font sizes across pages.
- **Color**: define a palette (4-6 core colors: background, surface, text, primary/accent, border, error/success) as tokens/CSS variables, and reference those tokens instead of hardcoding hex values inline.
- **Components over duplication**: if the same visual pattern (button style, card, form field) appears on more than one page, it's a shared component — not copy-pasted markup.
- Avoid generic/templated defaults unless they genuinely fit the product: the cream-background-serif-terracotta-accent look, identical rounded cards with the same soft shadow on everything, ALL-CAPS tracked-out eyebrow labels, and arrows appended to every button/link. Make deliberate choices about palette and type suited to what the page is actually for, rather than reaching for the same "safe" template every time.
- Keep one clear visual hierarchy per page — one element carries the most visual weight; the rest stays quiet and disciplined.

## 3. Accessibility & Responsiveness

- Use semantic HTML first (`<button>`, `<nav>`, `<main>`, `<label>`, headings in order) before reaching for generic `<div>`s with click handlers.
- Every interactive element must be keyboard-reachable and show a visible focus state — never remove `outline` without providing a replacement focus style.
- Form inputs always have an associated `<label>` (or `aria-label` where a visible label isn't appropriate).
- Maintain sufficient color contrast for text against its background (roughly WCAG AA — 4.5:1 for body text).
- Build mobile-first or at minimum verify every page down to a small mobile viewport (~375px wide) — no fixed-width layouts that break on narrow screens.
- Respect `prefers-reduced-motion` for any non-trivial animation.
- Images and icons that convey meaning get `alt` text; purely decorative ones get `alt=""`.

## 4. Before finishing a page

Quick self-check before considering a page done:
- [ ] Is this page in its own file under `pages/`, with logic/API calls pulled into `hooks/`/`utils/`/`lib/` rather than inlined?
- [ ] Are spacing, type, and color values coming from the shared tokens/scale, not one-off values?
- [ ] Does it work and look reasonable at mobile width?
- [ ] Can I tab through every interactive element and see where focus is?
- [ ] Any component used more than once — is it actually a shared component now?
