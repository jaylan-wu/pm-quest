# Design

## Color system

The interface uses a lavender and purple visual system. Raw palette values are
defined once in `src/styles/tokens.css` and exposed to components through
semantic color tokens.

| Color | Role |
| --- | --- |
| `#9667E0` — Primary Purple | Major interactive emphasis, headings, progress, stat fills, and focus states |
| `#D4BBFC` — Mauve | Strong borders and soft supporting accents |
| `#EBD9FC` — Lavender Veil | Subtle borders, hover surfaces, and unfilled tracks |
| `#F2EBFB` — Lavender Mist | Large supporting surfaces and default choice backgrounds |
| `#FBFAFF` — Ghost White | Base page and light control backgrounds |

The semantic foundation distinguishes page backgrounds, normal and raised
surfaces, borders, primary interactions, and readable text. The approved
derived `#8454D1` is used where a darker purple is necessary for normal-size
text contrast. Dark neutral text is preferred on pastel surfaces, and Primary
Purple is used for large text or non-text visual emphasis when its contrast is
not sufficient for smaller copy.

### Dark mode

The interface follows `prefers-color-scheme` and switches semantic color tokens
without changing component markup. Dark mode retains the purple identity while
moving the page and card hierarchy onto deep aubergine surfaces.

| Color | Dark-mode role |
| --- | --- |
| `#100A18` | Page background |
| `#1A1126` | Supporting surfaces and answer choices |
| `#221631` | Raised cards and controls |
| `#322047` | Emphasized and disabled surfaces |
| `#B88CFF` | Primary purple emphasis, progress, and large headings |
| `#C7A4FF` | Interactive fills and interface-label emphasis |
| `#F7F2FC` | Primary text |
| `#C3B6CE` | Secondary text |

Filled purple controls use deep aubergine text in dark mode so buttons and
selected answers retain strong contrast. Focus rings use a lighter lavender,
and shadows shift from purple haze to translucent black to preserve surface
depth without muddying the palette. Browser chrome receives matching light and
dark theme colors from `index.html`.

## Typography

**Primary Typeface: Saira**

Saira is the application's primary typeface. It gives the interface a
game-inspired character while remaining readable for quiz scenarios, answer
choices, and result descriptions. The fallback stack uses system sans-serif
fonts when Saira is unavailable.

The application loads only these weights:

| Weight | Name | Use |
| --- | --- | --- |
| 400 | Regular | Scenario text, descriptions, result copy, and other body text |
| 500 | Medium | Answer choices and similarly concise readable content |
| 600 | SemiBold | Buttons, question counters, progress labels, section headings, stat names, and short interface labels |
| 700 | Bold | Landing and quiz display headings, gamer-class names, and result-page headings |

### Display headings

Major headings use Bold, with a small amount of negative letter spacing to
create a compact character-selection-screen hierarchy. SemiBold may be used
for secondary headings. Display treatments must remain legible at mobile sizes.

### Interface labels

Short labels may use uppercase SemiBold text with restrained positive letter
spacing. This treatment is appropriate for counters, progress labels, stat
names, and result-section labels. It should not be applied to paragraphs,
descriptions, or answer choices.

### Body, question, and answer text

Long-form content uses Regular, while answer choices may use Medium. Body and
question content uses a comfortable `1.45` line height without condensed
treatment or decorative letter spacing.

### Result screen

The result eyebrow and section labels use the compact uppercase interface-label
treatment. The resulting gamer-class name uses a large Bold display style,
while its description remains Regular. Character-stat names and values use
SemiBold; uppercase tracking is limited to the short stat-name labels.

The participant's result remains the visual priority. The restart action and
secondary link to the gamer-types directory may sit together at wider widths
and stack on phones.

## Responsive layout

Mobile is the default presentation. At common phone widths, quiz content and
gamer-type cards use one column, answer choices and actions can use the full
available width, and page padding remains comfortable without shrinking text
to avoid scrolling. Vertical scrolling is preferable to fixed-height cards or
clipped content.

At `48rem`, layouts progressively gain the established tablet and desktop
spacing. At `64rem`, content that benefits from additional width, especially
the gamer-types directory, may use a wider multi-column grid. The quiz, result,
and landing surfaces retain their existing centered desktop proportions and
visual identity.

On short landscape phone viewports, the question image and prompt share a row
so the question remains visible without changing the image's 16:9 frame. The
choices continue below in one full-width column.

Page-level spacing accounts for `env(safe-area-inset-top)`,
`env(safe-area-inset-right)`, `env(safe-area-inset-bottom)`, and
`env(safe-area-inset-left)` where content approaches a screen edge. Dynamic
viewport units such as `dvh` may establish a minimum screen-height canvas, but
must not force long questions into one viewport.

Interactive answer choices and actions maintain touch targets of at least 44
CSS pixels. Hover, focus, pressed, disabled, and selected states remain
distinct; important state is not communicated through color alone. Transitions
use shared motion tokens and are minimized under
`prefers-reduced-motion: reduce`.

## Question imagery

Each question reserves a consistent 16:9 landscape slot. Images fill that slot
with `object-fit: cover`, preserve the existing border and game-interface
treatment, and never stretch or overflow horizontally. An authored
`object-position` may adjust cropping for an individual image. The reserved
aspect ratio prevents layout shift, while a styled, non-blocking placeholder
preserves the question flow when an image has not yet been uploaded or fails to
load.

Upload optimized WebP files to `public/assets/questions/` using the filename
contract in that directory's `README.md`. Alternative text and optional crop
position live with the corresponding question in
`src/features/personality-test/data/questions.ts` so they can be reviewed
against the actual supplied image.

## Gamer-types directory

The directory uses the same surface, typography, stats, and interface-label
treatments as the individual result. Cards form a single column on phones and
progress to a responsive grid at wider breakpoints. When current in-memory
result data is available, its card includes a visible `Your type` label and a
coordinated border treatment so the distinction does not depend on color alone.
