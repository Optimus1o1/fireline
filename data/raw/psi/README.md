# NASA PSI Raw Data Staging Repository
**Directory**: `data/raw/psi/`  
**Purpose**: Immutable local staging area for genuine NASA Physical Sciences Informatics (PSI) combustion research datasets.  
**Project**: FIRELINE — Fire Intelligence & Research Evidence Linkage Engine  
**Agency**: CIPHER — *Decode. Build. Evolve.*  
**Standard**: Phase 0.95 Source Readiness & Pre-Flight Packaging Architecture  

---

## 1. Staging Principles & Engineering Conventions

All files placed within this staging hierarchy are governed by strict provenance, integrity, and scientific fidelity rules:

1. **Immutable Raw Storage**:
   * Files placed here must remain 100% byte-for-byte identical to their original NASA archive downloads.
   * Never rename, clean, reformat, normalize, or compress raw files in-place.
   * Parsed, filtered, or converted outputs (e.g. Parquet, SQLite, JSON) must be written exclusively to `data/processed/` or database migration fixtures.

2. **Original Filename & Metadata Preservation**:
   * Preserve the exact naming scheme assigned by NASA (e.g., `PSI-98_metadata_PSI-166_SAFFIRE-I.zip`, `PSI-98_Raw Data_SAFFIRE-1_F1C1_DistortionGrids_1280x920_originals.zip`).
   * Every staged artifact must be accompanied by an Artifact Record created using [`docs/phase095_artifact_record_template.md`](../../../docs/phase095_artifact_record_template.md).

3. **Mandatory Cryptographic Verification**:
   * Upon retrieval from `psi.nasa.gov`, calculate and log the SHA-256 checksum and exact byte count in the corresponding manifest before running any ingestion scripts.

4. **Honest Missingness — No Dummy Placeholders**:
   * If an archive, table, or sensor channel has not yet been downloaded, it must remain **completely absent**.
   * **Never create dummy, mock, zero-byte, or simulated test files** within `data/raw/psi/` to make directories appear populated.
   * Empty directories are represented solely by their `README.md`.

5. **Physical Separation of Forms**:
   * **Raw Experimental Data**: Unprocessed flight logs, sensor streams, optical frame sequences.
   * **Experimental Tables**: Curated summary tables provided by the PSI web interface.
   * **Engineering & Calibration**: Grid distortion images, offgassing reports, thermocouple calibration logs.
   * **Synthetic Illustrative Data**: Mock fixtures must **never** enter this directory. All synthetic mock files reside exclusively in `tests/fixtures/synthetic/` and carry explicit non-production headers.

6. **Licensing & Public Domain**:
   * All three core investigations (`PSI-69`, `PSI-25`, `PSI-98`) have been verified as public domain under **CC0-1.0**. Record the license on every retrieved manifest.

---

## 2. Directory Hierarchy

```
data/raw/psi/
├── README.md                      # This root specification document
├── flex/                          # FLEX (PSI-69) Droplet combustion staging
│   └── README.md                  # FLEX manifest, run bindings, and volume notes
├── bass_ii/                       # BASS-II (PSI-25) Solid fuel flammability staging
│   └── README.md                  # BASS-II manifest (film vs. rod test isolation)
└── saffire_i/                     # Saffire-I (PSI-98) Macro-scale fabric burn staging
    └── README.md                  # Saffire-I manifest, run logs, and sensor metadata
```

---

## 3. Retrieval Protocol for Phase 1 (Kickoff Window)

During the official implementation phase (commencing November 14, 2026), files must be retrieved following this protocol:
1. Review the artifact inventory in [`docs/phase095_psi_artifact_inventory.md`](../../../docs/phase095_psi_artifact_inventory.md).
2. Download target files via authenticated or public HTTPS session from `psi.nasa.gov`.
3. Verify file integrity against documented byte sizes.
4. Record SHA-256 checksum in the investigation's sub-manifest.
5. Ingest into FIRELINE using the Phase 1 Python ingestion pipeline.
