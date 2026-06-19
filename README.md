# CPMAI Exam Studio v2 Premium

Offline-first CPMAI exam preparation Progressive Web App.

## What changed in v2

- 4,000 original exam-style questions.
- 10 updated mock exams, each 120 questions and domain-weighted.
- Much deeper study guide across all five current PMI-CPMAI domains.
- Better explanations: every answer option has a reason explaining why it is right or wrong.
- Adaptive practice: prioritizes weak domains, unanswered questions, missed questions, and bookmarks.
- More polished premium UI for mobile and desktop.
- Offline PWA support with manifest and service worker.

## Important content integrity note

This app does not contain copied, leaked, recalled, or actual PMI exam questions. It uses original exam-style scenarios designed to train the same decision patterns: business fit, data readiness, responsible AI, model evaluation, and operationalization.

## Vercel deployment settings

Use these exact settings:

```text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Environment Variables: leave empty
```

## GitHub upload checklist

Upload the contents of this folder directly to the root of your GitHub repository. Your repository must show this at the top level:

```text
index.html
package.json
README.md
vercel.json
netlify.toml
src
public
```

Inside `src`, you must have:

```text
App.jsx
main.jsx
styles.css
data/cpmaiData.json
```

## Local test, optional

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
