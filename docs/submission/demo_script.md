# FIRELINE Video Demonstration & Presentation Script

**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall  
**Agency:** Moon Sanctum Labs (*Decode. Build. Evolve.*)  
**Presenter:** Aniket Nandi (Lead Developer & Designer, Kolkata, IST)  
**Target Duration:** 3:30 – 3:50 minutes  
**Format:** Screen Recording + Voiceover Narration

---

## Scene 1: Introduction & The Freefall Dilemma (0:00 – 0:30)

### Visuals
- Camera starts on NASA Space Apps Challenge banner, transitions smoothly to the FIRELINE Mission Control Dashboard (`http://localhost:3000/` or live production URL).
- Deep Ink dark-mode interface with Copper and Bone accents.
- Mouse hovers over the core metric cards: *9 Validated NASA PSI Runs*, *20 Peer-Reviewed Findings*, *7 Thermodynamic Gates*.

### Speaker Narration
> *"Welcome to FIRELINE. In the vacuum and freefall of space, fire behaves like an alien beast. On Earth, gravity creates buoyancy, pulling hot air up and feeding fresh oxygen to flames. In microgravity, buoyancy vanishes. Flames become spherical, reaction zones broaden, and fires can smolder undetected in sluggish cabin airflows.*  
>  
> *For decades, NASA has gathered invaluable microgravity combustion data across Saffire, BASS, and FLEX. But this research has been locked away in fragmented spreadsheets and technical reports. Today, Moon Sanctum Labs presents FIRELINE: an evidence-grounded, Super Intelligence decision-support engine engineered to safeguard human spaceflight."*

---

## Scene 2: Primary Evidence Explorer & Deep Provenance (0:30 – 1:15)

### Visuals
- User clicks **"Explore Evidence"** in the top navigation bar, arriving at `/explore`.
- Fast client-side search: User types `"SIBAL"` in the search bar. The table immediately narrows down to Saffire-I flight runs (`PSI98-F1C1/F1C2`).
- User clicks on `PSI98-F1C1/F1C2` to open the deep evidence drawer.
- Camera zooms slightly into the provenance card: Specimen Dimensions ($400 \times 940 \times 0.4\text{ mm}$), Ambient Pressure ($100.0\text{ kPa}$), Flow Velocity ($20.0\text{ cm/s}$), peer-reviewed DOI link (`10.1016/j.combustflame.2019.04.015`), and SHA-256 integrity checksum.
- User toggles the filter to **BASS-II**, showing PMMA thin films, and highlights the raw `fan_display_index: 62` preserved without uncalibrated velocity conversion (`DEC-04`).

### Speaker Narration
> *"Let's begin in the Evidence Explorer. Here, flight controllers and researchers can search verified empirical records directly from NASA's Physical Sciences Informatics repository.*  
>  
> *Notice our Saffire-I flight record: complete specimen geometry, forced convective velocity, and primary DOI citations. Every record is cryptographically verified with a SHA-256 hash. And notice our strict engineering principles: for BASS-II, where fan airflow was recorded as a discrete dial reading of 62, we preserve that raw data rather than converting it to an unverified airspeed. In life-critical spaceflight, we never guess."*

---

## Scene 3: The 7-Gate Physical Comparability Engine (1:15 – 2:00)

### Visuals
- User selects Saffire-I `PSI98-F1C1/F1C2` (SIBAL fabric sheet) and BASS-II `PSI25-B1` (PMMA thin film) for side-by-side comparison.
- Clicks **"Execute Physical Comparability Check"**.
- The 7-Gate Comparability Matrix instantly renders:
  - Gate 1 (Regime): `PASSED` (Both solid opposed spread)
  - Gate 2 (Material): `FAILED` (Cellulosic blend vs Thermoplastic)
  - Gate 3 (Geometry & Biot Number): `FAILED` (Thermally thick slab vs Thermally thin film)
  - Gate 4 (Flow): `WARNING` (Calibrated 20 cm/s vs Dial Index 62)
  - Gates 5, 6, 7 (Pressure, Oxygen, Orientation): `PASSED`
- Prominent badge displays: **`INCOMPARABLE`** with detailed physical explanation text.

### Speaker Narration
> *"In terrestrial laboratories, engineers often try to extrapolate findings across materials. In space, that can be fatal. FIRELINE prevents invalid extrapolation through our deterministic 7-Gate Physical Comparability Engine.*  
>  
> *When we compare Saffire's large SIBAL cotton fabric against BASS-II's ultra-thin PMMA film, conventional AI might say 'both are solid fuels in microgravity'. But FIRELINE evaluates the physics: it flags a material failure due to charring kinetics, and a geometry failure because the thermal Biot numbers differ fundamentally. FIRELINE classifies these runs as INCOMPARABLE, protecting flight architects from catastrophic scaling errors."*

---

## Scene 4: Exploration Mission Gap Assessor (2:00 – 2:45)

### Visuals
- User navigates to `/assess`.
- User clicks the **"Artemis Lunar Habitat"** exploration preset button.
- The input sliders automatically configure to: Oxygen: $34.0\%$, Pressure: $56.5\text{ kPa}$ ($8.2\text{ psia}$), Flow: $15.0\text{ cm/s}$, Gravity: $0.166\text{ g}$.
- The radar/parameter coverage metric updates instantly: Overall Coverage drops to **32.5%**.
- Two prominent red alert cards appear:
  - **`CRITICAL GAP: Oxygen Enrichment (34.0% vs 21.0% empirical ceiling)`**
  - **`HIGH GAP: Hypobaric Low Pressure (56.5 kPa vs 100 kPa empirical baseline)`**
- Actionable recommendations display: *"Prioritize Saffire-IV/V/VI testing at 34% O2 and 56.5 kPa before Artemis habitat baseline sign-off."*

### Speaker Narration
> *"Now, let's look at the future of human exploration. For the Artemis lunar missions, NASA selected an Exploration Atmosphere: 34% oxygen at a reduced pressure of 56.5 kilopascals, designed to eliminate astronaut pre-breathe times before lunar EVAs.*  
>  
> *When we run Artemis through FIRELINE's Gap Assessor, the system identifies a critical empirical void: NASA microgravity flight tests have only examined normoxic or hypoxic air. No large-scale microgravity fire tests exist at 34% oxygen, where materials burn two to four times faster. FIRELINE highlights this danger and gives NASA engineers an actionable roadmap of specific flight test matrices to close the gap."*

---

## Scene 5: Grounded SI Scientific Copilot (2:45 – 3:25)

### Visuals
- User navigates to `/copilot`.
- User selects the suggested prompt: *"What is the flame spread rate of SIBAL fabric in Saffire-I?"*
- Copilot generates a grounded response in real time:
  - Response displays: *"According to Saffire-I flight run [PSI98-F1C1/F1C2] and peer-reviewed analysis by Urban et al. (2019) [SAFFIRE-001], the flame spread rate was measured at 0.45 mm/s (± 0.05 mm/s)..."*
  - The citation pills `[SAFFIRE-001]` and `[PSI98-F1C1/F1C2]` are highlighted with green checkmarks indicating verification.
- User demonstrates the citation guard: enters a complex query. The interface demonstrates that uncited or speculative assertions are blocked and instantly backed by our deterministic audited evidence engine.

### Speaker Narration
> *"To make this research universally accessible, we built the SI Research Copilot. Powered by Google Gemini and backed by our proprietary Citation Guard, it delivers natural-language scientific intelligence with zero hallucinations.*  
>  
> *Every single statement must cite a canonical Finding ID or NASA Run ID. If a generated claim cannot be verified against audited peer-reviewed literature, FIRELINE immediately intercepts it and replaces it with deterministic empirical text. It provides human flight surgeons with the speed of AI and the reliability of peer-reviewed science."*

---

## Scene 6: Architecture, Rigor & Wrap-up (3:25 – 3:45)

### Visuals
- Quick pan over the architecture diagram and terminal showing `69 passed in 0.24s`.
- Show Next.js 15 production build: `11 routes, 103 kB First Load JS`.
- Closing screen with Moon Sanctum Labs branding:
  - *Moon Sanctum Labs — Decode. Build. Evolve.*
  - *FIRELINE: Safeguarding humanity's journey to the Moon, Mars, and beyond.*
  - *NASA Space Apps Challenge 2026 — Flame in Freefall.*

### Speaker Narration
> *"FIRELINE is production-ready today: built on Next.js 15, verified by 69 automated physical tests, and fully grounded in NASA Physical Sciences Informatics.*  
>  
> *As humanity ventures back to the Moon and on to Mars, we cannot afford to guess about fire. With FIRELINE, we decode the physics, build the safeguards, and evolve space exploration safety. Thank you."*

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
