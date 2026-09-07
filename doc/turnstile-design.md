---
name: turnstile-design
description: Use this skill when implementing the Turnstile design system. This skill provides a dark, futuristic aesthetic with a primary color of teal. It includes typography based on the Inter and JetBrains Mono fonts, with specific sizes for display, body, and code elements, along with rounded corner definitions.
packages:
  - name: clsx
    purpose: Tiny utility for conditionally joining class names
    kind: dependency
    curated: true
  - name: tailwind-merge
    purpose: Merge Tailwind classes without style conflicts
    kind: dependency
    curated: true
  - name: class-variance-authority
    purpose: Type-safe component style variants (CVA)
    kind: dependency
    curated: true
  - name: react-tsparticles
    purpose: For creating futuristic, animated background effects like glowing particles or data streams.
    kind: dependency
    curated: false
  - name: lodash
    purpose: For utility functions for data manipulation, object handling, and array processing.
    kind: dependency
    curated: false
  - name: react-slick
    purpose: For implementing sleek, futuristic sliders or carousels if needed.
    kind: dependency
    curated: false
---
```yaml
brand: Turnstile
mood: A dark, futuristic terminal for secure cryptocurrency operations, blending high-tech aesthetics with clarity and precision.
scheme: dark
colors:
  primary: "#34d399"
  primary-bright: "#4CFEAF"
  primary-deep: "#059669"
  on-primary: "#030303"
  ink: "#fafafa"
  ink-soft: "#a1a1aa"
  on-ink: "#ffffff"
  canvas: "#030303"
  paper: "#09090b"
  cloud: "#27272a"
  hairline: "#27272a"
  hairline-strong: "#3f3f46"
  link: "#34d399"
  link-pressed: "#059669"
  success: "#34d399"
  error: "#f87171"
typography:
  display-xxl: { fontFamily: "Inter", fontSize: 80px, fontWeight: 600, lineHeight: 1.1 }
  display-xl: { fontFamily: "Inter", fontSize: 60px, fontWeight: 300, lineHeight: 1.1 }
  display-lg: { fontFamily: "Inter", fontSize: 48px, fontWeight: 600, lineHeight: 1.2 }
  display-md: { fontFamily: "Inter", fontSize: 36px, fontWeight: 600, lineHeight: 1.25 }
  body-lg: { fontFamily: "Inter", fontSize: 18px, fontWeight: 400, lineHeight: 1.6 }
  body-md: { fontFamily: "Inter", fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
  caption-md: { fontFamily: "Inter", fontSize: 12px, fontWeight: 500, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.5px" }
  code-md: { fontFamily: "JetBrains Mono", fontSize: 12px, fontWeight: 400, lineHeight: 1.5 }
  button-lg: { fontFamily: "Inter", fontSize: 16px, fontWeight: 500, lineHeight: 1 }
  button-md: { fontFamily: "Inter", fontSize: 14px, fontWeight: 400, lineHeight: 1 }
  link-md: { fontFamily: "Inter", fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 32px
  xxl: 40px
  pill: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
shadows:
  none: "none"
  card: "rgba(0, 0, 0, 0.55) 0px 18px 35px 0px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.12) 0px 1px 0px 0px inset"
  button-primary: "rgba(16, 185, 129, 0.55) 0px 15px 25px -10px, rgba(209, 250, 229, 0.85) 0px 4px 8px 0px inset, rgba(5, 150, 105, 0.9) 0px -4px 8px 0px inset"
  glow-focus: "rgba(52, 211, 153, 0.7) 0px 0px 14px 0px"
  glow-backdrop: "rgba(0, 0, 0, 0.8) 0px 40px 120px 0px"
motion:
  duration-fast: "200ms"
  duration-base: "1000ms"
  duration-slow: "2000ms"
  ease-standard: "cubic-bezier(0.4, 0, 0.2, 1)"
  ease-decelerate: "cubic-bezier(0, 0, 0.2, 1)"
  transition-default: "background-color, border-color, color, opacity {motion.duration-fast} {motion.ease-standard}"
  transition-transform: "transform {motion.duration-fast} {motion.ease-standard}"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    color: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.button-lg}"
    shadow: "{shadows.button-primary}"
    cursor: "pointer"
  button-primary-hover:
    backgroundColor: "{colors.primary-bright}"
    shadow: "{shadows.glow-focus}"
  button-secondary:
    backgroundColor: "transparent"
    color: "{colors.ink-soft}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
    typography: "{typography.button-md}"
    cursor: "pointer"
  button-secondary-hover:
    backgroundColor: "{colors.hairline}"
    color: "{colors.ink}"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    shadow: "{shadows.card}"
    border: "1px solid {colors.hairline}"
  link:
    color: "{colors.link}"
    typography: "{typography.link-md}"
    cursor: "pointer"
  link-hover:
    textDecoration: "underline"
  navigation-item:
    color: "{colors.ink-soft}"
    typography: "{typography.button-md}"
    padding: "{spacing.xs} {spacing.md}"
    cursor: "pointer"
  navigation-item-hover:
    color: "{colors.ink}"
  badge-live:
    backgroundColor: "{colors.success}"
    color: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "2px {spacing.xs}"
    typography: "{typography.caption-md}"
  badge-info:
    backgroundColor: "{colors.hairline}"
    color: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "2px {spacing.xs}"
    typography: "{typography.caption-md}"
```

## Visual Theme & Atmosphere

The Turnstile design system projects an atmosphere of a futuristic, high-security financial terminal. It is dark, precise, and professional, evoking the feeling of interacting with a critical piece of infrastructure. The aesthetic is clean and minimalist yet enriched with complex glows, shadows, and subtle gradients that suggest depth and advanced technology. The overall mood is serious and trustworthy, designed to give users confidence in the complex operations they are performing. It balances the starkness of a command-line interface with the polish and usability of a modern graphical UI, making data feel both important and accessible.

The visual language is built on a foundation of deep blacks and greys, punctuated by a vibrant, electric green that serves as the primary accent. This high-contrast palette ensures that calls to action and critical information are immediately visible. Typography is a key player, with a wide range of weights and sizes creating a clear hierarchy that guides the user's eye from high-level status displays down to granular data points. The generous use of negative space reinforces the feeling of control and prevents the dense information from feeling overwhelming.

**Key Characteristics:**

*   **Dark Mode Native:** The entire interface is built on a deep, near-black `{colors.canvas}`, creating a low-light environment that is easy on the eyes and emphasizes the content.
*   **Vibrant Accent:** A single, powerful accent color, `{colors.primary}`, is used with extreme prejudice for primary CTAs and vital status indicators, ensuring they command attention.
*   **Data-Centric Typography:** A clear distinction is made between the humanist "Inter" font for readable prose and the monospaced "JetBrains Mono" (`{typography.code-md}`) for numerical and technical data, enhancing clarity and reinforcing the terminal aesthetic.
*   **Floating Interfaces:** Content is organized into cards (`{components.card}`) that appear to float above the background, achieved through the complex `{shadows.card}` which includes both a diffuse shadow and subtle edge lighting.
*   **Luminous Effects:** The system uses glows, like `{shadows.button-primary}` on the main CTA and `{shadows.glow-focus}` for interactive states, to create a sense of energy and responsiveness.
*   **Structured Spacing:** A disciplined spacing rhythm based on a 4px grid (`{spacing.xxs}`) governs all layout, from component padding to large-scale section dividers (`{spacing.section}`), creating a harmonious and predictable structure.
*   **Minimalist Forms:** UI controls are stripped to their essential elements. Secondary buttons (`{components.button-secondary}`) are defined by a simple outline against a transparent background, prioritizing content over chrome.

## Color Usage Rules

The Turnstile color palette is intentionally minimal to maintain clarity and focus. An agent should almost exclusively compose interfaces using a core set of six tokens. This restraint is a feature, not a limitation, as it forces design decisions to be deliberate and impactful.

The core palette consists of:
*   Surfaces: `{colors.canvas}` (base), `{colors.paper}` (elevated), `{colors.cloud}` (interactive fill)
*   Content: `{colors.ink}` (primary text), `{colors.ink-soft}` (secondary text)
*   Accent: `{colors.primary}` (CTAs, status)

**Usage Rules:**

*   **Rule 1: Never Introduce New Colors.** Every color used in a design must map directly to an existing token in the `colors` group. If a suitable color does not exist, the design must be reconsidered to use the existing palette. Reuse is paramount.
*   **Rule 2: Restrict Primary Color Usage.** The primary accent, `{colors.primary}`, is the most powerful tool in the palette and must be used sparingly. It is reserved for the single most important call-to-action on a screen (e.g., `{components.button-primary}`) and for critical, positive status indicators (e.g., `{components.badge-live}`). There should never be more than one or two instances of `{colors.primary}` visible in a single viewport.
*   **Rule 3: Build Surfaces from the Ground Up.** The absolute background of any page is always `{colors.canvas}`. Any contained, floating, or distinct UI surface (like a modal or a card) must use `{colors.paper}` for its background. `{colors.cloud}` is reserved for the background of interactive elements on hover or in an active state, such as a secondary button fill.
*   **Rule 4: Adhere to Text Color Hierarchy.** All primary headings and body copy must use `{colors.ink}` for maximum readability. Any secondary information, such as descriptive subtext, placeholder text, disabled-state text, or metadata labels, must use `{colors.ink-soft}`. Text on a `{colors.primary}` surface must use `{colors.on-primary}`.
*   **Rule 5: Use Functional Colors for Their Intent.** `{colors.success}` (which is the same as `{colors.primary}`) is for positive confirmation and "live" states. `{colors.error}` is exclusively for error messages, validation failures, or destructive action confirmations. Do not use these colors decoratively.
*   **Rule 6: Define Borders with Hairlines.** All borders and dividers should use `{colors.hairline}` for a subtle, clean separation. For a slightly more emphasized border, `{colors.hairline-strong}` can be used, but this should be rare.
*   **Rule 7: Drive Emphasis with Elevation and Glow, Not Color.** Since the chromatic palette is so limited, emphasis and hierarchy are primarily achieved through typography and elevation. Use `{shadows.card}` to lift a component off the `{colors.canvas}` and `{shadows.glow-focus}` to draw attention to an interactive element. Do not invent new colors to try and make an element "pop".

## Typography Hierarchy

The typographic system in Turnstile is built on two primary font families to create a clear distinction between human-readable content and machine-readable data. The heading font is **Inter**, and the body font is also **Inter**. For all technical data, such as hashes, monetary values, and scanner output, the monospace font **JetBrains Mono** must be used. This separation is non-negotiable and fundamental to the brand's identity.

The hierarchy is defined by a scale of roles, each with specific properties for size, weight, and line height. Adhering to this scale ensures visual consistency and guides the user's attention effectively through the interface.

| Role            | Token             | Use                                                                                             |
| --------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| Display XXL     | `display-xxl`     | For the primary word in a main page hero headline (e.g., "Turnstile"). Use sparingly.           |
| Display XL      | `display-xl`      | For the secondary word or line in a main page hero headline (e.g., "Terminal").                  |
| Display Large   | `display-lg`      | For major section titles that introduce a key concept on the page.                              |
| Display Medium  | `display-md`      | For sub-section titles or large, impactful statements within a content block.                   |
| Body Large      | `body-lg`         | For introductory paragraphs or important descriptive text directly following a headline.        |
| Body Medium     | `body-md`         | The default size for all standard paragraph text. This should be the most common text style.    |
| Caption Medium  | `caption-md`      | For metadata labels, form field labels, and small annotations. Always uppercase.                |
| Code Medium     | `code-md`         | For all numerical data, currency amounts, transaction IDs, block numbers, and code snippets.    |
| Button Large    | `button-lg`       | Exclusively for the label of the primary call-to-action button (`{components.button-primary}`). |
| Button Medium   | `button-md`       | For all secondary buttons and navigation items.                                                 |
| Link Medium     | `link-md`         | For all standalone and inline text links.                                                       |

**Typographic Principles:**

1.  **Hierarchy Through Contrast:** The system relies on significant size and weight differences between roles. A `{typography.display-lg}` heading should feel monumental compared to the `{typography.body-md}` text that follows it.
2.  **Weight for Emphasis:** Within the same font size, `fontWeight` is used to differentiate. `{typography.caption-md}` uses a heavier weight (`500`) than `{typography.body-md}` (`400`) to give labels prominence despite their small size.
3.  **Readability is Key:** Line heights for body copy (`{typography.body-lg}` and `{typography.body-md}`) are generous (`1.6` and `1.5`, respectively) to ensure long-form text is easy to read on the dark background.
4.  **Purposeful Font Choice:** The switch to `{typography.code-md}` for data is a deliberate signal to the user that they are viewing raw, precise information. This convention must be strictly followed.
5.  **Controlled Letter Spacing:** Letter spacing is used sparingly, primarily in `{typography.caption-md}` in conjunction with its `textTransform: "uppercase"` style to improve the legibility and aesthetic of all-caps labels.

## Component Patterns

Components are the reusable building blocks of the Turnstile UI. They are composed using the design tokens to ensure consistency in style and behavior. Every interactive component must have a defined hover state and use `cursor: pointer`.

**Primary Button (`button-primary`)**
This button is reserved for the single most important action on a page. It uses the vibrant `{colors.primary}` background and is styled with `{typography.button-lg}`. Its most distinct feature is the complex `{shadows.button-primary}`, which combines a soft green glow with sharp inset highlights, making it feel energized and three-dimensional. On hover, the background brightens to `{colors.primary-bright}` and the glow intensifies by applying `{shadows.glow-focus}`. The shape is always a `{rounded.pill}`. All state changes transition over `{motion.duration-fast}` using `{motion.ease-standard}`. The cursor must be `pointer`.

**Secondary Button (`button-secondary`)**
Used for all other actions, this button has a subtle, "ghost" appearance. In its default state, it is transparent with a `{colors.hairline}` border and `{colors.ink-soft}` text. This ensures it doesn't compete with the primary button. Upon hover, the component comes to life: its background fills with `{colors.cloud}` and the text color becomes `{colors.ink}`. This interaction provides clear feedback without being distracting. It uses `{typography.button-md}` and a `{rounded.pill}` shape. The transition for color and background is `{motion.transition-default}`. The cursor must be `pointer`.

**Card (`card`)**
The `card` is the primary surface for grouping related content. It floats above the `{colors.canvas}` background by using `{colors.paper}` for its surface and applying the pronounced `{shadows.card}`. This shadow is complex, featuring both a diffuse drop shadow for depth and an inset `1px` highlight to simulate a light source catching the edge. Cards use a `{rounded.lg}` border radius and always have a subtle `1px solid {colors.hairline}` border. Padding is generous, consistently using `{spacing.xl}` to give content room to breathe.

**Link (`link`)**
Links are used for inline navigation or secondary actions that don't warrant a button. They use `{colors.link}` and the `{typography.link-md}` style. They do not have an underline by default, but gain a `text-decoration: underline` on hover to provide clear affordance. When pressed, the color should shift to `{colors.link-pressed}`. The color change transitions over `{motion.duration-fast}`. The cursor must be `pointer`.

**Navigation Item (`navigation-item`)**
Used in the main site header, navigation items are text-based links for top-level pages. They use `{typography.button-md}` and have a default color of `{colors.ink-soft}` to blend with the background. On hover, the color transitions to `{colors.ink}`, making the active item clear. Padding of `{spacing.xs} {spacing.md}` ensures an adequate touch target. The cursor must be `pointer`.

**Badge**
Badges are small status descriptors. The `badge-live` component uses a `{colors.success}` background with `{colors.on-primary}` text to indicate a live, active, or positive state. The `badge-info` component uses a more muted `{colors.hairline}` background with `{colors.ink-soft}` text for categorical information, like the "Orchard" tag. Both use `{typography.caption-md}` and have padding of `2px {spacing.xs}`. `badge-live` uses `{rounded.pill}` while `badge-info` uses `{rounded.sm}`.

## Layout & Spacing

The layout of Turnstile is governed by a strict spacing scale and a clear philosophy of structured, breathable design. All dimensions—padding, margins, and gaps between elements—must conform to the established `{spacing.*}` tokens. This creates a consistent rhythm and visual harmony throughout the application.

The core of the spacing system is a **4px grid unit**, represented by `{spacing.xxs}`. All other spacing tokens are multiples of this unit, ensuring a predictable and scalable system.

*   **Rhythm & Flow:** The vertical rhythm is paramount. Large sections of content are separated by `{spacing.section}` (96px) to create distinct zones and guide the user down the page. Within these sections, smaller content blocks are separated by `{spacing.xxl}` (48px). This generous use of negative space is critical for reducing cognitive load when presenting complex information.
*   **Grid System:** While the main page flow is a single, centered column with a maximum width of approximately 1280px, internal layouts often use grids. For example, the key-value statistics in the hero section are laid out in a grid with a gap of `{spacing.xl}` (32px). When creating multi-column layouts, the gap between columns should be `{spacing.lg}` or `{spacing.xl}`.
*   **Component Padding:** Internal spacing within components is just as important. `{components.card}` elements use a generous `{spacing.xl}` padding to frame their content. Buttons have horizontal padding that is double their vertical padding (e.g., `{spacing.sm} {spacing.lg}` for `{components.button-primary}`), creating a pleasant, wide aspect ratio.
*   **Stacking Philosophy:** The visual hierarchy is built on layers. The base is the `{colors.canvas}` background. On top of this sit `{components.card}` elements, which are visually lifted by `{shadows.card}`. The content within these cards is then laid out according to the spacing scale. This creates a clear z-axis hierarchy that is easy for users to parse. Large background glow effects like `{shadows.glow-backdrop}` sit behind everything to add atmospheric depth without cluttering the UI.

## Do's and Don'ts

**Do's:**
1.  **Do** compose all surfaces from `{colors.canvas}` and `{colors.paper}`, and all text from `{colors.ink}` and `{colors.ink-soft}`. The core palette is sufficient.
2.  **Do** assign fonts based on their role: "Inter" for all prose and labels, and "JetBrains Mono" (`{typography.code-md}`) for all numerical or technical data.
3.  **Do** use `{components.button-primary}` for the single most important action on a screen and nothing else. Its visual weight is a tool for guiding the user.
4.  **Do** apply elevation and depth consistently using the `{shadows.card}` token for floating panels.
5.  **Do** build all layouts using the `{spacing.*}` token scale. Padding, margins, and gaps must conform to this rhythm.
6.  **Do** ensure every single clickable element, from buttons to links to navigation items, explicitly sets `cursor: pointer`.
7.  **Do** use `{typography.caption-md}` with its uppercase style for all data labels to create a clear, consistent "terminal" feel.
8.  **Do** employ generous whitespace, using `{spacing.section}` to create clear divisions between major parts of the user flow.

**Don'ts:**
1.  **Don't** ever introduce a color that is not a pre-defined token. If the color you need doesn't exist, rethink the design.
2.  **Don't** ever add a box-shadow unless it maps to a real `{shadows.*}` token. The system's depth is deliberate; do not add arbitrary elevation.
3.  **Don't** use `{colors.primary}` for anything other than a primary CTA or a critical "success" status. Overuse will dilute its impact.
4.  **Don't** leave the browser-default arrow cursor on any interactive element. All clickable items must signal their interactivity.
5.  **Don't** use arbitrary pixel values for spacing or sizing. All dimensions must snap to the `{spacing.*}` or `{rounded.*}` scales.
6.  **Don't** use the "Inter" font for displaying wallet addresses, block numbers, or currency amounts. This data must use `{typography.code-md}`.
7.  **Don't** create more than one `{components.button-primary}` per viewport. If there are multiple actions, choose one primary and make the others `{components.button-secondary}`.
8.  **Don't** crowd elements. If a layout feels tight, add more space using `{spacing.lg}`, `{spacing.xl}`, or `{spacing.xxl}`.

## Responsive Behavior

The Turnstile interface is designed to be fully responsive, adapting its layout to provide an optimal experience across a range of screen sizes. The core aesthetic and component styles remain consistent, while the overall structure reflows as needed.

| Breakpoint      | Viewport Width  | Behavior                                                                                                                                                                                            |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile          | < 480px         | Single-column layout. Main navigation (`{components.navigation-item}`) collapses into a hamburger menu. Hero typography (`{typography.display-xxl}`) scales down significantly. Gutters are reduced.   |
| Mobile-Large    | 480px – 767px   | Primarily single-column, but some simple two-column grids may appear. Font sizes increase slightly from mobile. The hero card and its content may begin to sit side-by-side.                       |
| Tablet          | 768px – 1023px  | Wider two-column layouts become common for content. Typography approaches desktop sizes. Main navigation may still be collapsed. Spacing between sections increases.                                |
| Desktop         | 1024px – 1279px | The full desktop experience. The main navigation is fully visible. Complex multi-column grids are used. Maximum content width is enforced to maintain readability.                                  |
| Desktop-Large   | ≥ 1280px        | The layout remains consistent with the desktop view, but margins around the main content container increase, further centering the interface on the large `{colors.canvas}` background.           |

**Touch Targets:**
On touch-enabled devices (typically Mobile and Tablet), all interactive elements must have a minimum tap area of 44x44px. This is achieved through adequate padding. For example, `{components.button-secondary}` with its `{spacing.xs} {spacing.md}` padding meets this requirement. Icon-only buttons must have their visible area plus padding meet this minimum size.

**Collapsing Strategy:**
*   **Navigation:** The primary horizontal navigation bar collapses into a hamburger icon on the top-right for Mobile and Tablet views. The revealed menu is a vertical list of links presented in a full-screen or partial overlay.
*   **Hero Section:** On Mobile, the hero's primary content (the floating card) will stack vertically above the statistics. The large `{typography.display-xxl}` headline will shrink and may wrap to two lines.
*   **Grids:** Any grid with more than two columns on Desktop will collapse. A three-column grid may become a two-column grid on Tablet and a single-column stack on Mobile.
*   **Footer:** The multi-column footer layout on Desktop will collapse into a single stacked list of links on Mobile.

## Iteration Guide

When building or iterating on UI for Turnstile, follow these steps to ensure the output aligns perfectly with the brand's design system.

1.  **Establish the Foundation:** Begin every new screen with a `{colors.canvas}` background. All primary content should be contained within a centered column with ample breathing room on the sides.
2.  **Structure with Sections and Cards:** Organize the page into logical blocks separated by `{spacing.section}`. Encapsulate related groups of content and controls within a `{components.card}`, which provides the standard `{colors.paper}` background, `{rounded.lg}` corners, and `{shadows.card}` elevation.
3.  **Apply the Typographic Hierarchy:** Populate the cards and sections with content, applying the typography tokens with strict discipline. Use `{typography.display-lg}` or `{typography.display-md}` for titles, `{typography.body-md}` for text, and `{typography.caption-md}` for labels. Crucially, any numerical or technical string must be styled with `{typography.code-md}`.
4.  **Identify the Primary Action:** For each view, determine the single most critical action the user should take. Implement this as a `{components.button-primary}`. Its unique styling with `{colors.primary}` and `{shadows.button-primary}` will naturally draw the user's attention.
5.  **Implement Secondary Actions:** All other actions must be implemented as either `{components.button-secondary}` (for standalone actions) or `{components.link}` (for inline or less prominent actions). This maintains the visual hierarchy and keeps the UI clean.
6.  **Use the Spacing Scale:** Meticulously apply the `{spacing.*}` tokens for all padding, margins, and gaps. Do not use custom values. Use `{spacing.xl}` for internal card padding and `{spacing.lg}` or `{spacing.xl}` for gaps in grids.
7.  **Add State and Feedback:** Ensure all interactive elements have a clear hover and/or active state, following the patterns in the `components` block (e.g., a secondary button filling with `{colors.cloud}` on hover). All state changes should be animated using `{motion.transition-default}`.
8.  **Incorporate Status Indicators:** Use `{components.badge-live}` to communicate positive statuses like "Live" or "Nominal". Use `{colors.error}` text for any error messages.
9.  **Set Cursors Correctly:** Manually verify that every single button, link, or otherwise clickable element has `cursor: pointer` applied. Text input fields should use `cursor: text`.
10. **Final Polish and Review:** Conduct a final review to ensure perfect alignment with the system. Check that all colors map to tokens, all spacing is from the scale, all fonts are used correctly, and every interactive element has proper feedback and cursor. No default browser styles should be visible.

## Suggested Packages

Packages that help implement this skill well. Install them with your package manager (examples use pnpm).

- **clsx** — Tiny utility for conditionally joining class names. `pnpm add clsx`
- **tailwind-merge** — Merge Tailwind classes without style conflicts. `pnpm add tailwind-merge`
- **class-variance-authority** — Type-safe component style variants (CVA). `pnpm add class-variance-authority`

Also worth considering (verify before installing):

- **react-tsparticles** — For creating futuristic, animated background effects like glowing particles or data streams.. `pnpm add react-tsparticles`
- **lodash** — For utility functions for data manipulation, object handling, and array processing.. `pnpm add lodash`
- **react-slick** — For implementing sleek, futuristic sliders or carousels if needed.. `pnpm add react-slick`
