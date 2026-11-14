# FIRELINE — Render Production Deployment Guide

**Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall  
**Lead Developer:** Aniket Nandi (Kolkata, IST)  
**Target Platform:** Render (Node.js Web Service)  
**Service URL (Upon Launch):** `https://fireline-<random-slug>.onrender.com` or custom domain

---

## 1. Deployment Overview

FIRELINE is a self-contained Next.js 15 application utilizing Server Components, client-side React Suspense boundaries, and standalone REST API route handlers. All scientific data contracts, empirical records (`empirical_records.json`), and peer-reviewed findings (`audited_findings.json`) are bundled directly into the production build.

**No separate Python backend service is required for production deployment.** The Python backend is utilized strictly for offline data contract compilation, CSV parsing, and automated test validation.

---

## 2. Render Service Configuration Settings

When creating the web service in the [Render Dashboard](https://dashboard.render.com/):

| Setting | Value | Rationale |
|:---|:---|:---|
| **Service Type** | **Web Service** | Required for dynamic Next.js App Router, SSR, and API route handlers. |
| **Repository** | Your connected GitHub repo | e.g. `https://github.com/<your-username>/fireline` |
| **Branch** | `master` | Canonical production release branch. |
| **Runtime** | `Node` | Native Node.js runtime environment (Node 18, 20, or 22). |
| **Region** | `Singapore (Southeast Asia)` | Selected region (`singapore`) closest to IST timezone and Asia-Pacific. |
| **Instance Type** | `Free` (or `Starter`) | 512 MB – 1 GB RAM is sufficient (build memory peak is ~400 MB). |
| **Build Command** | `npm ci && npm run build` | Clean, reproducible dependency install followed by Next.js optimized compilation. |
| **Start Command** | `npm start` | Executes `next start`. Binds automatically to `0.0.0.0` and listens on Render's `$PORT`. |
| **Health Check Path** | `/api/health` | Dedicated lightweight health endpoint returning HTTP 200 OK and corpus status. |
| **Auto-Deploy** | `Yes` | Automatically redeploys on pushes to `master`. |

---

## 3. Environment Variables Configuration

Configure these environment variables in the Render Dashboard (**Environment** tab):

| Variable Name | Required? | Default / Recommended Value | Description |
|:---|:---:|:---|:---|
| `NODE_ENV` | **Yes** | `production` | Enables Next.js production optimizations and stripped dev traces. |
| `NEXT_TELEMETRY_DISABLED` | **Yes** | `1` | Disables telemetry network overhead during build and runtime. |
| `PORT` | **Auto** | *Provided by Render* (default `10000`) | Next.js natively detects and binds to Render's injected `$PORT`. |
| `GEMINI_API_KEY` | *Optional* | *(Your Google AI Studio Gemini API Key)* | Enables live Gemini 2.5 Flash generative AI calls with citation verification. **If omitted, FIRELINE seamlessly activates its deterministic fallback engine with 100% functionality.** |
| `GEMINI_MODEL` | *Optional* | `gemini-2.5-flash` | Allows overriding model tier (e.g. `gemini-1.5-flash`). |

> [!IMPORTANT]
> **Zero Secrets Policy:** Never commit `.env` or `GEMINI_API_KEY` to git. Set `GEMINI_API_KEY` exclusively via the encrypted Render Dashboard Environment settings.

---

## 4. Step-by-Step Deployment Instructions

### Method A: Deploy via Render Dashboard (Recommended)

1. **Push your repository to GitHub:**
   Ensure your local `master` branch is pushed to your remote GitHub repository:
   ```bash
   git push origin master
   ```

2. **Open Render Dashboard:**
   Go to [https://dashboard.render.com/](https://dashboard.render.com/) and log in.

3. **Create New Web Service:**
   - Click the **"New +"** button in the top navigation.
   - Select **"Web Service"**.
   - Select **"Build and deploy from a Git repository"** and click **Next**.
   - Choose your repository (or connect GitHub and authorize repository access).

4. **Fill Service Parameters:**
   - **Name:** `fireline` (or `fireline-decision-support`)
   - **Region:** `Singapore`
   - **Branch:** `master`
   - **Runtime:** `Node`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Configure Health Check & Advanced Settings:**
   - Click **"Advanced"**.
   - Set **Health Check Path** to `/api/health`.
   - Under **Environment Variables**, click **"Add Environment Variable"**:
     - `NODE_ENV` = `production`
     - `NEXT_TELEMETRY_DISABLED` = `1`
     - *(Optional)* `GEMINI_API_KEY` = `your_actual_key`

6. **Deploy:**
   - Click **"Create Web Service"**.
   - Render will trigger the initial build. You can monitor the live log stream.
   - Once the build succeeds, Render will perform the health check against `/api/health` and display a green **"Live"** badge with your public URL:
     `https://fireline-<subdomain>.onrender.com`

---

### Method B: Deploy via Render Blueprint (`render.yaml`)

FIRELINE includes a pre-configured `render.yaml` blueprint in the repository root.

1. In Render Dashboard, click **"New +"** $\to$ **"Blueprint"**.
2. Connect your GitHub repository.
3. Render will parse `render.yaml` automatically and prompt for any optional secret environment variables (`GEMINI_API_KEY`).
4. Click **"Apply"** to deploy.

---

## 5. Post-Deployment Verification Checklist

Once Render reports your service as **"Live"**, verify each critical route:

1. **Health Check:**
   ```bash
   curl -I https://<your-service>.onrender.com/api/health
   ```
   *Expected:* HTTP 200 OK, JSON containing `status: "ok"`, `corpus.empirical_records: 9`, `corpus.audited_findings: 20`.

2. **Mission Control Dashboard (`/`):**
   Open `https://<your-service>.onrender.com/` in your browser. Confirm all four metrics cards render cleanly without layout shift.

3. **Scientific Evidence Explorer (`/explore`):**
   Open `https://<your-service>.onrender.com/explore`. Search for `"SIBAL"`, open the detail drawer, and verify provenance data and DOI links.

4. **Exploration Mission Gap Assessor (`/assess`):**
   Open `https://<your-service>.onrender.com/assess?preset=artemis_lunar`. Confirm the Artemis Lunar Habitat preset loads automatically and flags the `CRITICAL GAP` for 34% O2.

5. **SI Research Copilot (`/copilot`):**
   Open `https://<your-service>.onrender.com/copilot`. Test a sample inquiry. Confirm the response renders citation chips with green checkmarks or deterministic audited evidence.

---

## 6. Troubleshooting

- **Build Timeout or Memory Spike:**
  If the build exceeds memory limits on free tiers, verify that `node_modules/` is not checked into git. `npm ci && npm run build` uses ~350 MB RAM, well within the 512 MB free tier allowance.
- **Health Check Timeout:**
  Render allows up to 5 minutes for initial boot. Next.js starts in < 2 seconds. The `/api/health` route responds in < 15ms.
- **Port Conflict:**
  Do NOT hardcode `-p 3000` in the start command. `npm start` natively reads `process.env.PORT` which Render sets to `10000`.

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
