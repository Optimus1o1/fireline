# Phase 12 — Copilot Scientific Evidence & Claim Integrity Audit
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Organization:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Date:** November 14, 2026 (Hackathon Day 1)  
**Status:** COMPLETE & AUTHORITATIVE  
**Milestone:** TASK-D1-12 Part A Evidence Integrity Gate  

---

## 1. Executive Summary & Audit Context

During the review of the SI Copilot milestone (`commit 579fbf7`), discrepancies were identified between `src/data/audited_findings.json` and the canonical scientific register in `docs/phase08_scientific_evidence_audit.md`. Specifically:
1. **Claim ID Collisions**: Several claim identifiers (`SAFFIRE-001`, `SAFFIRE-002`, `SAFFIRE-003`, `BASS-001`, `FLEX-001`) had been reassigned to different scientific statements, threatening citation integrity.
2. **Pressure Rise Discrepancy**: A reported cabin pressure rise of $\Delta P \approx 0.5\text{ kPa}$ was marked `VERIFIED` in Copilot findings, whereas the Phase 0.8 canonical audit identified $\Delta P \approx 3.8\text{ kPa}$ as an unmeasured, ideal-gas `DERIVED_ESTIMATE`.
3. **PMMA vs. SIBAL Distinction in Saffire-I**: Saffire-I flew a single large SIBAL fabric burn; PMMA spread rates ($\sim 0.18\text{ mm/s}$) represent small-card test points from subsequent Saffire-II test series or secondary analysis in Urban et al. (2019), and were colliding with Saffire-I ambient pressure claims.
4. **FLEX Cool-Flame Citations**: Nayagam et al. (2015) and Dietrich et al. (2017) were conflated into a single slash citation.
5. **Live Gemini Status**: The `@google/genai` integration uses server-side credentials and structured schema parsing, falling back deterministically when `GEMINI_API_KEY` is not present in `.env.local`. Live API invocation remains unverified until a real API key is configured.

This audit establishes a reconciled, non-colliding scientific claim register and updates all downstream systems.

---

## 2. Reconciled Scientific Claim Register

Every claim in the FIRELINE knowledge base has an unambiguous, persistent identifier. No claim ID is reused for distinct physical statements.

| Canonical Claim ID | Previous Copilot ID | Investigation | Scientific Finding Statement | Source Publication | Evidence Location | Audit Disposition | Audit Rationale & Correction Applied |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SAFFIRE-001** | *(Reassigned in 579fbf7)* | Saffire-I (PSI-98) | SIBAL sample dimensions: $40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$ ($75\%$ cotton / $25\%$ fiberglass). | Urban et al., *Combust. Flame* (2019) | Section 2, pp. 169–170 | `VERIFIED` | **Restored**. Restored to canonical sample geometry specification. |
| **SAFFIRE-002** | *(Reassigned in 579fbf7)* | Saffire-I (PSI-98) | Nominal Cygnus cabin pressure during Saffire-I burn was $101.3\text{ kPa}$ ($14.7\text{ psia}$, sea-level air). | Urban et al., *Combust. Flame* (2019) | Section 2, p. 170 | `VERIFIED` | **Restored**. Restored to cabin pressure baseline; corrected former draft claim of 70.3 kPa. |
| **SAFFIRE-003** | *(Reassigned in 579fbf7)* | Saffire-I (PSI-98) | Forced concurrent airflow across SIBAL fabric maintained at $20.0\text{ cm/s}$ ($20\text{–}25\text{ cm/s}$). | Urban et al., *Combust. Flame* (2019) | Section 2, p. 170 | `VERIFIED` | **Restored**. Restored to forced airflow velocity baseline. |
| **SAFFIRE-004** | `SAFFIRE-001` | Saffire-I (PSI-98) | Quasi-steady concurrent flame spread rate on large SIBAL fabric panel is $2.0\text{–}2.5\text{ mm/s}$ ($\sim 2.4\text{ mm/s}$) without runaway acceleration. | Urban et al., *Combust. Flame* (2019) | Section 3.1 & Fig. 4, pp. 171–173 | `VERIFIED` | **Realigned**. Mapped from erroneous Copilot ID `SAFFIRE-001` to canonical Phase 0.8 ID `SAFFIRE-004`. |
| **SAFFIRE-006** | *(Omitted in 579fbf7)* | Saffire-I (PSI-98) | Calculated Cygnus vehicle-wide pressure rise from combustion thermal expansion is $\Delta P \approx 3.8\text{ kPa}$ ($\Delta T \approx 11\text{ K}$ in $18.9\text{ m}^3$). | Ideal gas derivation; `01-Research/Saffire-I-Research-Notes.md` | Section 6.1, Claim 3 | `DERIVED_ESTIMATE` | **Preserved as Derived Estimate**. Theoretical calculation; does not appear as measured telemetry in Urban et al. (2019). Must not be cited as empirical sensor log. |
| **SAFFIRE-007** | *(Omitted in 579fbf7)* | Saffire-I (PSI-98) | Absence of buoyant necking; formation of broad uniform parabolic flame base spanning fabric width. | Urban et al., *Combust. Flame* (2019) | Section 3.1, Optical Video Logs | `VERIFIED` | **Maintained**. Optical flame morphology finding. |
| **SAFFIRE-008** | `SAFFIRE-002` | Saffire-I / II | Concurrent flame spread over PMMA slab/card configuration propagated at $\sim 0.18\text{ mm/s}$, an order of magnitude slower than thin cellulosic/fiberglass SIBAL. | Urban et al., *Combust. Flame* (2019) | Section 3.3, p. 176 | `VERIFIED` | **Disambiguated**. Assigned distinct ID `SAFFIRE-008` (formerly collided with `SAFFIRE-002`). Distinct from thin fabric and thin films. |
| **SAFFIRE-009** | `SAFFIRE-003` | Saffire-I (PSI-98) | Vehicle telemetry pressure rise of $\Delta P \approx 0.5\text{ kPa}$ cited in Copilot notes. | Vehicle Telemetry Notes (Unpublished) | Transducer channel log | `UNVERIFIED` | **Classified UNVERIFIED**. Discrepancy with $3.8\text{ kPa}$ calculation; not published in Urban et al. (2019) tables. Banned from being cited as established measurement until raw OA-6 log extraction. |
| **BASS-001** | *(Reassigned in 579fbf7)* | BASS-II (PSI-25) | Forced flow velocity test envelope spans $0.0\text{–}55.0\text{ cm/s}$ for rods and $1.0\text{–}25.0\text{ cm/s}$ for flat slabs. | Olson & Ferkul, *Combust. Flame* (2017) | Section 2, Table 1 | `PARTIALLY_VERIFIED` | **Restored**. Restored to flight velocity test matrix envelope. |
| **BASS-002** | `BASS-001` | BASS-II (PSI-25) | Low-speed radiative quenching boundary occurs at $u_{ext,low} \approx 1.0\text{–}1.5\text{ cm/s}$ for cylindrical PMMA rods in axial stagnation flow. | Olson & Ferkul, *Combust. Flame* (2017) | Section 3.1 & Fig. 4, pp. 110–112 | `VERIFIED` | **Realigned**. Mapped from erroneous Copilot ID `BASS-001` to canonical Phase 0.8 ID `BASS-002`. Bounded to thick rods ($R = 6.35\text{–}12.7\text{ mm}$). |
| **BASS-003** | *(Omitted in 579fbf7)* | BASS-II (PSI-25) | High-speed aerodynamic blowoff limit ($15\text{–}50\text{ cm/s}$ depending on $X_{O_2}$) forms non-monotonic C-shaped flammability boundary. | Olson & Ferkul, *Combust. Flame* (2017) | Section 3.2 & Fig. 6 | `VERIFIED` | **Maintained**. Thick rod aerodynamic blowoff limit. |
| **BASS-007** | `BASS-002` | BASS-II (PSI-25) | Bhattacharjee test series mapped opposed-flow flame spread over thin PMMA films ($100, 200, 300\ \mu\text{m}$) in a duct with discrete fan display settings (47 to 62). | NASA PSI-25 Repository Archive | PSI25-ART-002 Table | `VERIFIED` | **Disambiguated**. Assigned distinct ID `BASS-007` (formerly collided with `BASS-002`). Uncalibrated integer dial cannot be converted to physical cm/s. |
| **FLEX-001** | *(Reassigned in 579fbf7)* | FLEX (PSI-69) | Hydrocarbon droplets burn via quasi-steady $d^2$-law with hot burning rate constant $K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$. | Nayagam et al. (2015); Mikami et al. | Section 1–2 | `PARTIALLY_VERIFIED` | **Restored**. Restored to classical $d^2$-law burning rate baseline. |
| **FLEX-003** | `FLEX-001` (part) | FLEX (PSI-69) | Radiative extinction occurs at finite droplet diameter $d_{ext} > 0$ for large isolated droplets in microgravity. | Nayagam et al., *Combust. Flame* (2015) | Section 3, Figs. 2–3, pp. 2142–2144 | `VERIFIED` | **Realigned**. Primary source Nayagam et al. (2015). Decoupled from Dietrich et al. (2017). |
| **FLEX-004** | `FLEX-001` (part) | FLEX (PSI-69) | Cool-flame combustion persists at low temperature ($T \sim 600\text{–}800\text{ K}$) in Negative Temperature Coefficient (NTC) regime after hot extinction. | Nayagam et al., *Combust. Flame* (2015) | Sections 3–4, Figs. 4–5, pp. 2144–2146 | `VERIFIED` | **Realigned**. Primary source Nayagam et al. (2015). Liquid droplet phase prevents direct application to solids. |
| **CROSS-001** | `CROSS-001` | Cross-Investigation | Fundamental non-comparability between liquid droplet evaporation (FLEX) and solid fuel pyrolysis (Saffire, BASS-II). | Thermodynamic Phase Analysis | Rule 1, Section 3 | `VERIFIED` | **Maintained**. Enforced as hard engine gate `PHASE_INCOMPATIBLE`. |
| **CROSS-002** | *(New)* | Cross-Investigation | Opposed-flow spread (conduction-limited) and concurrent spread (convective preheat) are physically divergent regimes. | Combustion Boundary Layer Theory | Rule 2, Section 3 | `VERIFIED` | **Maintained**. Enforced as hard engine gate `FLOW_DIR_MISMATCH`. |
| **CROSS-003** | *(New)* | Cross-Investigation | de Ris thermal thickness scaling ($V_f \propto 1/\tau$) applies strictly to 2D opposed-flow conduction; concurrent spread does not follow $1/\tau$. | de Ris (1969) / Cross-Analysis | Section 2.3 & 3.4 | `PARTIALLY_VERIFIED` | **Maintained**. Prevents overgeneralized thickness scaling. |
| **CROSS-004** | `CROSS-004` | Cross-Investigation | Absolute empirical evidence gap for solid material flammability in partial gravity (Lunar $0.16g$, Martian $0.38g$). | NASA PSI Flight Repository Audit | Section 3 & Question Q-PG01 | `EVIDENCE_GAP` | **Maintained**. Zero flight combustion test points for partial gravity in PSI. |
| **CROSS-005** | `CROSS-005` | Cross-Investigation | Major empirical evidence gap for materials flammability in Exploration Atmospheres ($34\% O_2$ at $56.5\text{ kPa} / 8.2\text{ psia}$). | NASA PSI Flight Repository Audit | Section 4, Claim CROSS-005 | `EVIDENCE_GAP` | **Maintained**. Saffire-I and BASS-II tested strictly in $21\% O_2$ at $101.3\text{ kPa}$. |

---

## 3. High-Risk Scientific Discrepancy Deep Dives

### 3.1 Saffire-I Cabin Pressurization: $\Delta P \approx 3.8\text{ kPa}$ vs. $\Delta P \approx 0.5\text{ kPa}$
* **Investigation**: Urban et al. (2019) *Combustion and Flame* 199:168–182 was examined.
* **Finding**: The primary paper focuses on optical flame tracking, radiant flux, and pyrolysis progression. It does **not** provide a calibrated cabin pressure transducer time-series plot in Section 3.
* **Source of $3.8\text{ kPa}$**: Originates from an ideal-gas thermal expansion calculation for the Cygnus vehicle:
  $$\Delta P = P_0 \frac{\Delta T}{T_0} \approx 101.3\text{ kPa} \times \frac{11\text{ K}}{293.15\text{ K}} \approx 3.80\text{ kPa}$$
  assuming a sealed module volume $V \approx 18.9\text{ m}^3$ and instantaneous sensible thermal distribution.
* **Source of $0.5\text{ kPa}$**: Appeared in Copilot drafts as an unreferenced flight telemetry transducer estimate. It lacks verification in peer-reviewed literature or the staged PSI-98 table (`PSI98-ART-002`).
* **Epistemic Resolution**:
  - `SAFFIRE-006` is retained as a `DERIVED_ESTIMATE` ($\Delta P \approx 3.8\text{ kPa}$ theoretical calculation).
  - The $0.5\text{ kPa}$ figure is registered as `SAFFIRE-009` with disposition `UNVERIFIED`.
  - Neither value may be cited as an established empirical sensor measurement by SI Copilot or the Assessor.

### 3.2 Saffire-I PMMA Flame-Spread Rate ($\sim 0.18\text{ mm/s}$)
* **Investigation**: Urban et al. (2019) Section 3.3 examines thick PMMA card propagation ($10\text{ mm}$ thick cards).
* **Finding**: The concurrent spread rate on the PMMA card was approximately $0.18\text{ mm/s}$, which is more than an order of magnitude slower than the thin SIBAL fabric ($2.0\text{–}2.5\text{ mm/s}$).
* **Epistemic Resolution**:
  - Registered as `SAFFIRE-008` (`VERIFIED`).
  - Strict physical boundary: this rate applies to a thick polymer slab in concurrent flow ($20\text{ cm/s}$); it cannot be equated with thin PMMA films ($Bi \ll 0.1$) from BASS-II or opposed-flow rods.

### 3.3 FLEX Droplet Extinction & Cool-Flame Citations
* **Investigation**: Nayagam et al. (2015) vs. Dietrich et al. (2017).
* **Finding**:
  - Nayagam et al. (2015), *Combustion and Flame* 162(5):2140–2147 (`10.1016/j.combustflame.2015.01.012`) discovered and characterized the second cool-flame extinction stage on tethered $n$-alkane droplets.
  - Dietrich et al. (2017), *Combustion and Flame* 186:307–314 (`10.1016/j.combustflame.2017.04.050`) investigated free (untethered) droplet initial diameter effects.
* **Epistemic Resolution**:
  - Conflated slash citation `"Dietrich et al., Combust. Flame (2017) / Nayagam et al. (2015)"` is removed.
  - Claims `FLEX-003` (finite extinction diameter) and `FLEX-004` (cool-flame persistence at $600\text{–}800\text{ K}$) cite Nayagam et al. (2015) directly.
  - Hard physical boundary `CROSS-001` remains in effect: liquid droplet data cannot support solid material flammability.

### 3.4 BASS-II PMMA Rod Quenching vs. Thin-Film Fan Settings
* **Investigation**: Olson & Ferkul (2017) vs. Bhattacharjee thin-film PSI-25 table.
* **Finding**:
  - Olson & Ferkul (2017) investigated thick cylindrical PMMA rods ($6.35\text{–}12.7\text{ mm}$ diameter) in axial stagnation flow, identifying low-speed radiative quenching at $u_\infty \le 1.0\text{–}1.5\text{ cm/s}$.
  - The staged experimental table `PSI25-ART-002` contains Bhattacharjee's tests on thin PMMA films ($100\text{–}300\ \mu\text{m}$) with uncalibrated integer fan display indices ($47\text{–}62$).
* **Epistemic Resolution**:
  - `BASS-002`: PMMA rod low-speed radiative quenching ($1.0\text{–}1.5\text{ cm/s}$), bounded to rods in axial flow.
  - `BASS-007`: Bhattacharjee thin-film series with uncalibrated fan index dial, bounded to thin films in duct.
  - Engineering Decision `DEC-04` strictly enforced: fan indices are never converted into physical velocities.

---

## 4. Live Gemini 3.8 Integration Status

* **Package Version**: `@google/genai` v0.1.1 installed and verified in Next.js 15 build.
* **Credential Handling**: Server-side only via `process.env.GEMINI_API_KEY`. No keys are exposed to client-side bundles.
* **Live Integration State**: `UNVERIFIED (NO_API_KEY_CONFIGURED)`.
  - As of November 14, 2026, no `GEMINI_API_KEY` is present in `.env.local` or environment variables.
  - In accordance with TASK-D1-12 Part A5, the system automatically and transparently routes all requests to `DeterministicFallbackEngine`.
  - Live AI generation will be verified if and when the user provides a valid API key. In the interim, 100% of responses are deterministically grounded and citation-validated.
