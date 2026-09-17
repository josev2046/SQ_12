/*
    display.js — updates the CRT-style readout (desktop + mobile copies).
*/

import { state, noteNames } from './state.js';

export function updateDisplay(step, volt, ch = 'A') {
    const stepStr = `STEP: ${step < 0 ? '--' : step + 1}`;
    const voltStr = `VOLT: ${volt >= 0 ? '+' : ''}${volt.toFixed(2)}`;
    let noteStr = '';

    if (ch === 'C') {
        noteStr = `CTRL: C-MOD`;
    } else {
        const semitoneOffset = Math.round(volt * 12) + state.transposeSemitones + state.octaveOffsetSemitones + Math.round(state.finePitchTuneSemitones);
        const totalNote = 24 + semitoneOffset;
        const noteIndex = ((totalNote % 12) + 12) % 12;
        const octave = Math.floor(totalNote / 12);
        noteStr = `NOTE: ${noteNames[noteIndex]}${octave}`;
    }

    document.getElementById('dispStep').innerText = stepStr;
    document.getElementById('dispVolt').innerText = voltStr;
    document.getElementById('dispNote').innerText = noteStr;

    if (document.getElementById('dispStepMobile')) {
        document.getElementById('dispStepMobile').innerText = stepStr;
        document.getElementById('dispVoltMobile').innerText = voltStr;
        document.getElementById('dispNoteMobile').innerText = noteStr;
    }
}
