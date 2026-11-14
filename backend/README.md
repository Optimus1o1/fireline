# FIRELINE Scientific Data Validation Backend

Deterministic scientific data contracts and automated validation test suite for NASA Physical Sciences Informatics (PSI) microgravity combustion data.

## Initial Scope (P0 / P1)
- **Saffire-I (`PSI-98`)**: Specimen metadata table and environmental conditions.
- **BASS-II (`PSI-25`)**: Subrata Bhattacharjee thin PMMA film test series.
- **Provenance & Safeguards**: Source tracking, dual unit preservation, and strict physical gating.

## Running Tests
From `backend/`:
```bash
pytest
```
