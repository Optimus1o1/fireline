# Technical Architecture & Engineering Implementation

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Author:** Moon Sanctum Labs (*Decode. Build. Evolve.*) | Aniket Nandi (Kolkata, IST)

---

## 1. Technology Stack Overview

FIRELINE is engineered using modern, robust fullstack web and scientific computing technologies selected for type safety, performance, and deterministic reliability:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / CLIENT                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 15 APPLICATION LAYER                      │
│                                                                        │
│   App Router (v15.5.29)        React Server Components                 │
│   TypeScript 5.7 (Strict)      Tailwind CSS 3.4 Design System          │
│   Suspense Boundaries          103 kB First Load JS Bundle             │
│                                                                        │
│   Pages:                                                               │
│   • / (Dashboard)              • /assess (Mission Gap Assessor)        │
│   • /explore (Evidence)        • /copilot (SI Research Assistant)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Internal In-Memory Pipeline
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     REST API & COMPUTATION ENGINE                      │
│                                                                        │
│   Route Handlers (/api/):                                              │
│   • GET  /api/investigations   • POST /api/evidence/compare            │
│   • GET  /api/evidence/search  • POST /api/assess                      │
│   • GET  /api/evidence/[id]    • POST /api/copilot/explain             │
│                                                                        │
│   Core Engines:                                                        │
│   • 7-Gate Comparability Matrix                                        │
│   • Atmospheric Boundary Intersection Scanner                          │
│   • Citation Verification Regex Guard                                  │
│   • Deterministic Audited Evidence Synthesizer                         │
└───────────────────────────────────┬────────────────────────────────────┘
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     EXTERNAL AI INTEGRATION       │ │       VERIFIED DATA CORPUS        │
│                                   │ │                                   │
│  Google Gemini 2.5 / 1.5 Flash    │ │  empirical_records.json           │
│  @google/genai SDK (v3.3.0)       │ │  audited_findings.json            │
│  Grounded System Prompts          │ │  Pydantic V2 Ingestion Contracts  │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. Frontend Engineering & Performance Architecture

### 2.1 Next.js 15 App Router & Suspense Architecture
The frontend leverages the latest Next.js 15 App Router paradigms:
- **Zero Layout Shift:** Static shell rendering with instant hydration.
- **Client-Side Suspense Boundaries:** To prevent client-side hydration mismatches and allow Next.js to pre-render static HTML at build time, all components reading dynamic query parameters (`useSearchParams()`)—such as `/assess?preset=artemis_lunar`—are wrapped inside isolated React `<Suspense>` boundaries.
- **Ultra-Lightweight Bundle:** The total First Load JS shared by all routes is only **103 kB**, ensuring rapid page loads even under low-bandwidth satellite links or field conditions.

### 2.2 Design System & Aesthetics (Moon Sanctum Labs Identity)
The user interface implements Moon Sanctum Labs' signature design aesthetic:
- **Typography:** Space Grotesk (technical headings, metrics, and navigation wordmark) paired with Manrope (legible, high-density scientific data tables and body text).
- **Color Palette:**
  - Ink (`#0F1013`): High-contrast, deep dark-mode substrate.
  - Bone (`#F2EFE8`): Clean, accessible foreground typography.
  - Copper (`#E0A45C`): Accent color utilized selectively for physical alerts, flame temperature indicators, and critical gaps.
  - Slate (`#8B9099`): Muted secondary metadata labels.
- **Accessibility:** Full WCAG AA contrast compliance across all interactive charts, badge chips, and data tables.

---

## 3. Scientific Engine Implementations

### 3.1 7-Gate Physical Comparability Algorithm (`/api/evidence/compare`)
The physical comparability route executes in $\mathcal{O}(1)$ time with zero external network dependencies:
1. Ingests `record_a_id` and `record_b_id`.
2. Fetches records from the immutable `empirical_records.json` store.
3. Evaluates all 7 gates sequentially:
   - Evaluates material taxonomy match.
   - Evaluates Biot number and thickness regime ($\tau_A$ vs $\tau_B$).
   - Calculates relative flow velocity delta $\Delta v = |v_A - v_B| / v_A$.
   - Calculates pressure difference $\Delta P = |P_A - P_B|$.
   - Calculates oxygen mole fraction delta $\Delta \text{O}_2 = |\% \text{O}_{2,A} - \% \text{O}_{2,B}|$.
   - Evaluates aerodynamic burn orientation vector.
4. Determines overall classification tier and compiles physical synthesis explanation.

### 3.2 Atmospheric Exploration Gap Assessor (`/api/assess`)
1. Ingests target mission profile (`scenario_id` or custom parameters: $\% \text{O}_2$, $P$, $v_{\text{flow}}$, $g$).
2. Compares inputs against empirical convex hull of NASA PSI microgravity data ($16.3\%\text{--}21.0\%\ \text{O}_2$, $97.9\text{--}101.4\text{ kPa}$, $0.0\text{--}20.0\text{ cm/s}$).
3. Emits quantitative coverage percentages and generates prioritized testing matrices.

---

## 4. SI Copilot: Grounding & Citation Guard

### 4.1 Hybrid Generative & Deterministic Pipeline
The SI Copilot guarantees zero unverified assertions through an automated verification pipeline:

```
[ User Prompt: "What is SIBAL burn rate in microgravity?" ]
                         │
                         ▼
        [ Step 1: Algorithmic Evidence Search ]
       Matches: PSI98-F1C1/F1C2 & SAFFIRE-001
                         │
                         ▼
        [ Step 2: Context-Constrained Prompting ]
       System Prompt: "Cite [SAFFIRE-001]. No uncited claims."
                         │
                         ▼
        [ Step 3: Google Gemini API Invocation ]
       Gemini 2.5 Flash / 1.5 Flash Generation
                         │
                         ▼
        [ Step 4: Regex Citation Verification Guard ]
       Checks for canonical tokens: /\[(SAFFIRE-\d+|BASS-\d+|FLEX-\d+|PSI\d+-[^\]]+)\]/g
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
 [ Citations Valid ]              [ Missing / Invalid ]
       │                                   │
       │                                   ▼
       │                    [ Trigger Deterministic Fallback ]
       │                    Substitute audited findings summary
       │                                   │
       └─────────────────┬─────────────────┘
                         ▼
    [ Final Grounded JSON Response Delivered to User ]
```

### 4.2 Zero-Downtime Offline Fallback
If the Google Gemini API key is missing, network access is severed, or rate limits are reached, the system catches the error gracefully and immediately delivers the deterministic audited evidence synthesis. The user is never presented with a broken screen or error modal.

---

## 5. Deployment & Operational Specifications

- **Target Platform:** Vercel Serverless Edge Network
- **Build Output:** Standalone Next.js Node.js server bundle or Vercel static assets with serverless functions.
- **Regions:** `iad1` (US East - Washington, D.C.) for proximity to NASA Goddard and NASA HQ.
- **Automated Tests:** 69 passing Pytest unit, integration, and adversarial tests ensuring 100% backend reliability before deployment.

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
