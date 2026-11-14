# Final Scientific Reference & Data Integrity Audit
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Organization:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Lead Developer & Scientific Data Engineer:** Aniket Nandi (Kolkata, IST)  
**Date:** November 14, 2026 (Hackathon Day 1 — Final Release Milestone)  
**Status:** COMPLETE, AUTHORITATIVE & DEFENDED  

---

## 1. Executive Summary & Epistemic Statement

FIRELINE is a scientific research intelligence and evidence decision-support system designed for the NASA Space Apps Challenge 2026 (*Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*).

### Non-Negotiable Epistemic Principles:
1. **Evidence-First Retrieval:** FIRELINE evaluates the availability, comparability, and relevance of experimental research evidence. It **does not certify spacecraft fire safety** and **does not compute fire-risk probabilities**.
2. **Representative Subset Disclosure:** The current production deployment ingests a rigorously validated representative subset of NASA Physical Sciences Informatics (PSI) archives—specifically 9 flight records across Saffire-I (`PSI-98`) and BASS-II (`PSI-25`), and 20 literature claims across Saffire-I, BASS-II, FLEX (`PSI-69`), and cross-investigation combustion mechanics. It does not represent full bulk ingestion of the multi-terabyte NASA PSI data repository.
3. **Epistemic Classification Hierarchy:**
   - `SUPPORTED`: Direct factual statements supported by indexed, peer-reviewed flight observations.
   - `INFERRED`: Qualified physical projections based on dimensionless boundary layer scaling, requiring explicit thermal Biot or flow direction assumptions.
   - `EVIDENCE_GAP`: Parameter regimes lacking empirical flight test data (e.g. $34\% O_2$ Exploration Atmospheres, Lunar $0.16g$, Martian $0.38g$).

---

## 2. Ingested Data Inventory & Provenance

### 2.1 Empirical Experimental Records (`src/data/empirical_records.json`)

All 9 empirical records originate directly from NASA PSI repository artifacts, preserved with cryptographic integrity and source row traceability:

| Record ID | Investigation Code | Official Persistent DOI | Primary NASA Source Artifact | File SHA-256 Checksum | Ingested Rows | Fuel Material | Verified Geometry | Physical Conditions | Audit Disposition |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `saffire-S1` | `PSI-98` | `10.60555/0t15-1243` | `PSI98-ART-002_experimental_table.csv` | `980AD11C634B7B0E6CAFBD3D3B883AEBA8CDE63A14E377AA3DD070C1D5F5AF52` | Row 1 | SIBAL Fabric | Large Fabric Panel ($40.6 \times 94\text{ cm}$) | $101.3\text{ kPa}$, $21.5\text{–}21.7\% O_2$, $20\text{ cm/s}$ flow | `VALID_RECORD` |
| `saffire-S2` | `PSI-98` | `10.60555/0t15-1243` | `PSI98-ART-002_experimental_table.csv` | `980AD11C634B7B0E6CAFBD3D3B883AEBA8CDE63A14E377AA3DD070C1D5F5AF52` | Row 2 | SIBAL Fabric | Large Fabric Panel ($40.6 \times 94\text{ cm}$) | $101.3\text{ kPa}$, $\sim 21.5\% O_2$, $20\text{ cm/s}$ flow | `VALID_RECORD` |
| `saffire-F1C1/F1C2` | `PSI-98` | `10.60555/0t15-1243` | `PSI98-ART-002_experimental_table.csv` | `980AD11C634B7B0E6CAFBD3D3B883AEBA8CDE63A14E377AA3DD070C1D5F5AF52` | Row 3 | Pre-test flow visulation | Diagnostic flow duct | Aerodynamic flow calibration only | `REQUIRES_REVIEW` |
| `saffire-F2C1/F2C2` | `PSI-98` | `10.60555/0t15-1243` | `PSI98-ART-002_experimental_table.csv` | `980AD11C634B7B0E6CAFBD3D3B883AEBA8CDE63A14E377AA3DD070C1D5F5AF52` | Row 4 | Pre-test flow visulation | Diagnostic flow duct | Aerodynamic flow calibration only | `REQUIRES_REVIEW` |
| `bass-B1` | `PSI-25` | `10.60555/4qc4-de67` | `PSI25-ART-002_experimental_table.csv` | `73CA301235FBCFD29B8502206B1DBF248DEAE44CE4FE7BF1379BC58AE40602F8` | Row 1 | $100\ \mu\text{m}$ PMMA film | Thin Film ($Bi \ll 0.1$) | $101.3\text{ kPa}$, $21\% O_2$, Fan index: 62 | `VALID_RECORD` |
| `bass-B2` | `PSI-25` | `10.60555/4qc4-de67` | `PSI25-ART-002_experimental_table.csv` | `73CA301235FBCFD29B8502206B1DBF248DEAE44CE4FE7BF1379BC58AE40602F8` | Row 2 | $200\ \mu\text{m}$ PMMA film | Thin Film ($Bi \ll 0.1$) | $101.3\text{ kPa}$, $21\% O_2$, Fan index: 62 | `VALID_RECORD` |
| `bass-B3` | `PSI-25` | `10.60555/4qc4-de67` | `PSI25-ART-002_experimental_table.csv` | `73CA301235FBCFD29B8502206B1DBF248DEAE44CE4FE7BF1379BC58AE40602F8` | Row 3 | $300\ \mu\text{m}$ PMMA film | Thin Film ($Bi \ll 0.1$) | $101.3\text{ kPa}$, $21\% O_2$, Fan index: 61 | `VALID_RECORD` |
| `bass-B4` | `PSI-25` | `10.60555/4qc4-de67` | `PSI25-ART-002_experimental_table.csv` | `73CA301235FBCFD29B8502206B1DBF248DEAE44CE4FE7BF1379BC58AE40602F8` | Row 4 | $100\ \mu\text{m}$ PMMA film | Thin Film ($Bi \ll 0.1$) | $101.3\text{ kPa}$, $21\% O_2$, Fan index: 47 | `VALID_RECORD` |
| `bass-B5` | `PSI-25` | `10.60555/4qc4-de67` | `PSI25-ART-002_experimental_table.csv` | `73CA301235FBCFD29B8502206B1DBF248DEAE44CE4FE7BF1379BC58AE40602F8` | Row 5 | $200\ \mu\text{m}$ PMMA film | Thin Film ($Bi \ll 0.1$) | $101.3\text{ kPa}$, $21\% O_2$, Fan index: 59 | `VALID_RECORD` |

---

## 3. Audited Literature Claims & Epistemic Boundaries

### 3.1 Saffire-I Investigation (`PSI-98`)
* **`SAFFIRE-001` (`VERIFIED`)**: SIBAL specimen dimensions: $40.6\text{ cm} \times 94.0\text{ cm} \times 0.4\text{ mm}$ ($75\%$ cotton / $25\%$ fiberglass). Urban et al., *Combustion and Flame* 199 (2019) 168–182, Section 2.
* **`SAFFIRE-002` (`VERIFIED`)**: Cygnus cabin pressure: $101.3\text{ kPa}$ ($14.7\text{ psia}$, nominal post-unberth air). Urban et al. (2019), Section 2.
* **`SAFFIRE-003` (`VERIFIED`)**: Forced concurrent airflow actively maintained at $20.0\text{ cm/s}$ ($20\text{–}25\text{ cm/s}$ envelope). Urban et al. (2019), Section 2.
* **`SAFFIRE-004` (`VERIFIED`)**: Quasi-steady concurrent flame spread rate on SIBAL: $2.0\text{–}2.5\text{ mm/s}$ ($\sim 2.4\text{ mm/s}$) without runaway acceleration. Urban et al. (2019), Section 3.1 & Fig. 4.
* **`SAFFIRE-006` (`DERIVED_ESTIMATE`)**: Cabin pressure rise $\Delta P \approx 3.8\text{ kPa}$ ($\Delta T \approx 11\text{ K}$ in $18.9\text{ m}^3$). Ideal gas thermal derivation. NOT an empirical sensor log in Urban et al. (2019).
* **`SAFFIRE-007` (`VERIFIED`)**: Absence of buoyant necking in microgravity; formation of broad uniform parabolic flame base. Urban et al. (2019), Section 3.1.
* **`SAFFIRE-008` (`VERIFIED`)**: Concurrent flame spread over PMMA card propagated at $\sim 0.18\text{ mm/s}$, an order of magnitude slower than thin cellulosic/fiberglass SIBAL. Urban et al. (2019), Section 3.3.
* **`SAFFIRE-009` (`UNVERIFIED`)**: Transient pressure rise of $\Delta P \approx 0.5\text{ kPa}$ cited in preliminary telemetry notes. Barred from empirical citation.

### 3.2 BASS-II Investigation (`PSI-25`)
* **`BASS-001` (`PARTIALLY_VERIFIED`)**: Forced flow velocity test envelope spanned $0.0\text{–}55.0\text{ cm/s}$ (rods) and $1.0\text{–}25.0\text{ cm/s}$ (slabs). Olson & Ferkul, *Combustion and Flame* 183 (2017) 107–116, Section 2.
* **`BASS-002` (`VERIFIED`)**: Low-speed radiative quenching boundary occurs at $u_\infty \approx 1.0\text{–}1.5\text{ cm/s}$ for cylindrical PMMA rods in axial stagnation flow. Olson & Ferkul (2017), Section 3.1 & Fig. 4.
* **`BASS-003` (`VERIFIED`)**: Aerodynamic blowoff limits ($15\text{–}50\text{ cm/s}$) mapping non-monotonic C-shaped flammability boundary on thick rods. Olson & Ferkul (2017), Section 3.2 & Fig. 6.
* **`BASS-007` (`VERIFIED`)**: Thin PMMA films ($100\text{–}300\ \mu\text{m}$) tested with discrete fan display settings ($47\text{–}62$). NASA PSI `PSI25-ART-002`. Uncalibrated integer dial cannot be converted to physical cm/s (`DEC-04`).

### 3.3 FLEX Investigation (`PSI-69`)
* **`FLEX-001` (`PARTIALLY_VERIFIED`)**: Hydrocarbon droplets obey quasi-steady $d^2$-law with hot burning rate $K \approx 0.5\text{–}0.7\text{ mm}^2/\text{s}$. Nayagam et al. (2015), *Combust. Flame* 162:2140–2147.
* **`FLEX-003` (`VERIFIED`)**: Large isolated alkane droplets extinguish radiatively at finite diameters ($d_{ext} > 0$). Nayagam et al. (2015), Section 3, Figs. 2–3.
* **`FLEX-004` (`VERIFIED`)**: Second-stage low-temperature cool-flame combustion persists at $T \sim 600\text{–}800\text{ K}$ in NTC region terminating at $d_{ext,cool}$. Nayagam et al. (2015), Sections 3–4.

### 3.4 Cross-Investigation Scaling Rules
* **`CROSS-001` (`VERIFIED`)**: Liquid droplet combustion (FLEX) is non-comparable to solid fuel flammability (`PHASE_INCOMPATIBLE`).
* **`CROSS-002` (`VERIFIED`)**: Opposed-flow spread (conduction) and concurrent spread (convective preheat) are physically divergent regimes (`FLOW_DIR_MISMATCH`).
* **`CROSS-003` (`PARTIALLY_VERIFIED`)**: de Ris thermal thickness scaling ($V_f \propto 1/\tau$) applies strictly to 2D opposed-flow conduction; concurrent spread does not follow simple $1/\tau$.
* **`CROSS-004` (`EVIDENCE_GAP`)**: Absolute empirical evidence gap for solid materials flammability in reduced partial gravity (Lunar $0.16g$ and Martian $0.38g$).
* **`CROSS-005` (`EVIDENCE_GAP`)**: Major empirical evidence gap for materials flammability in Exploration Atmospheres ($34\% O_2$ at $56.5\text{ kPa} / 8.2\text{ psia}$).

---

## 4. Engineering Decisions Enforced

* **`DEC-01` (Saffire-I Thickness Discrepancy)**: Ingested thickness is $0.37\text{ cm}$ ($3.7\text{ mm}$ sample card pack), preserved verbatim from the PSI table. The $0.4\text{ mm}$ fabric weave thickness from Urban et al. (2019) is cross-referenced in limitations.
* **`DEC-02` (FLEX Ingestion Deferral)**: FLEX experimental tabular runs are deferred pending spherical coordinate schema resolution; literature claims are indexed for physical boundary gating.
* **`DEC-03` (NASA Typographical Integrity)**: Typographical string `"flow visulation"` in `PSI98-ART-002` is preserved verbatim to maintain cryptographic auditability with the NASA repository.
* **`DEC-04` (Uncalibrated Fan Display Preservation)**: BASS-II fan display values ($47\text{–}62$) are stored as discrete unitless integers. Converting them into physical velocity (cm/s) without hot-wire calibration curves is strictly prohibited.
* **`DEC-05` (Exploration Atmosphere Hard Epistemic Gate)**: Queries or mission scenarios with $O_2 > 25\%$ or partial gravity ($g > 0$) strictly return `EVIDENCE_GAP`. Algorithmic extrapolation without flight test data is prevented.
