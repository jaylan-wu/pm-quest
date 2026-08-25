# Question image uploads

Place the externally supplied question images in this directory. The quiz
expects these exact, case-sensitive filenames:

```text
question-01.webp
question-02.webp
question-03.webp
question-04.webp
question-05.webp
question-06.webp
question-07.webp
question-08.webp
question-09.webp
question-10.webp
```

Use optimized WebP files with a consistent 16:9 landscape composition. A
resolution such as 1600 × 900 provides room for responsive cropping without
shipping unnecessarily large source files. Compress images for browser delivery
and confirm that important subjects remain visible when the frame uses
`object-fit: cover` at phone and desktop widths.

Each image's alternative text and optional crop position are configured on the
matching question in
`src/features/personality-test/data/questions.ts`. Update `alt` to describe the
actual uploaded image, or use an empty string only when the image is purely
decorative. Set `position` to a valid CSS `object-position` value when centered
cropping obscures important content.

No source import is required when a file is replaced without changing its
name. The application resolves this public directory through Vite's configured
base path. If a file is absent or fails to load, the quiz keeps its 16:9 image
slot and displays a styled placeholder so answering can continue normally.
