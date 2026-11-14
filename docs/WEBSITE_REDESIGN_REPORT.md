# FIRELINE — Website Redesign & UX Engineering Report
**Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Lead Full-Stack Developer & Designer:** Aniket Nandi (Kolkata, IST)  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — *Flame in Freefall*  
**Date:** November 14, 2026  
**Document ID:** `DOC-UX-REDESIGN-REPORT-20261114`  
**Deployment Target:** Render Web Service (`https://fireline-rmr2.onrender.com`)  
**Source Repository:** `https://github.com/Optimus1o1/fireline`

---

## 1. Executive Summary

In response to the NASA Space Apps Challenge 2026 (*Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*), **Moon Sanctum Labs** conducted a comprehensive design overhaul and interface engineering mission on FIRELINE.

Prior to this sprint, FIRELINE possessed a robust scientific back-end and verified Pydantic data contracts, but suffered from three user experience bottlenecks:
1. Disjointed, page-specific navigation headers where menu links vanished or turned into non-navigable tags.
2. React controlled component input freezes in `/assess` caused by unbuffered `parseFloat("")` calls cascading `NaN` values into state and calculations.
3. Visual fragmentation between routes (slate/orange vs. ink/copper) and the absence of an executive landing page explaining the microgravity fire challenge and NASA PSI data ingestion.

This mission successfully transitions FIRELINE into **FIRELINE — EMBER LAB**: a cinematic, dark graphite-and-ember scientific research environment featuring persistent global navigation, working input controls, reactive filters, a standalone 5-gate Physical Comparability Studio, and a lightweight Three.js 3D microgravity combustion chamber.

---

## 2. Design System: Ember Lab Identity

The design system replaces legacy color schemes with a cohesive palette reflecting the physics of spacecraft combustion:

| Token | Hex / CSS Value | Semantic Role |
|---|---|---|
| `ember-bg` | `#08090B` | Deep space graphite background |
| `ember-subtle` | `#101216` | Secondary panel backgrounds, sidebars |
| `ember-surface` | `#17191F` | Elevated glass cards, tooltips |
| `flame` | `#E53935` | Primary action accent, core brand flame |
| `flame-bright` | `#FF604A` | Interactive highlights, active links, glow effects |
| `amberGold` | `#F5A742` | Warning states, partial evidence indicators |
| `paper` | `#F5F3F0` | High-contrast primary reading typography |
| `paper-muted` | `#A1A1AA` | Secondary metrics, descriptions |
| `paper-dim` | `#71717A` | Metadata captions, table headers |

### Scientific Status Tokens
- `SUPPORTED`: `#10B981` (Emerald) — Empirically grounded in NASA PSI flight records with DOI.
- `INFERRED`: `#F59E0B` (Amber) — Derived via verified physical similitude models (Reynolds, Biot).
- `EVIDENCE_GAP`: `#E53935` (Flame Red) — Uncharacterized regime lacking NASA microgravity flight data.

### Glassmorphism & Visual Restraint
- Panel backgrounds use `rgba(23, 25, 31, 0.7)` with `backdrop-filter: blur(12px)` and 1px subtle border `rgba(255, 255, 255, 0.08)`.
- Subtle radial glows (`shadow-ember`, `shadow-glass`) provide depth without distracting from dense tabular data.

---

## 3. Global Navigation Shell & Route Hierarchy

### Unified Navigation Architecture (`SiteHeader.tsx` & `SiteFooter.tsx`)
Mounted directly inside `src/app/layout.tsx`, the global shell persists across every route in the application:

1. **Overview (`/`):** Cinematic landing page with 3D chamber, problem context, 5-step pipeline, interactive walkthrough, and integrity guarantees.
2. **Dashboard (`/dashboard`):** Operational Mission Control monitoring 3 investigations, 10 raw PSI rows, 7 accepted specimens, and 2 diagnostics.
3. **Evidence Explorer (`/explore`):** Two-panel exploration studio with reactive scientific filters, record search, and detailed specimen inspector.
4. **Comparability (`/compare`):** Dedicated pairwise studio evaluating 5 deterministic similitude gates between flight runs.
5. **Mission Assessor (`/assess`):** Exploration atmosphere evaluator with buffered numeric inputs and real-time gap detection.
6. **SI Copilot (`/copilot`):** Grounded intelligence engine with expanding multiline textarea and evidence citation validation.
7. **External Link:** Direct linkage to the official NASA Physical Sciences Informatics repository (`https://psi.nasa.gov/`).

### Route Structure
```
/                      -> Landing Page (3D Combustion Chamber & Mission Overview)
/dashboard             -> Operational Research & Evidence Dashboard
/explore               -> NASA PSI Evidence Explorer & Run Inspector
/compare               -> Physical Comparability Studio (5-Gate Similitude)
/assess                -> Spacecraft Mission Evidence-Gap Assessor
/copilot               -> Grounded SI Copilot (Dual-Mode Intelligence)
/api/health            -> System Health & Ingestion Corpus Telemetry
/api/investigations    -> Investigation Summaries
/api/evidence/search   -> Filtered Evidence Query Endpoint
/api/evidence/compare  -> Deterministic 5-Gate Physical Comparison Endpoint
/api/assess            -> Mission Scenario Gap Evaluation Endpoint
/api/copilot/explain   -> Grounded LLM & Fallback Explanation Endpoint
```

---

## 4. 3D Microgravity Combustion Chamber (`CombustionChamber3D.tsx`)

A lightweight, high-performance WebGL experience developed with Three.js (no heavy external dependencies):
- **Microgravity Spherical Flame:** In orbit, the absence of buoyancy causes flames to burn as steady, spherical diffusion spheres rather than pointed teardrops. The visualization renders an inner pulsing core (`#FF604A`), an ember mantle (`#E53935`), and an outer atmospheric halo (`#F5A742`).
- **Concentric Gimbal Rings:** Three sensor rings simulate diagnostic combustion chamber instrumentation.
- **Drifting Ember Particles:** 140 procedural particles drift in zero gravity with additive blending.
- **Orbiting Investigation Markers:** Interactive pills for `SAFFIRE-I` (PSI-98) and `BASS-II` (PSI-25) with hover tooltips.
- **Interactive Mouse Parallax:** Damped camera panning responding to cursor movement.
- **Accessibility & Safety:** Detects `(prefers-reduced-motion: reduce)` to disable pulse animations and rotation.
- **Mandatory Epistemic Label:** Prominently displays *"Conceptual visualization — not experimental data"* to prevent confusion with empirical telemetry.

---

## 5. Input Reliability & Interaction Repairs

### Bug B Resolution in `/assess`
- **Root Cause:** Immediate `parseFloat(e.target.value)` coerced empty strings `""` to `NaN`. Controlled React inputs froze when receiving `value={NaN}`.
- **Fix:** Implemented safe numeric buffering in `handleNumericChange`. Allows intermediate typing, empty states, and negative signs without corrupting state or calculating derived `NaN` values. Clamps numbers to physical boundaries upon submission.

### Reactive Filtering in `/explore`
- Dropdown changes now invoke `executeSearch()` reactively while retaining instant keyword search and "Reset" functionality.
- Side-by-side selection links directly to `/compare` or opens the modal comparison inspector.

### Expanding Query Input in `/copilot`
- Upgraded query box to an expanding multi-line `<textarea>` supporting Shift+Enter for newlines and Enter to submit.
- Added quick-clear button, character counter, and instant submission when clicking suggested scientific prompts.

---

## 6. Verification & Test Metrics

| Test Suite / Build Gate | Expected | Result | Status |
|---|---|---|---|
| Backend Pytest Suite | 69 passed | 69 passed (0.27s) | **PASSED** |
| TypeScript Compiler (`tsc --noEmit`) | 0 errors | 0 errors | **PASSED** |
| ESLint (`next lint`) | 0 warnings | 0 warnings, 0 errors | **PASSED** |
| Next.js Production Build (`next build`) | Exit code 0 | 14/14 static pages generated | **PASSED** |
| Epistemic Integrity Audit | No fabricated data | 100% NASA PSI grounded | **PASSED** |

---

## 7. Submission & Deployment Information

- **Host Service:** Render Web Service (`srv-dbs4huu7bikc73ej2nog`)
- **Live URL:** [https://fireline-rmr2.onrender.com](https://fireline-rmr2.onrender.com)
- **GitHub Repository:** [https://github.com/Optimus1o1/fireline](https://github.com/Optimus1o1/fireline)
- **Author & Lead Developer:** Aniket Nandi
- **Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*
- **NASA Space Apps Challenge:** 2026 — *Flame in Freefall*
