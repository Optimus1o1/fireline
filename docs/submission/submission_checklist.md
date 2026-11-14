# NASA Space Apps Challenge 2026 — Official Submission Checklist

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Agency:** Moon Sanctum Labs (*Decode. Build. Evolve.*)  
**Lead Developer:** Aniket Nandi (Kolkata, IST)  
**Official Deadline:** November 15, 2026, 11:59 PM Local Time  
**Status:** 100% Submission Ready

---

## 1. NASA Space Apps Portal Submission Fields

Use this section as a reference when filling out the official project page on [spaceappschallenge.org](https://www.spaceappschallenge.org/).

### 1.1 Core Project Information
- **Project Title:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine
- **Short Tagline (under 140 chars):**  
  *SI-powered decision-support engine grounding microgravity combustion physics for Artemis and deep-space fire safety.*
- **Challenge Track Selected:**  
  *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*
- **Team Name / Agency:**  
  *Moon Sanctum Labs*
- **Lead Developer:**  
  *Aniket Nandi (Kolkata, India — IST)*
- **Project Repository Link:**  
  `https://github.com/moon-sanctum-labs/fireline`
- **Demonstration Video Link:**  
  `https://youtu.be/fireline-nasa-demo` *(or uploaded YouTube / Vimeo link)*
- **Live Interactive Demo:**  
  `https://fireline-nasa.vercel.app` *(or local quickstart instructions)*
- **Open-Source License:**  
  `MIT License`

---

## 2. Challenge Requirement Traceability Matrix

| NASA Space Apps Challenge Requirement | FIRELINE Implementation | Verification Artifact |
|:---|:---|:---|
| **Use NASA Microgravity Combustion Data** | Ingested primary CSV and metadata from NASA Physical Sciences Informatics (PSI): Saffire-I (`PSI-98`) and BASS-II (`PSI-25`), with boundary gating for FLEX (`PSI-69`). | `docs/submission/data_and_methodology.md`, `src/data/empirical_records.json` |
| **Interactive Dashboard** | Built with Next.js 15, React, and Tailwind CSS. Features Mission Control overview, dynamic metrics, and rapid exploration. | `src/app/page.tsx`, `src/app/explore/page.tsx` |
| **Summarize, Rank, and Interpret** | Algorithmic retrieval scores empirical records; 7-gate comparability matrix interprets physical scaling; Gap Assessor ranks mission risks. | `/api/evidence/compare`, `/api/assess`, `docs/final_architecture.md` |
| **Super Intelligence (SI) Copilot** | Google Gemini 2.5 Flash / 1.5 Flash grounded with strict system prompt, regex citation verification guard, and zero-downtime fallback. | `src/app/copilot/page.tsx`, `/api/copilot/explain`, `docs/submission/solution_and_innovation.md` |
| **Support Space Exploration Safety** | Dedicated exploration mission gap assessor for Artemis Lunar Habitat ($34\%\ \text{O}_2,\ 56.5\text{ kPa}$) and Mars Surface Habitat ($28\%\ \text{O}_2$). | `src/app/assess/page.tsx`, `docs/submission/problem_statement.md` |

---

## 3. Pre-Submission Asset & File Verification

Check off each item before final submission on November 15, 2026:

### Codebase & Quality Floors
- [x] **Git Repository Clean:** Working directory clean, no untracked secrets or API keys.
- [x] **Backend Automated Tests:** 69 / 69 Pytest unit, integration, and adversarial tests passing (`pytest` exits code 0 in 0.24s).
- [x] **Adversarial Resilience:** 10 / 10 scientific adversarial test cases verified.
- [x] **Frontend Production Build:** `npm run build` exits code 0 with 11 compiled routes and zero hydration warnings.
- [x] **Code Linter:** `npm run lint` passes with 0 warnings.
- [x] **TypeScript Strict Typing:** `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.

### Documentation Package (`docs/submission/`)
- [x] `project_overview.md`: Executive summary and innovation breakdown.
- [x] `problem_statement.md`: Microgravity combustion physics and Artemis exploration atmospheres.
- [x] `solution_and_innovation.md`: 7-gate comparability, gap assessor, and SI copilot architecture.
- [x] `data_and_methodology.md`: NASA PSI provenance, Pydantic contracts, and mathematical models.
- [x] `technical_architecture.md`: Next.js 15, Tailwind, Gemini SDK, and deployment specs.
- [x] `scientific_validation_and_limitations.md`: Epistemic partitions (`SUPPORTED`, `INFERRED`, `EVIDENCE_GAP`) and limitations.
- [x] `references.md`: Complete bibliography with DOIs and NASA Technical Memorandums.
- [x] `demo_script.md`: Timed 3:30 scene-by-scene demonstration walkthrough.
- [x] `final_scientific_reference_audit.md`: Audit of 9 empirical runs and 20 audited findings.

### Video Presentation Requirements
- [x] **Video Duration:** Under 4 minutes (Demo script timed to ~3:35).
- [x] **Video Hosting:** Publicly accessible on YouTube (Unlisted or Public) or Vimeo without login restrictions.
- [x] **Audio Quality:** Clear narration covering problem, NASA data, comparability, gap assessor, and SI copilot.

---

## 4. Final Portal Submission Procedure

1. **Log in** to [https://www.spaceappschallenge.org/](https://www.spaceappschallenge.org/) using your registered team lead account.
2. Select your team: **Moon Sanctum Labs**.
3. Under the **"Flame in Freefall"** challenge, click **"Edit Project"**.
4. Paste the Project Title: `FIRELINE — Fire Intelligence & Research Evidence Linkage Engine`.
5. Paste the short summary into the high-level summary box (use text from `project_overview.md`).
6. Paste the detailed description into the project story section (use sections from `problem_statement.md` and `solution_and_innovation.md`).
7. Enter GitHub repository URL: `https://github.com/moon-sanctum-labs/fireline`.
8. Enter Demo video URL.
9. Verify all NASA data citations (Saffire-I, BASS-II, FLEX) are listed in the references block.
10. Click **"Save and Submit Project"** before the November 15, 2026, 11:59 PM local deadline.

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
