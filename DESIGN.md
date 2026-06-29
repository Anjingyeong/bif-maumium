# maumium Design System

## 1. Atmosphere & Identity

maumium feels calm, careful, and practical. It should read like a supportive guide after a self-check, not like a diagnosis screen. The signature is warm clinical clarity: soft green guidance, quiet surfaces, and Korean copy that points to the next helpful action.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --background | #FBFAF7 | #0F1412 | Page background |
| Surface/card | --card | #FFFFFF | #151B18 | Cards and panels |
| Surface/secondary | --secondary | #F0F3EE | #202821 | Soft section fills |
| Text/primary | --foreground | #24312B | #F5F7F4 | Main text |
| Text/secondary | --muted-foreground | #66736B | #AEB8B0 | Descriptions and helper text |
| Border/default | --border | #E1E6DF | #2D372F | Card and panel borders |
| Accent/primary | --primary | #2F7D5C | #6EBE95 | Main actions and guidance accents |
| Accent/soft | --primary-soft | #EAF5EF | #183427 | Supportive highlight backgrounds |
| Status/warning | --warning | #D97706 | #F4B65F | Careful attention states |
| Status/error | --destructive | #DC2626 | #F87171 | Errors only |

### Rules
- Green is for guidance and forward action, not for decoration.
- Warning and error colors are used sparingly so the result does not feel punitive.
- No additional accent hue unless it represents a new semantic status.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | 28px / 1.75rem | 700 | 1.3 | 0 | Page-level result headings |
| H2 | 22px / 1.375rem | 700 | 1.35 | 0 | Section headings |
| H3 | 16px / 1rem | 600 | 1.5 | 0 | Card headings |
| Body | 15px / 0.9375rem | 400 | 1.7 | 0 | Guidance copy |
| Body/sm | 13px / 0.8125rem | 400 | 1.6 | 0 | Helper text |
| Caption | 12px / 0.75rem | 500 | 1.45 | 0 | Labels and metadata |

### Font Stack
- Primary: Pretendard, Noto Sans KR, system-ui, sans-serif
- Serif: Noto Serif KR, serif

### Rules
- Korean body copy should use short sentences and natural line breaks.
- Numbers are secondary; avoid display-scale numeric emphasis on result pages.

## 4. Spacing & Layout

### Base Unit
All spacing derives from 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-2 | 8px | Inline icon and label gaps |
| --space-3 | 12px | Compact card inner gaps |
| --space-4 | 16px | Form and list spacing |
| --space-5 | 20px | Small panel padding |
| --space-6 | 24px | Default card padding |
| --space-8 | 32px | Section separation |
| --space-12 | 48px | Page-level rhythm |

### Grid
- Max content width: 768px for result reading surfaces.
- Breakpoints: sm 640px, md 768px, lg 1024px.

### Rules
- Results should scan vertically on mobile with no horizontal overflow.
- Repeated cards use compact but breathable spacing.

## 5. Components

### Guidance Card
- **Structure**: icon, short heading, one paragraph or list.
- **Variants**: neutral, primary-soft, warning-soft.
- **Spacing**: --space-5 to --space-6.
- **States**: no hover unless clickable.
- **Accessibility**: headings describe the guidance topic.
- **Motion**: page entry may fade/translate with existing Framer Motion patterns.

### Support Strategy List
- **Structure**: section heading, category label, 3-5 action bullets.
- **Variants**: adult and child copy.
- **Spacing**: --space-3 between bullets, --space-5 between categories.
- **Accessibility**: list semantics, no color-only meaning.
- **Motion**: none required.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Button press |
| Standard | 200-300ms | ease-in-out | Hover and panel transitions |
| Emphasis | 400-600ms | cubic-bezier(0.16, 1, 0.3, 1) | Existing page entry motion |

### Rules
- Animate transform and opacity only.
- Respect existing focus-visible rings and disabled states.

## 7. Depth & Surface

### Strategy
Mixed, with low-opacity borders and soft shadows already established by the app.

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | border: 1px solid var(--border) | Reading cards |
| Default | shadow-sm with low opacity | Primary cards |
| Soft highlight | background: var(--primary-soft) | Guidance emphasis |

