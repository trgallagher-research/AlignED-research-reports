# AlignED Research Reports — Site Guidelines

## Project Overview

AlignED Research Reports is a collection of research articles from the AlignED project, which benchmarks AI model performance on tasks related to professional teaching knowledge. This is a static HTML/CSS/JS site hosted on GitHub Pages. No build tools, no templating. Text is written directly in each page's HTML file.

Each article is a self-contained piece of research, stored in its own directory under `articles/`. The landing page (`index.html`) lists all articles as cards.

## File Structure

```
AlignED-research-reports/
  index.html                          # Landing page with article listing
  css/style.css                       # Shared stylesheet for all pages
  js/main.js                          # Shared JS (nav toggle only)
  articles/
    001-aligned-benchmark/
      index.html                      # Article 1: full benchmark paper
      data/                           # Frozen JSON data for Article 1 charts
      js/charts.js                    # Chart rendering for Article 1
  peer_reviews/                       # Preserved peer review markdown files
```

## Directory Pattern for New Articles

Each article follows the pattern `articles/NNN-slug/`:

- `NNN` is a zero-padded number (001, 002, 003...)
- `slug` is a short, lowercase, hyphenated description
- Each article directory contains at minimum an `index.html`
- Optional: `data/` for datasets, `js/` for article-specific scripts

## How to Add a New Article

1. Create `articles/NNN-topic-slug/index.html`
2. Use the same header pattern: "AlignED Reports" logo + "All Articles" link
3. Use the same footer pattern with updated article-specific links
4. Add a card to the landing page's article listing section
5. If the article has charts, create `articles/NNN-topic-slug/js/charts.js` and `data/`
6. Commit and push

## Page Detection

Articles use `document.body.dataset.page` for page-specific behaviour:

- `data-page="landing"` — index.html (landing page)
- `data-page="article-001"` — Article 1 (charts render here)

Future articles should use `data-page="article-NNN"` pattern.

## Writing Rules (MUST follow for all copy changes)

### Epistemic Precision (most important rule)

AlignED exists because overclaiming is common in EdTech. The website must not do the same.

What AlignED does: benchmarks how models respond to specific tasks related to professional teaching knowledge. What it does NOT do (never claim or imply): determine whether a model "understands" education, certify safety or suitability, prove a model "can teach" or "knows how learning works", or replace professional judgement.

General principle: Report what was measured. Let the reader draw the inference.

| Never write | Write instead |
|-------------|---------------|
| "Model X understands pedagogy" | "Model X scored 34/36 on diagnostic scenarios" |
| "Tests whether AI knows how learning works" | "Tests how models handle tasks related to professional teaching knowledge" |
| "Ensures educational safety" | "Provides benchmark data to inform decisions" |

### The Evaluation Gap (critical framing)

AlignED focuses on tasks teachers do, not tasks students do. Do not claim that most other benchmarks test only student knowledge. The correct framing is:

> "There is a shortage of evaluations that test models on the educational tasks they are currently being used for: identifying misconceptions about learning, diagnosing why teaching strategies fail in practice, answering the kinds of questions that appear on teacher certification exams, and comparing student work against curriculum standards."

### Tone

- Short, confident sentences. Vary sentence length.
- Active voice. Be direct about limitations.
- Trust the reader's intelligence.
- Lead with findings, not methodology on results pages.
- Use British/Australian spelling (prioritise, recognise, organisation, behaviour).

### AI Slop Blacklist

DO NOT USE any of the following:

Punctuation: Em dashes as all-purpose connectors (max one per page, zero is fine). Excessive colons. Semicolons as sentence glue.

Phrasing: "It's not X, it's Y" / "Not just X, but Y". "In today's rapidly evolving...". "It's worth noting that...". "This is particularly important because...". "Whether you're a teacher, a policymaker, or a developer...". "The short answer is...". "Here's the thing:". "Let's dive in" / "Let's explore" / "Let's unpack". "At the end of the day". "Importantly," / "Crucially," / "Notably,".

Words: Groundbreaking, Revolutionary, Ensure, Empower, Leverage, Harness, Holistic, Cutting-edge, State-of-the-art, Stakeholders, Ecosystem, Deep dive, Robust (as general praise; fine when referring to temperature robustness as a measured property), Genuine/Genuinely.

Structural: Don't use rhetorical questions for every section header. Mix with declarative headers. Don't repeat "complementary" when describing ACARA. Say it once.

### Footer Tagline (all pages)

Use: "Research articles on AI in educational practice."

## Visual Design

Warm parchment palette inspired by claude.ai and Financial Times:
- Background: `#F4F1EB` (warm parchment)
- Surface: `#FEFDFB` (off-white for cards)
- Text: `#2D3748`
- Primary: `#3B6B9A` (academic blue)
- Accent: `#B67D5C` (terracotta)

Typography: Inter (headings/UI) + Georgia (body text) + Consolas (code/prompts).
Prose max-width: 960px. Charts can go wider (1100px via `.container-wide`).

## CSS Rules

All styles live in `css/style.css`. No inline styles on any page (except minor layout overrides like chart heights).

## Related Sites

- **AlignED-site** — Live benchmark results (scores, rankings, updated data)
- **AlignED-research-report** — Archived original paper site (frozen with redirect banner)
