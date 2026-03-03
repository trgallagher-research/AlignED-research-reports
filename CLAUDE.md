# AlignED Research Reports — Landing Page

## Project Overview

This repo is a simple landing page that indexes all AlignED research reports. Each report is a standalone GitHub Pages site in its own repo. This page links to them.

Hosted on GitHub Pages at: `https://trgallagher-research.github.io/AlignED-research-reports/`

## File Structure

```
AlignED-research-reports/
  index.html          # Landing page with links to all reports
  css/style.css       # Shared stylesheet (warm parchment palette)
  js/main.js          # Navigation toggle
  CLAUDE.md           # This file
  .gitignore
```

## How to Add a New Report

When a new report repo is published (e.g. `AlignED-research-report-2`):

1. Enable GitHub Pages on the new repo (main branch, root path)
2. Add a new article card to `index.html` following the existing pattern:
   ```html
   <a href="https://trgallagher-research.github.io/AlignED-research-report-N/" class="article-card" target="_blank">
     <span class="article-date">Month Year</span>
     <h3>Report N: Title Here</h3>
     <p>Short description of the report's scope and key findings.</p>
   </a>
   ```
3. Commit and push

## Report Naming Convention

Each report is a separate repo following the pattern:
- `AlignED-research-report` — Report 1 (the original)
- `AlignED-research-report-2` — Report 2
- `AlignED-research-report-3` — Report 3
- etc.

Each report site is frozen at publication and not updated after release.

## Writing Rules

Follow the same epistemic precision, tone, and AI slop blacklist rules as the individual report repos. See `AlignED-research-report/CLAUDE.md` for the full set of writing guidelines.

Key rule: Report what was measured. Let the reader draw the inference. No overclaiming.

## Visual Design

Warm parchment palette (same across all AlignED sites):
- Background: `#F4F1EB`, Surface: `#FEFDFB`, Text: `#2D3748`
- Primary: `#3B6B9A`, Accent: `#B67D5C`
- Typography: Inter (headings) + Georgia (body)

## Related Repos

- **AlignED-research-report** — Report 1: Benchmarking AI Models for Educational Practice (Feb 2026)
- **AlignED** — Core benchmark code, evaluation configs, datasets
- **AlignED-site** — Live results dashboard (separate from reports)
