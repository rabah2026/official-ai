# Official.ai — Design System Reference

> **Version:** 1.0 (February 2026)  
> **Status:** Active · All future design changes must follow this guide.

---

## Brand Identity

**Official.ai** is a precision intelligence terminal — not a news blog. The visual language conveys:
- **Accuracy** — clean, structured, editorial
- **Credibility** — restrained, professional, trustworthy  
- **Signal over noise** — purposeful white space, no clutter

---

## Color Palette

All colors are defined as CSS variables in `src/app/globals.css` inside the `@theme` block.

### Light Mode (Warm Cream Editorial)
| Token | Value | Use |
|---|---|---|
| `--color-background` | `#f5f2ee` | Page background — warm cream, not white |
| `--color-surface` | `#fdfcfb` | Cards, panels |
| `--color-surface-hover` | `#ede9e3` | Hover states |
| `--color-border` | `#e0dbd3` | All borders |
| `--color-foreground` | `#1a1612` | Primary text |
| `--color-muted` | `#6b6560` | Secondary text |
| `--color-muted-foreground` | `#9e958c` | Tertiary / placeholder |
| `--color-primary` | `#0077b6` | Links, CTAs, interactive |
| `--color-accent` | `#0096c7` | Highlights |

> ⚠️ **Never use pure white `#ffffff` as a page background in light mode. Use `--color-background` (#f5f2ee).**

### Dark Mode
Defined in `.dark {}` block. Do NOT modify dark mode colors without team review — the dark mode is production-quality.

### Company Accent Colors
Defined in `src/lib/companyAccents.ts` — the **single source of truth**.  
Used in: article reader sidebar, homepage per-lab row, company cards.

```ts
'OpenAI'          → #10a37f  (green)
'Anthropic'       → #c96442  (terracotta)
'Google / Gemini' → #4285F4  (blue)
'Meta AI'         → #0866FF  (Meta blue)
'NVIDIA'          → #76B900  (green)
'Hugging Face'    → #FFB800  (amber)
'Mistral AI'      → #F54E42  (red)
'X.AI'            → #a3a3a3  (gray)
'Stability AI'    → #8B5CF6  (purple)
'Amazon'          → #FF9900  (orange)
'Apple'           → #555555  (gray)
```

---

## Typography System

All fonts are loaded via Google Fonts in `layout.tsx`.

| Role | Font | Variable | Usage |
|---|---|---|---|
| Display / UI | Inter | `--font-display` | All headings, UI labels |
| Body text | Lora (serif) | `--font-serif` | Article body paragraphs |
| Mono / Meta | JetBrains Mono | `--font-mono` | Dates, badges, code, labels |

### Type Scale
- **Hero title**: `clamp(2.5rem, 6vw, 4.5rem)`, weight 700, tracking -0.03em
- **Article display title**: `clamp(2rem, 5vw, 3.5rem)`, weight 700, class `.article-display-title`
- **Section h2**: `1.5rem`, weight 700
- **Card title**: `1rem`, weight 600
- **Meta / label**: `0.625rem–0.75rem`, font-mono, uppercase, tracking-widest
- **Body**: `1.0625rem`, Lora, line-height 1.85 (applied via `.article-serif`)

---

## Card Anatomy

There is **one canonical card design** used throughout the site. All card variants follow this structure:

```
┌─────────────────────────────────────────┐
│  [Optional thumbnail — aspect-video]    │
├─────────────────────────────────────────┤
│  [TAG PILL]                  [date mono]│
│                                         │
│  Article Title — Bold, 1-2 lines        │
│                                         │
│  Summary — 2 lines max, muted           │
├─────────────────────────────────────────┤
│  LAB NAME             Read →            │
└─────────────────────────────────────────┘
```

**Components:**
- `UpdateCard.tsx` — compact row (no image)
- `FeaturedCard.tsx` — full card with image
- `GroupedUpdateCard.tsx` — collapsed multi-item (same tokens)

> ⚠️ **Do NOT create new card designs. Extend existing ones.**

---

## Tag Pills

Tag pills use `.category-label` + tag-specific modifier class (defined in globals.css).  
Available tags: `Release`, `News`, `Research`, `Engineering`, `Case Study`, `Corporate`, `Pricing`, `Policy`, `Security`, `Docs`

---

## Spacing & Layout

| Token | Value |
|---|---|
| Container max-width | `1280px` via `.container-max` |
| Section padding | `py-16` (4rem) desktop, `py-10` mobile |
| Card gap (featured grid) | `1.5rem` |
| Card border-radius | `1rem` (`rounded-2xl`) |
| Sidebar width (article) | `300px` |

---

## Component Patterns

### Reading Progress Bar
Client component at top of all article pages. Color = company accent color.  
File: `src/components/ReadingProgress.tsx`

### Article Reader Layout
Two-column: `max-w-[680px]` left article + `300px` sticky right sidebar.  
Sidebar contains: article meta card → table of contents → "More from Lab"  
File: `src/app/updates/article/page.tsx`

### Per-Lab Latest Row (Homepage)
Horizontal scroll row showing 1 most-recent article per lab.  
On desktop: scrollable flex row. Mobile: snap scroll.  
Added in `HomePageContent.tsx` — Phase 9.

---

## Labs Configuration

Active labs with working auto-fetch → `src/lib/config.ts`

| Lab | Feed Type | Status |
|---|---|---|
| OpenAI | RSS | ✅ Active |
| Anthropic | HTML | ✅ Active |
| Google / Gemini | RSS | ✅ Active |
| Meta AI | HTML | ✅ Active |
| Hugging Face | RSS | ✅ Active |
| NVIDIA | RSS | ✅ Active |
| Stability AI | RSS | ✅ Active |
| Mistral AI | HTML | ✅ Active |
| X.AI | RSS (mirror) | ✅ Active |
| Amazon | RSS | 🆕 Added Phase 9 |
| Apple | RSS | 🆕 Added Phase 9 |

**Removed (Phase 9):** Microsoft, Cohere, DeepSeek, Perplexity — 0 articles fetched.  
To re-add: verify feed URL works, add to `config.ts`, add to Company type in `types.ts`, add accent to `companyAccents.ts`.

---

## Navigation Structure

```
Header:  Home (/) · Labs (/companies) · Saved (/saved)
Footer:  Labs (/companies) · About (/about) · Privacy (/legal)
```

All links verified working. Do NOT add nav items without updating both header and footer.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `--color-*` CSS variables | Hardcode `#ffffff` or `#000000` |
| Use the shared `companyAccents.ts` | Duplicate accent color maps per component |
| Use `UpdateCard` / `FeaturedCard` patterns | Create new one-off card designs |
| Keep dark mode working on every new page | Only test in light mode |
| Add labs to `types.ts` AND `config.ts` AND `companyAccents.ts` | Add to config without updating types |
| Use JetBrains Mono for dates/labels | Use Inter for metadata (defeats the 3-font system) |

---

## Update Workflow

When making site changes:
1. Update this `DESIGN.md` if colors, fonts, layout, or lab list change
2. Test in both **light and dark mode**
3. Test on **mobile** (main breakpoint: `lg` = 1024px)
4. Commit with descriptive message: `feat/fix/style: [component] — [description]`
5. Push to `master` → Vercel auto-deploys (via GitHub Actions)
