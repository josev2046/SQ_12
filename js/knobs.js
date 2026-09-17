/*
    knobs.js — drag-to-turn behaviour for every knob on the panel.

    Uses event delegation on `document` (same as the original), so it works
    for the per-step knobs even though they're created dynamically later by
    grid.js's renderGrid(). Import order relative to grid.js doesn't matter.
*/

import { state, tracks } from './state.js';
import { initAudio, previewSynth, stopPreview } from './audio.js';
import { updateDisplay } from './display.js';

let activeKnob = null, startY = 0, startVal = 0;

export function updateKnobVisual(knobEl, val) {
    if (knobEl.hasAttribute('data-ch')) {
        const ch = knobEl.dataset.ch;
        if (ch === 'C') {
            knobEl.style.transform = `rotate(${-135 + (val / 5) * 270}deg)`;
        } else {
            knobEl.style.transform = `rotate(${val * 27}deg)`;
        }
    } else {
        knobEl.style.transform = `rotate(${-135 + (val / 100) * 270}deg)`;
    }
}

document.addEventListener('pointerdown', async (e) => {
    if (e.target.classList.contains('knob')) {
        await initAudio();
        activeKnob = e.target;
        if (activeKnob.setPointerCapture) activeKnob.setPointerCapture(e.pointerId);
        startY = e.clientY;
        startVal = parseFloat(activeKnob.dataset.val);

        if (activeKnob.hasAttribute('data-step')) {
            const ch = activeKnob.dataset.ch;
            const uiStep = parseInt(activeKnob.dataset.step);
            const is24 = state.activeSeqMode.startsWith('24');
            const stepIdx = uiStep + (ch === 'B' && is24 ? 12 : 0);

            let displayVal = parseFloat(activeKnob.dataset.val);
            if (ch === 'A' || ch === 'B') displayVal *= state.voltageRangeMultiplier;

            updateDisplay(stepIdx, displayVal, ch);

            if (!state.isPlaying) {
                let pVal = is24 ? (stepIdx < 12 ? tracks.A[uiStep] : tracks.B[uiStep]) : tracks.A[uiStep];
                pVal *= state.voltageRangeMultiplier;
                let fVal = tracks.C[uiStep];
                previewSynth(pVal, fVal, true);
            }
        }
    }
});

document.addEventListener('pointermove', (e) => {
    if (activeKnob) {
        let isSeqKnob = activeKnob.hasAttribute('data-ch');

        if (isSeqKnob) {
            const ch = activeKnob.dataset.ch;
            let newVal;
            if (ch === 'C') {
                newVal = Math.max(0, Math.min(5, startVal + (startY - e.clientY) * 0.025));
            } else {
                newVal = Math.max(-5, Math.min(5, startVal + (startY - e.clientY) * 0.05));
            }

            tracks[ch][activeKnob.dataset.step] = newVal;

            const uiStep = parseInt(activeKnob.dataset.step);
            const is24 = state.activeSeqMode.startsWith('24');
            const stepIdx = uiStep + (ch === 'B' && is24 ? 12 : 0);

            let displayVal = newVal;
            if (ch === 'A' || ch === 'B') displayVal *= state.voltageRangeMultiplier;

            updateDisplay(stepIdx, displayVal, ch);

            if (!state.isPlaying && state.isPreviewing) {
                let pVal = is24 ? (stepIdx < 12 ? tracks.A[uiStep] : tracks.B[uiStep]) : tracks.A[uiStep];
                pVal *= state.voltageRangeMultiplier;
                let fVal = tracks.C[uiStep];
                previewSynth(pVal, fVal, false);
            }
            activeKnob.dataset.val = newVal;
        } else {
            let newVal = Math.max(0, Math.min(100, startVal + (startY - e.clientY)));

            if (activeKnob.id === 'clockSpeed') {
                state.bpm = 40 + (newVal / 100) * 200;
            } else if (activeKnob.id === 'portamento') {
                state.portamentoTime = 0.01 + (newVal / 100) * 0.3;
            } else if (activeKnob.id === 'pitchTuneKnob') {
                state.finePitchTuneSemitones = -12 + (newVal / 100) * 24;
            } else if (activeKnob.id === 'envAttack') {
                state.attackTime = 0.005 + (newVal / 100) * 0.5;
            } else if (activeKnob.id === 'envDecay') {
                state.decayTime = 0.02 + (newVal / 100) * 0.8;
            } else if (activeKnob.id === 'envSustain') {
                state.sustainLevel = newVal / 100;
            } else if (activeKnob.id === 'envRelease') {
                state.releaseTime = 0.02 + (newVal / 100) * 1.5;
            }
            activeKnob.dataset.val = newVal;
        }

        updateKnobVisual(activeKnob, activeKnob.dataset.val);
    }
});

const endDrag = (e) => {
    if (activeKnob) {
        if (activeKnob.releasePointerCapture && e.pointerId) {
            try { activeKnob.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        activeKnob = null;
        stopPreview();
    }
};
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);
