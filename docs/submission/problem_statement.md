# The Problem Statement: Fire Safety in Microgravity & Exploration

**NASA Space Apps Challenge 2026**  
**Challenge Track:** Flame in Freefall — SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project:** FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Author:** Moon Sanctum Labs (*Decode. Build. Evolve.*) | Aniket Nandi (Kolkata, IST)

---

## 1. The Physics of Fire in Freefall: Why Earth Intuition Fails

Combustion is fundamentally a coupled process of exothermic chemical reaction and fluid mechanics. On Earth (1-g):
1. Combustion heats surrounding gases, decreasing their density.
2. Gravity creates a buoyant force that rapidly accelerates these hot, low-density gases upward ($\sim 1\text{--}3\text{ m/s}$).
3. This upward buoyant plume draws fresh, oxygen-rich ambient air into the base of the fire, driving rapid upward flame spread.

In orbital freefall (microgravity, $\sim 10^{-6}\text{ g}$):
- **Buoyant convection vanishes completely.** Hot combustion products remain stationary around the fuel surface.
- Heat and oxidizer transport shift from high-speed momentum-driven convection to slow molecular diffusion and forced ventilation drift ($0.05\text{--}0.2\text{ m/s}$).
- Flames become spherical or hemispherical, flame temperatures decrease, soot accumulates into dense radiant agglomerations, and reaction zones expand.
- Critically, **materials that extinguish naturally on Earth can continue to burn or smolder indefinitely in microgravity**, shielded from convective blow-off and sustained by sluggish cabin ventilation currents.

---

## 2. The Danger of Terrestrial Flammability Standards (NASA-STD-6001)

Historically, materials approved for crewed spacecraft are certified using terrestrial laboratory standards—primarily **NASA-STD-6001 Test 1 (Upward Flame Propagation)**:
- A specimen is mounted vertically in a 1-g test chamber and ignited from the bottom in an upward buoyant plume.
- If the flame propagates less than 6 inches (15 cm) and self-extinguishes, the material is deemed "self-extinguishing" and approved for flight.

### The Scientific Pitfall
Decades of orbital research—from the early drop towers to BASS-II and Saffire—have revealed that **1-g upward flammability tests do not reliably predict microgravity flammability**:
- Under low-speed opposed or concurrent convective flow in orbit ($5\text{--}20\text{ cm/s}$), the boundary layer thickness and Damköhler number ($Da$) differ fundamentally from buoyant 1-g plumes.
- Thick materials that fail to propagate upward in 1-g due to convective cooling can sustain slow, insidious, oxygen-fed smoldering in microgravity.
- Thin films that burn quickly on Earth may have vastly lower extinction limits in microgravity due to radiative heat trapping.

Relying on terrestrial standards without consulting microgravity flight data creates an unacceptable safety risk for long-duration deep space exploration.

---

## 3. The Exploration Atmosphere Challenge (Artemis & Mars)

For Apollo, the Space Shuttle, and the International Space Station, spacecraft cabins have operated at sea-level air:
$$\text{ISS Nominal Cabin:} \quad 21.0\%\ \text{O}_2, \quad 101.3\text{ kPa}\ (14.7\text{ psia})$$

However, for deep space exploration—specifically the **NASA Artemis Lunar Gateway & Surface Habitats**—NASA has selected an **Exploration Atmosphere**:
$$\text{Artemis Exploration Atmosphere:} \quad 34.0\%\ \text{O}_2, \quad 56.5\text{ kPa}\ (8.2\text{ psia})$$

### Why this atmosphere?
By reducing total cabin pressure to $56.5\text{ kPa}$ and enriching oxygen to $34.0\%$, the human physiological partial pressure of oxygen ($P_{\text{O}_2} \approx 19.2\text{ kPa}$) is maintained, while nitrogen partial pressure is slashed. This eliminates the multi-hour oxygen pre-breathe protocol previously required before extravehicular activities (EVAs), enabling astronauts to don spacesuits and step onto the lunar surface in minutes rather than hours.

### The Fire Safety Consequence
- At $34\%\ \text{O}_2$, the oxygen molar concentration is **62% higher** than terrestrial air.
- In hyperoxic atmospheres, flame spread rates over solid materials accelerate dramatically, ignition energy thresholds drop, and materials previously considered flame-retardant burn vigorously.
- Crucially: **almost all existing microgravity flight experiments were conducted at normoxic ($21\%$) or hypoxic ($<21\%$) conditions.** There is an acute, unexplored empirical void regarding large-scale solid combustion in low-gravity, hypobaric, hyperoxic exploration cabins.

---

## 4. The Data Fragmentation Barrier in NASA PSI

NASA has invested millions of dollars in microgravity flight research, archiving petabytes of experimental data in the **NASA Physical Sciences Informatics (PSI)** repository.

However, researchers and mission planners face severe data barriers:
1. **Format Heterogeneity:** Saffire data exists in large multi-variable CSVs (`PSI98-ART-002`); BASS-II records are stored in spreadsheet tables with different column conventions (`PSI25-ART-002`); FLEX droplet combustion data is cataloged across separate experimental series.
2. **Missing & Uncalibrated Metrics:** In BASS-II, fan airflow was recorded as an uncalibrated display dial reading (`47–62`) rather than physical velocity ($\text{cm/s}$). Naive data consumers or AI tools routinely convert these numbers into incorrect meters-per-second, producing erroneous physical conclusions.
3. **Derived vs. Measured Confusion:** In Saffire-I, chamber pressure surges are reported in publications as derived combustion model estimates ($\Delta P \approx 3.8\text{ kPa}$) and in telemetry logs as preliminary pressure readings ($0.5\text{ kPa}$). Without rigorous data provenance, these numbers are routinely conflated.
4. **Invalid Cross-Extrapolation:** Engineers searching for fire data often inadvertently compare thin fabrics ($0.05\text{ mm}$ PMMA in BASS-II) with thick structural polymers ($10\text{ mm}$ slabs in Saffire-I), ignoring the fundamental difference in thermal Biot number ($\text{Bi}$) that governs heat conduction.

---

## 5. The Need for FIRELINE

Spaceflight safety boards cannot afford guesswork, ungrounded Large Language Models that hallucinate combustion kinetics, or fragmented spreadsheets.

NASA needs an intelligent, physically grounded decision-support system that:
- Connects directly to verified NASA PSI records.
- Deterministically enforces the laws of thermodynamics and fluid mechanics before comparing experiments.
- Highlights empirical voids in exploration atmospheres (Artemis and Mars).
- Translates complex microgravity combustion science into transparent, citation-grounded intelligence for flight directors and safety engineers.

**This is the challenge FIRELINE was built to solve.**

---
*Moon Sanctum Labs — Decode. Build. Evolve.*
