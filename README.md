# SQ-12 Analog Sequencer & Synthesiser — Operating Manual

## Table of Contents

1. [Introduction](#1-introduction)
2. [Panel Controls & Architecture](#2-panel-controls--architecture)
3. [The Sequencer Grid](#3-the-sequencer-grid)
4. [CRT Data Screen & Keyboard Transpose](#4-crt-data-screen--keyboard-transpose)
5. [Tutorials & Factory Demo Patches](#5-tutorials--factory-demo-patches)
6. [Technical Specifications](#6-technical-specifications)
7. [Credits & Copyright](#credits--copyright)

---

## 1. Introduction

Welcome to the **SQ-12 Analog Sequencer**, a 12-step control voltage generator and monophonic synthesiser designed as a tribute and homage to classic 1970s Japanese electronic instruments — most notably akin to the legendary Korg MS-10, albeit with an Oberheim feel.

The SQ-12 provides independent three-channel voltage control (**Channels A, B, and C**), allowing you to sequence pitch, filter cutoff frequencies, dynamic volume accents, and non-linear clock modulation simultaneously. A full **VCO / ADSR** voice sits behind the sequencer, giving you waveform, footage/scale, coarse pitch, and envelope shaping alongside the classic step-sequencing workflow — bridging the raw character of vintage hardware with modern browser and mobile flexibility.

---

## 2. Panel Controls & Architecture

The front panel is partitioned into functional zones:

- **CRT Data Screen** (top right)
- **Transport / Clock**
- **Routing & Mode**
- **Oscillator (VCO)**
- **Envelope (ADSR)**
- **The 3×12 Sequencer Grid**
- **Keyboard Transpose / Preview** & **Demo Patches**

<img width="2520" height="860" alt="sq12-top-panel" src="https://github.com/user-attachments/assets/5342e503-ca90-4bef-a28f-e3b3bc4c3fff" />

### 2.1 Logo Badge

At the top left, four small nameplate panels spell out the unit's name as a stylised patch-bay logotype — **S**, **Q**, **1**, **2** ("SQ‑12") — sitting above the `ANALOG SEQUENCER • VCA / GATE` legend. This badge is purely decorative and has no functional role; the only moving part is a small LED dot on the **Q** panel that blinks gently as an ambient "signal peak" accent light.

### 2.2 Transport / Clock

| Control | Function |
| :--- | :--- |
| **Transport Pill** (●  ▶■) | Toggles the internal clock generator on/off. The pill glows red while the sequence is running. |
| **◄ / ►** (Step Buttons) | Manually steps the sequencer backward or forward by one step — works whether the clock is stopped or running. |
| **SPEED** (Rotary) | Sets the master clock tempo — from 40 BPM (fully anti-clockwise) up to 240 BPM (fully clockwise). |
| **PORTA** (Rotary) | Controls the pitch glide time between consecutive steps — from instantaneous stepping (0.01s) to a long, sweeping glissando (0.31s). |

### 2.3 Routing & Mode

| Control | Options | Function |
| :--- | :--- | :--- |
| **STEPS** | `12` / `24` | Sets the sequence length. In `24`, Row A (steps 1–12) chains into Row B (steps 13–24). |
| **MODE** | `STEP` · `CONT` · `ONCE` | `STEP` requires manual advance (`◄`/`►`); `CONT` loops the sequence indefinitely; `ONCE` runs through once and stops. |
| **RANGE** | `±5V` · `±1V` | Scales the CV output of Channels A & B. `±5V` spans 10 octaves for wide pitch jumps; `±1V` spans 2 octaves for fine, precise tuning. |
| **DEST** | `VCF` · `VCA` · `CLK` | Routes Channel C's unipolar voltage to the filter cutoff, the VCA accent level, or the clock-speed modulator. |

> **Note:** Channel C is a unipolar control source (0V to +5V) and always outputs full-range regardless of the `RANGE` switch, which affects only Channels A & B.

### 2.4 Oscillator (VCO)

| Control | Options | Function |
| :--- | :--- | :--- |
| **WAVE** | Triangle · Square · Sawtooth · Sine | Selects the oscillator's waveform, setting the tone's harmonic character. |
| **SCALE** | `32'` · `16'` · `8'` · `4'` | Organ-style footage switch — sets the oscillator's base octave register. |
| **PITCH** | −12 to +12 | Fine-tunes the oscillator in semitones, centered on `0`. |

### 2.5 Envelope (ADSR)

Four knobs shape the VCA's amplitude envelope on every triggered step:

- **ATK (Attack)** — time for the note to reach full volume.
- **DEC (Decay)** — time to fall from peak to the sustain level.
- **SUS (Sustain)** — the held volume level while a step's gate is active.
- **REL (Release)** — time for the note to fade out after the step ends.

---

## 3. The Sequencer Grid

The main matrix consists of 12 vertical step columns and three control-voltage rows, with step LEDs above and trigger/reset jacks below.

<img width="2520" height="1280" alt="sq12-sequencer-grid" src="https://github.com/user-attachments/assets/758f3881-df96-4a72-8a5c-eba01a65fd92" />

*Diagram shows the grid at rest (Step 1), with an example reset patch (lit orange jack) on Step 5, and the keyboard transpose bar with root key C active.*

### 3.1 Step Indicators & Pilot Lights

- **Step LEDs (1–12):** Small indicators above each column illuminate to signal the currently active sequence step.
- **Pilot Dots (CH-A / CH-B):** Green dots to the left of each row label. In 12-Step mode, both remain lit. In 24-Step mode, the **CH-A** dot lights while steps 1–12 play, and the **CH-B** dot lights while steps 13–24 play.

### 3.2 Channel Knob Specifications & Scaling

#### CH-A & CH-B (Bipolar Controls)

| Property | Value |
| :--- | :--- |
| Voltage Output | −5V to +5V |
| Default Position | 12 o'clock (0.00V, center-detent) |
| Fully Anti-Clockwise | −5.00V |
| Straight Up | 0.00V |
| Fully Clockwise | +5.00V |
| Scaling | Calibrated to equal-tempered semitones at 1V/Octave (1 Octave = 1.00V = 12 semitones) |

#### CH-C (Unipolar Control)

| Property | Value |
| :--- | :--- |
| Voltage Output | 0V to +5V |
| Default Position | 12 o'clock (+2.50V, midpoint) |
| Fully Anti-Clockwise | 0.00V |
| Straight Up | +2.50V |
| Fully Clockwise | +5.00V |

### 3.3 Trigger Out & Reset Patch Points

At the bottom of each step column lies a **TRIG OUT** jack. Clicking or tapping a jack patches an external reset point:

- **Patched Jack (Steps 1–12):** Glows amber and instantly forces the sequencer back to Step 1 upon reaching that step (e.g., patching Step 5 creates a 4-step loop).
- **Secondary Patch (Steps 13–24, 24-Step Mode):** Clicking an active jack while in 24-step mode moves the reset point into the Row B cycle (e.g., Step 17 reset).
- **Reset Status:** The active reset step is displayed on the CRT (`RESET: STEP nn` or `EXT: STEP nn`) — see Section 4.

---

## 4. CRT Data Screen & Keyboard Transpose

### 4.1 CRT Readout

The green phosphor CRT screen, top right of the panel, provides real-time diagnostic telemetry alongside a live oscilloscope trace of the voice output:

| Field | Description |
| :--- | :--- |
| **Scope Trace** | A live waveform view of the synth's audio output. |
| **STEP** | Displays current step index (`STEP: 01` to `STEP: 24`). Shows `STEP: --` when stopped. |
| **VOLT** | Displays exact active control voltage under the current `RANGE` setting (e.g., `VOLT: +1.25`). |
| **NOTE** | Displays the active pitch in musical notation relative to root pitch C3 (e.g., `NOTE: C3`, `NOTE: F#3`). |
| **Patch Status** | Reads `PATCH: NONE` when no reset is patched, `RESET: STEP nn` for a patch on steps 1–12, or `EXT: STEP nn` once a 24-step secondary patch is set. |

### 4.2 Keyboard Transpose / Preview Bar

Located at the bottom left of the chassis is an interactive **13-key virtual keyboard (C to C)**:

- **Sequence Transposition:** Tapping any key transposes the entire pitch sequence in real-time by the selected semitone offset relative to C.
- **Live Audition:** Tapping a key while the sequencer is stopped previews Step 1's pitch transposed to the selected key.
- **Active Key Highlight:** The current transpose root key is highlighted in red.

---

## 5. Tutorials & Factory Demo Patches

Use the built-in demo buttons at the bottom right of the panel to load classic sequence configurations.

### 5.1 Demo 1: "EBM" (24-Step Bassline)

**Button:** `DEMO 1: EBM`

| Setting | Value |
| :--- | :--- |
| Steps / Mode | 24 / CONT |
| Range | ±5V |
| Speed | ~110 BPM |
| Porta | 0 (disabled) |
| Dest | VCF |
| Reset Point | Patched to Step 17 (creates a 16-step sequence chaining Row A and B) |

**Sound Profile:** A driving, DAF inspired 16-step bassline demonstrating 24-step row chaining.

### 5.2 Demo 2: "ACID" (12-Step Continuous Modulation)

**Button:** `DEMO 2: ACID`

| Setting | Value |
| :--- | :--- |
| Steps / Mode | 12 / CONT |
| Range | ±5V |
| Speed | 140 BPM |
| Porta | 0 (disabled) |
| Dest | VCF |
| Reset Point | None patched |

**Sound Profile:** A classic 12-step monophonic acid motif utilizing Channel C to sweep the filter cutoff frequency independently per step.

---

## 6. Technical Specifications

- **Sequencer Architecture:** 3-channel, 12-step matrix (expandable to 24-step).
- **Audio Engine:** Web Audio API monophonic synthesiser — selectable VCO waveform (triangle/square/sawtooth/sine), footage/scale switch, ±12-semitone pitch trim, low-pass VCF with resonance, and a full ADSR-shaped VCA envelope.
- **Control Voltage Output:**
  - Channels A & B: Bipolar −5V to +5V or −1V to +1V (selectable).
  - Channel C: Unipolar 0V to +5V.
- **Clock Tempo:** Variable, 40 BPM to 240 BPM.
- **Touch & Mobile Support:** Integrated W3C Pointer Events with vertical drag-scaling and horizontal grid scrolling.

---

## Credits & Copyright

**SQ-12 Analog Sequencer**
Created & Developed by **Jose Velazquez MA**
Published by **Voltage & Wave**
Website: [voltageandwave.co.uk](https://voltageandwave.co.uk/)

Copyright © 2026 Jose Velazquez MA / Voltage & Wave. All rights reserved.
