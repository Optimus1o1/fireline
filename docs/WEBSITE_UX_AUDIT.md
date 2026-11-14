# FIRELINE — Website UX & Interface Engineering Audit
**Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Lead Full-Stack Developer & Designer:** Aniket Nandi (Kolkata, IST)  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — *Flame in Freefall*  
**Date:** November 14, 2026  
**Document ID:** `DOC-UX-AUDIT-20261114`

---

## 1. Executive Summary

This audit assesses the user interface, navigation consistency, input responsiveness, and visual architecture of the FIRELINE web application across all active routes (`/`, `/explore`, `/assess`, `/copilot`).

While the underlying scientific engine, Pydantic contracts, and 69 backend Pytest test cases function with 100% test pass fidelity, the frontend exhibited three critical architectural and usability flaws:
1. **Bug A (Navigation Inconsistency & Disappearance):** Disjointed navigation headers implemented independently across pages, leading to links vanishing, divergent styling, and non-navigable active tags.
2. **Bug B (Input Interaction Failures):** React controlled component lockups in numeric inputs due to immediate `parseFloat("")` coercion resulting in `NaN` state corruption, combined with filter execution disconnects.
3. **Bug C (Design Fragmentation & Route Hierarchy):** Jarring theme switches between pages (e.g., slate/orange in `/assess` vs ink/copper in `/explore`), missing dedicated `/dashboard` and `/compare` routes, and absence of a cinematic scientific landing page.

---

## 2. Bug A: Navigation Inconsistency & Disappearance

### Root Cause Analysis
- **Missing Root Layout Shell:** `src/app/layout.tsx` was completely bare (`<html><body>{children}</body></html>`), delegating header and navigation construction to each individual route component.
- **Header Divergence:**
  - `src/app/page.tsx` rendered 6 navigation links (`Overview`, `Evidence Explorer`, `Evidence Assessor`, `SI Copilot`, `Mission Presets`, `NASA PSI`).
  - `src/app/explore/page.tsx` rendered 5 items, replacing the active `Evidence Explorer` link with a plain non-interactive `<span className="text-copper font-semibold">Evidence Explorer</span>`, preventing reload or navigation reset.
  - `src/app/assess/page.tsx` completely stripped global navigation, showing only 3 links (`/explore`, `/assess`, `/copilot`) in a custom blue/slate bar, eliminating access to `Overview`, `Dashboard`, and external NASA resources.
  - `src/app/copilot/page.tsx` had another variant with an inline `<Sparkles />` icon and different link states.
- **Symptom Observed by Users:** When navigating from the home page to `/assess`, half of the navigation bar vanished, the logo lockup changed, and users were trapped without a visible route back to the Dashboard.

### Remediation
- Implement a single, persistent `SiteHeader.tsx` in `src/components/layout/` mounted directly inside `src/app/layout.tsx`.
- Standardize all navigation targets across all pages:
  1. `Overview` (`/`)
  2. `Dashboard` (`/dashboard`)
  3. `Evidence Explorer` (`/explore`)
  4. `Comparability` (`/compare`)
  5. `Mission Assessor` (`/assess`)
  6. `SI Copilot` (`/copilot`)
  7. External Link: `NASA PSI` (`https://psi.nasa.gov/`)
- Use Next.js `usePathname()` to compute active states dynamically with glowing ember underline indicators rather than swapping out `<Link>` for non-clickable `<span>` elements.
- Implement a mobile-responsive slide-out drawer menu with auto-closing triggers on navigation.

---

## 3. Bug B: Input Interaction & Responsiveness Failures

### Root Cause Analysis

#### 1. Controlled State `NaN` Locking in `/assess`
In `src/app/assess/page.tsx`, numeric fields (gravity, oxygen concentration, total pressure, flow velocity) were bound directly to state with immediate float parsing:
```tsx
// Flawed implementation in src/app/assess/page.tsx:
<input
  id={oxygenPercentId}
  type="number"
  value={scenario.oxygenPercent}
  onChange={(e) => handleFieldChange('oxygenPercent', parseFloat(e.target.value))}
/>
```
When a user selects the input content and presses Backspace or Delete, `e.target.value` is an empty string `""`.
- `parseFloat("")` evaluates to `NaN`.
- React re-renders `<input value={NaN} />`.
- When React receives `NaN` for a controlled number input, subsequent keystrokes are rejected or behave erratically in modern browsers.
- Furthermore, `handleFieldChange` performed derived calculations:
```tsx
if (field === 'pressureKpa') {
  updated.pressurePsia = parseFloat((Number(value) * 0.145038).toFixed(2));
}
```
If `value` is `NaN`, `pressurePsia` becomes `NaN`, corrupting downstream mathematical comparisons in `EvidenceGapAssessorEngine.assessMission()`.

#### 2. Search & Filter Disconnect in `/explore`
In `src/app/explore/page.tsx`, changing dropdown options (`selectedInvestigation`, `selectedMaterial`, `selectedGeometry`, `selectedStatus`) merely updated local component state without auto-triggering filtering:
```tsx
<select
  value={selectedMaterial}
  onChange={(e) => setSelectedMaterial(e.target.value)}
>
```
Users expected dropdown changes to immediately update the evidence list, or saw no feedback until manually navigating to and clicking the "Apply Filters" button at the bottom of the sidebar.

#### 3. Single-Line Constraint in `/copilot`
In `src/app/copilot/page.tsx`, queries were restricted to a single `<input type="text">`, which truncated long, multi-parameter scientific inquiries and prevented multiline paste operations.

### Remediation
- **Safe Input Parsing:** Allow intermediate empty string `""` in input state or maintain local text buffer, only updating numeric models when valid numbers are typed (`isNaN(val) ? 0 : val`).
- **Reactive Filters:** Trigger `handleSearch()` automatically on dropdown change while providing a clear "Reset" button and active filter indicator badges.
- **Enhanced Copilot Input:** Upgrade Copilot query box to an expanding multi-line textarea with Shift+Enter submission, clear button, and character counter.

---

## 4. Bug C: Design Fragmentation & Route Hierarchy

### Root Cause Analysis
- **Design Incoherence:**
  - `src/app/page.tsx`: Dark ink (`#0F1013`) and copper (`#E0A45C`).
  - `src/app/assess/page.tsx`: Slate-950 (`#020617`) with vivid orange gradients (`from-orange-500 to-amber-600`).
  - `src/app/copilot/page.tsx`: Mixed styles with inconsistent border and badge colors.
- **Missing Dedicated Landing Page & Route Placement:**
  - The root `/` route directly hosted the Mission Control Dashboard.
  - NASA challenge evaluators landing on the site were immediately greeted by dense tabular data rather than an executive scientific introduction to the microgravity problem, the NASA PSI pipeline, and interactive platform capabilities.
- **Subsumed Comparability Feature:**
  - The 5-gate Physical Comparability Engine is a key differentiator of FIRELINE, yet it was buried inside `/explore` requiring users to discover two checkboxes and click "Compare Selected (2/2)".

### Remediation
- **Establish Ember Lab Design System:**
  - Background: `#08090B` (Graphite space dark)
  - Surface subtle: `#101216`
  - Surface elevated: `#17191F` (Glassmorphism panels with 1px border `rgba(255,255,255,0.08)`)
  - Primary accent: `#E53935` (Deep ember flame)
  - Bright ember: `#FF604A` (Active highlights, glow)
  - Warning: `#F5A742`
  - Status tokens: Emerald (`SUPPORTED`), Amber (`INFERRED`), Red (`EVIDENCE_GAP`).
- **Route Restructuring:**
  - Route `/`: Cinematic Landing Page with Three.js 3D Microgravity Combustion Chamber, Problem context, Pipeline architecture, Interactive Guided Walkthrough, Core Capabilities, and Scientific Integrity guarantees.
  - Route `/dashboard`: Full Mission Control Dashboard (moved from `/` with 100% data and metric preservation).
  - Route `/compare`: Standalone Physical Comparability Studio for direct pairwise record comparison across the 5 physical gates.
  - Route `/explore`: Upgraded Evidence Explorer with Ember Lab theme and reactive filters.
  - Route `/assess`: Upgraded Spacecraft Mission Assessor with Ember Lab theme and validated inputs.
  - Route `/copilot`: Upgraded SI Copilot with Ember Lab theme, multiline input, and full citation inspector.

---

## 5. Implementation Roadmap & Verification Criteria

| Phase | Description | Key Deliverables |
|---|---|---|
| **Phase 1** | Design Tokens & System | `tailwind.config.ts`, `globals.css` with glassmorphic tokens |
| **Phase 2** | Unified Navigation Shell | `SiteHeader.tsx`, `SiteFooter.tsx` in `layout.tsx` |
| **Phase 3** | Cinematic Landing Page | `src/app/page.tsx` with 7 narrative sections |
| **Phase 4** | 3D Combustion Chamber | `CombustionChamber3D.tsx` (Three.js procedural microgravity flame) |
| **Phase 5** | Dashboard & Compare Routes | `src/app/dashboard/page.tsx`, `src/app/compare/page.tsx` |
| **Phase 6** | Input & Sub-page Repairs | Form validation fixes across `/explore`, `/assess`, `/copilot` |
| **Phase 7** | Responsive & Accessibility | 1920x1080 to 390x844 responsive checks, WCAG AA compliance |
| **Phase 8** | Test Suite & Build Verification | 69/69 backend Pytest, 0 ESLint errors, clean `next build` |
| **Phase 9** | Cloud Deployment | GitHub push, Render live deployment verification |

---
*Signed by Lead Developer:*  
**Aniket Nandi**  
Lead Full-Stack Developer & Designer  
**Moon Sanctum Labs** — *Decode. Build. Evolve.*
