# SQ-12 Analog Sequencer

A browser-based, Web Audio–powered emulation of an analog step sequencer:
12/24-step CH-A / CH-B pitch tracks, a CH-C modulation track routable to
filter/VCA/clock, ADSR envelope, patch-cord step reset, and a CRT-style
scope + readout.

Created & developed by **Jose Velazquez MA** — [Voltage & Wave](https://voltageandwave.co.uk/)
Copyright (c) 2026 Jose Velazquez MA / Voltage & Wave. All rights reserved.

---

## Project structure

This was originally a single ~1,400-line HTML file. It's now split for
readability and easier diffs/review in git:

```
sq12-sequencer/
├── index.html          # Markup only — no inline <style> or <script>
├── css/
│   └── styles.css       # All panel/knob/CRT styling (Tailwind handles utility classes in the markup)
├── js/
│   ├── state.js          # Shared mutable state object + constants (tracks, noteNames, waveforms)
│   ├── audio.js           # Web Audio graph, oscilloscope draw loop, previewSynth / triggerSynth
│   ├── display.js         # CRT readout (STEP / VOLT / NOTE)
│   ├── knobs.js            # Pointer-drag logic shared by every knob (global + per-step)
│   ├── controls.js         # Wave / octave / length / mode / voltage-range / CH-C-dest button banks
│   ├── sequencer.js         # Transport (start/stop/step) + the look-ahead clock scheduler
│   ├── grid.js               # Renders the 12-step knob grid, patch points, and transpose keyboard
│   ├── demos.js               # "DEMO 1: EBM" / "DEMO 2: ACID" preset data + handlers
│   └── main.js                 # Entry point — imports every module, then calls renderGrid()/renderKeyboard()
└── README.md
```

### Why a shared `state.js` instead of per-module variables

ES module imports are read-only live bindings from the consumer's side — a
module can't reassign a primitive it imported from elsewhere. Since nearly
every module here needs to read *and write* the same synth parameters
(`bpm`, `activeWaveform`, `tracks`, etc.), those live on a single exported
`state` object in `state.js`, and every other module mutates its
properties (`state.bpm = ...`) rather than trying to reassign an imported
variable. `tracks` (the CH-A/B/C step data) is exported the same way.

### Why the split is by *module*, not by *panel section*

Splitting along "what does this code talk to" (audio engine, transport
clock, knob interaction, button banks, grid rendering, presets) rather than
"what part of the UI does this render" keeps each file focused on one
responsibility and makes it easy to find where a given bug or feature lives
— e.g. anything about sound goes in `audio.js`, anything about the clock
goes in `sequencer.js`, regardless of which knob or button triggered it.

---

## Running it locally

Because `index.html` loads `js/main.js` as an ES module
(`<script type="module">`), **opening the file directly via `file://` will
fail** — browsers block module imports over `file://` due to CORS. Serve it
over HTTP instead, from the project root:

```bash
# Python (built-in, no install needed)
python3 -m http.server 8000

# or Node
npx serve .

# or VS Code's "Live Server" extension
```

Then visit `http://localhost:8000`.

## Deploying (e.g. GitHub Pages)

No build step is required — it's plain HTML/CSS/JS. Push the folder as-is
and point GitHub Pages at it (or the repo root, if this is the whole repo).
Splitting CSS/JS into separate files also means browsers can cache them
independently of `index.html`, so future edits to one file won't force a
full re-download of everything else.

## Security notes

This is a fully client-side app — no backend, no API keys, no user data —
so there isn't much of a traditional "attack surface." The couple of things
worth keeping in mind if you extend it:

- **`index.html`'s CSP meta tag** restricts script execution to `'self'`
  and the Tailwind CDN, as defense-in-depth in case that CDN were ever
  compromised.
- **No SRI hash on the Tailwind `<script>` tag.** Tailwind's play-CDN build
  is served dynamically and its content changes over time, so pinning a
  hash would break the page whenever Tailwind updates it. If you want a
  verifiable, pinned build, the real fix is to run the
  [Tailwind CLI](https://tailwindcss.com/docs/installation) locally and
  ship a compiled `styles.css` instead of loading the CDN script at all —
  that also drops the external dependency entirely.
- If a future version of this project adds a backend (saving patches,
  sharing presets, etc.), that's when real security review — auth, input
  validation, rate limiting — starts to matter. Worth revisiting this
  README's security section at that point rather than assuming today's
  notes still apply.

## Browser support

Requires Web Audio API and Pointer Events support (all modern evergreen
browsers). No polyfills included.
