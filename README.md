# India Macro Pulse — Web Dashboard

Interactive RBI/India macro dashboard, deployable free on GitHub Pages.

## Run it locally first (optional but recommended)

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 — click around the tabs (Repo Rate Pulse,
Inflation Trend, GDP Growth, Market Reaction) to confirm it works before
deploying.

## Deploy to GitHub Pages — exact steps

1. **Create a new repo on GitHub**
   Go to https://github.com/new, name it `rbi-dashboard-web` (or anything —
   just remember the name), keep it public, don't add a README (you already have one).

2. **Edit one file to match your repo name**
   Open `vite.config.js` and make sure `base` matches your repo name exactly:
   ```js
   base: "/rbi-dashboard-web/",
   ```
   If you named your repo something else, change this to `/your-repo-name/`.

3. **Push this folder to GitHub** (run in this folder, in your terminal):
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rbi-dashboard-web.git
   git push -u origin main
   ```

4. **Turn on GitHub Pages**
   On GitHub, go to your repo → **Settings** → **Pages** (left sidebar) →
   under "Build and deployment", set **Source** to **GitHub Actions**.

5. **Wait ~1–2 minutes**
   Go to the **Actions** tab in your repo — you'll see "Deploy to GitHub
   Pages" running. When it turns green, your site is live at:
   ```
   https://YOUR_USERNAME.github.io/rbi-dashboard-web/
   ```

Every time you `git push` after this, the site rebuilds and redeploys
automatically — that's what `.github/workflows/deploy.yml` does.

## Updating the data

The dashboard reads from `src/data.json`. To refresh it with real numbers:

1. Run the companion `rbi_data_pipeline` scripts (especially `model_event_study.py`)
2. Copy the new numbers into `src/data.json` (repoTimeline, cpiTrend, gdpForecast, eventStudy)
3. `git add . && git commit -m "update data" && git push`

The site redeploys automatically with the new numbers.

## Project structure

```
rbi-dashboard-web/
├── src/
│   ├── App.jsx        ← the dashboard UI
│   ├── main.jsx        ← React entry point
│   └── data.json       ← all chart data lives here, edit this to update
├── .github/workflows/
│   └── deploy.yml      ← auto-builds & deploys to GitHub Pages on push
├── index.html
├── package.json
└── vite.config.js      ← IMPORTANT: "base" must match your repo name
```
