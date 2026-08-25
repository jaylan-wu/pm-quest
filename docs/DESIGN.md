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
